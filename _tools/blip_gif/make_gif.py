"""Render the 'blip kernel' GIF: a 3x3x3 kernel translated through every valid
position inside one 8x8x8 token. Right panel: the bank of weight templates a
linear 8^3 -> D patch embedding would need to detect the same pattern
everywhere (one per position), filling up as the kernel moves.
"""
import math
import sys
from PIL import Image, ImageDraw, ImageFont

N = 8          # token size (voxels per axis)
K = 3          # kernel size
P = N - K + 1  # valid positions per axis -> 6
NPOS = P ** 3  # 216

SS = 2                 # supersampling factor for anti-aliasing
W, H = 1120, 520       # output size
LAYOUT = "wide"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

THEMES = {
    "light": dict(
        bg=(252, 252, 251), grid=(222, 221, 216), wall=(245, 244, 241), edge=(150, 149, 144),
        text=(30, 32, 40), muted=(110, 109, 104),
        k_top=(134, 182, 239), k_left=(42, 120, 214), k_right=(28, 92, 171),
        blip_top=(255, 196, 120), blip_left=(235, 104, 52), blip_right=(196, 78, 30),
        shadow=(183, 211, 246), slot=(236, 235, 231), slot_done=(134, 182, 239),
        slot_cur=(235, 104, 52), accent=(4, 51, 97),
    ),
    "dark": dict(
        bg=(32, 33, 43), grid=(62, 64, 78), wall=(38, 39, 50), edge=(120, 122, 138),
        text=(232, 233, 238), muted=(160, 162, 175),
        k_top=(133, 186, 245), k_left=(57, 135, 229), k_right=(36, 100, 185),
        blip_top=(255, 190, 120), blip_left=(217, 89, 38), blip_right=(176, 70, 28),
        shadow=(44, 72, 115), slot=(52, 54, 68), slot_done=(57, 135, 229),
        slot_cur=(240, 120, 60), accent=(62, 183, 240),
    ),
}

C30, S30 = math.cos(math.radians(30)), math.sin(math.radians(30))
U = 21.0  # voxel edge length in px (pre-supersampling)
OX, OY = 300, 100
BANK = (640, 150)  # screen position of the (0,0,N) top-back corner region


def iso(x, y, z):
    """3D -> 2D isometric. Viewer looks from +x, +y, +z."""
    u = (x - y) * C30 * U
    v = (x + y) * S30 * U - z * U
    return ((OX + u) * SS, (OY + v + N * U) * SS)


def poly(d, pts, fill, outline=None, width=1):
    d.polygon([iso(*p) for p in pts], fill=fill, outline=outline)
    if outline is not None and width > 1:
        q = [iso(*p) for p in pts]
        d.line(q + [q[0]], fill=outline, width=width * SS, joint="curve")


def cube(d, x, y, z, top, left, right, edge):
    # visible faces: top (z+1), +x face ("right"), +y face ("left")
    poly(d, [(x, y, z + 1), (x + 1, y, z + 1), (x + 1, y + 1, z + 1), (x, y + 1, z + 1)], top)
    poly(d, [(x + 1, y, z), (x + 1, y + 1, z), (x + 1, y + 1, z + 1), (x + 1, y, z + 1)], right)
    poly(d, [(x, y + 1, z), (x + 1, y + 1, z), (x + 1, y + 1, z + 1), (x, y + 1, z + 1)], left)
    for a, b in [
        ((x, y, z + 1), (x + 1, y, z + 1)), ((x + 1, y, z + 1), (x + 1, y + 1, z + 1)),
        ((x + 1, y + 1, z + 1), (x, y + 1, z + 1)), ((x, y + 1, z + 1), (x, y, z + 1)),
        ((x + 1, y, z), (x + 1, y + 1, z)), ((x + 1, y + 1, z), (x, y + 1, z)),
        ((x + 1, y, z), (x + 1, y, z + 1)), ((x + 1, y + 1, z), (x + 1, y + 1, z + 1)),
        ((x, y + 1, z), (x, y + 1, z + 1)),
    ]:
        d.line([iso(*a), iso(*b)], fill=edge, width=max(1, SS))


def draw_walls(d, t):
    # three back walls: floor z=0, wall x=0, wall y=0
    poly(d, [(0, 0, 0), (N, 0, 0), (N, N, 0), (0, N, 0)], t["wall"])
    poly(d, [(0, 0, 0), (0, N, 0), (0, N, N), (0, 0, N)], t["wall"])
    poly(d, [(0, 0, 0), (N, 0, 0), (N, 0, N), (0, 0, N)], t["wall"])
    for i in range(N + 1):
        # floor
        d.line([iso(i, 0, 0), iso(i, N, 0)], fill=t["grid"], width=SS)
        d.line([iso(0, i, 0), iso(N, i, 0)], fill=t["grid"], width=SS)
        # x=0 wall
        d.line([iso(0, i, 0), iso(0, i, N)], fill=t["grid"], width=SS)
        d.line([iso(0, 0, i), iso(0, N, i)], fill=t["grid"], width=SS)
        # y=0 wall
        d.line([iso(i, 0, 0), iso(i, 0, N)], fill=t["grid"], width=SS)
        d.line([iso(0, 0, i), iso(N, 0, i)], fill=t["grid"], width=SS)


def draw_shadows(d, t, px, py, pz):
    # projection of the kernel onto the three back walls (depth cue)
    poly(d, [(px, py, 0), (px + K, py, 0), (px + K, py + K, 0), (px, py + K, 0)], t["shadow"])
    poly(d, [(0, py, pz), (0, py + K, pz), (0, py + K, pz + K), (0, py, pz + K)], t["shadow"])
    poly(d, [(px, 0, pz), (px + K, 0, pz), (px + K, 0, pz + K), (px, 0, pz + K)], t["shadow"])
    # the blip's own shadow (center voxel)
    cx, cy, cz = px + 1, py + 1, pz + 1
    poly(d, [(cx, cy, 0), (cx + 1, cy, 0), (cx + 1, cy + 1, 0), (cx, cy + 1, 0)], t["slot_cur"])
    poly(d, [(0, cy, cz), (0, cy + 1, cz), (0, cy + 1, cz + 1), (0, cy, cz + 1)], t["slot_cur"])
    poly(d, [(cx, 0, cz), (cx + 1, 0, cz), (cx + 1, 0, cz + 1), (cx, 0, cz + 1)], t["slot_cur"])


def draw_front_edges(d, t):
    E = t["edge"]
    for a, b in [
        ((N, 0, 0), (N, N, 0)), ((0, N, 0), (N, N, 0)), ((N, N, 0), (N, N, N)),
        ((N, 0, 0), (N, 0, N)), ((0, N, 0), (0, N, N)),
        ((0, 0, N), (N, 0, N)), ((0, 0, N), (0, N, N)), ((N, 0, N), (N, N, N)), ((0, N, N), (N, N, N)),
    ]:
        d.line([iso(*a), iso(*b)], fill=E, width=2 * SS)


def draw_kernel(img, t, px, py, pz):
    d = ImageDraw.Draw(img)
    # the blip: one bright voxel in the kernel centre
    cube(d, px + 1, py + 1, pz + 1, t["blip_top"], t["blip_left"], t["blip_right"], t["bg"])
    # the 3x3x3 kernel as a translucent box so the blip stays visible
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    o = ImageDraw.Draw(ov)
    a = 85
    X, Y, Z = px + K, py + K, pz + K
    faces = [
        ([(px, py, Z), (X, py, Z), (X, Y, Z), (px, Y, Z)], t["k_top"]),
        ([(X, py, pz), (X, Y, pz), (X, Y, Z), (X, py, Z)], t["k_right"]),
        ([(px, Y, pz), (X, Y, pz), (X, Y, Z), (px, Y, Z)], t["k_left"]),
    ]
    for pts, col in faces:
        o.polygon([iso(*p) for p in pts], fill=col + (a,))
    line = t["k_right"] + (255,)
    for i in range(K + 1):
        # subdivisions on the three visible faces
        o.line([iso(px + i, py, Z), iso(px + i, Y, Z)], fill=line, width=SS)
        o.line([iso(px, py + i, Z), iso(X, py + i, Z)], fill=line, width=SS)
        o.line([iso(X, py + i, pz), iso(X, py + i, Z)], fill=line, width=SS)
        o.line([iso(X, py, pz + i), iso(X, Y, pz + i)], fill=line, width=SS)
        o.line([iso(px + i, Y, pz), iso(px + i, Y, Z)], fill=line, width=SS)
        o.line([iso(px, Y, pz + i), iso(X, Y, pz + i)], fill=line, width=SS)
    img.alpha_composite(ov)
    # re-draw the blip on top, partially transparent, so it reads as "inside" but stays orange
    ov2 = Image.new("RGBA", img.size, (0, 0, 0, 0))
    cube(ImageDraw.Draw(ov2), px + 1, py + 1, pz + 1, t["blip_top"] + (190,), t["blip_left"] + (190,),
         t["blip_right"] + (190,), (0, 0, 0, 0))
    img.alpha_composite(ov2)


def text(d, xy, s, size, fill, bold=False, anchor="la"):
    f = ImageFont.truetype(FONT_B if bold else FONT, size * SS)
    d.text((xy[0] * SS, xy[1] * SS), s, font=f, fill=fill, anchor=anchor)


def draw_bank(d, t, idx):
    """6 slabs (one per z-offset) of 6x6 slots = 216 templates."""
    x0, y0 = BANK
    cell, gap, slab_gap = (17, 3, 22) if LAYOUT == "wide" else (22, 3, 22)
    slab = P * cell + (P - 1) * gap
    for sz in range(P):
        col, row = sz % 3, sz // 3
        sx = x0 + col * (slab + slab_gap)
        sy = y0 + row * (slab + slab_gap + 16)
        text(d, (sx, sy - 16), f"z-offset {sz}", 11 if LAYOUT == "wide" else 13, t["muted"])
        for sy_ in range(P):
            for sx_ in range(P):
                n = sz * P * P + sy_ * P + sx_
                fill = t["slot"]
                if n < idx:
                    fill = t["slot_done"]
                if n == idx:
                    fill = t["slot_cur"]
                cx = sx + sx_ * (cell + gap)
                cy = sy + sy_ * (cell + gap)
                d.rounded_rectangle(
                    [cx * SS, cy * SS, (cx + cell) * SS, (cy + cell) * SS], radius=3 * SS, fill=fill
                )


def frame(theme, idx, final=False):
    t = THEMES[theme]
    img = Image.new("RGBA", (W * SS, H * SS), t["bg"] + (255,))
    d = ImageDraw.Draw(img)
    pos = min(idx, NPOS - 1)
    pz, rem = divmod(pos, P * P)
    py, px = divmod(rem, P)
    shown = NPOS if final else pos + 1
    wide = LAYOUT == "wide"
    fs = 1.0 if wide else 1.25

    # left / top: the token
    if wide:
        text(d, (40, 30), "One 8×8×8 token, one 3×3×3 “blip” pattern", 19, t["text"], bold=True)
        text(d, (40, 58), "The same pattern can sit at 6 × 6 × 6 = 216 offsets inside the token", 14, t["muted"])
    else:
        text(d, (30, 26), "One 8×8×8 token, one 3×3×3 blip", int(19 * fs), t["text"], bold=True)
        text(d, (30, 58), "216 possible offsets inside the token", int(14 * fs), t["muted"])
    draw_walls(d, t)
    draw_shadows(d, t, px, py, pz)
    draw_kernel(img, t, px, py, pz)
    d = ImageDraw.Draw(img)
    draw_front_edges(d, t)
    if wide:
        text(d, (40, H - 44), f"offset ({px}, {py}, {pz})", 15, t["text"])
        text(d, (230, H - 44), f"{shown:>3d} / {NPOS}", 15, t["text"], bold=True)
    else:
        text(d, (30, 440), f"offset ({px}, {py}, {pz})", int(15 * fs), t["text"])
        text(d, (W - 30, 440), f"{shown} / {NPOS}", int(15 * fs), t["text"], bold=True, anchor="ra")

    # right / bottom: the template bank
    if wide:
        text(d, (640, 30), "A linear 8³ → D patch embedding", 19, t["text"], bold=True)
        text(d, (640, 58), "needs its own weight template for every offset", 14, t["muted"])
    else:
        text(d, (30, 492), "Linear 8³ → D patch embedding:", int(17 * fs), t["text"], bold=True)
        text(d, (30, 522), "one weight template per offset", int(14 * fs), t["muted"])
    draw_bank(d, t, NPOS if final else pos)
    if final:
        msg = "216 templates  vs.  1 shared 27-weight conv kernel" if wide else "216 templates vs. 1 shared conv kernel"
    else:
        msg = f"{shown} template{'s' if shown > 1 else ''} so far"
    if wide:
        text(d, (640, H - 44), msg, 15, t["accent"] if final else t["text"], bold=final)
    else:
        text(d, (30, H - 46), msg, int(15 * fs), t["accent"] if final else t["text"], bold=final)
    return img.convert("RGB").resize((W, H), Image.LANCZOS)


def build(theme, out):
    frames, durs = [], []
    for i in range(NPOS):
        frames.append(frame(theme, i))
        if i < 6:
            durs.append(420)
        elif i < 36:
            durs.append(110)
        else:
            durs.append(45)
    frames.append(frame(theme, NPOS, final=True))
    durs.append(3200)
    # shared adaptive palette for small files
    strip = Image.new("RGB", (W * 3, H))
    for j, fr in enumerate([frames[0], frames[100], frames[-1]]):
        strip.paste(fr, (j * W, 0))
    pal = strip.quantize(colors=160, method=Image.Quantize.MEDIANCUT)
    q = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    q[0].save(out, save_all=True, append_images=q[1:], duration=durs, loop=0, optimize=True, disposal=1)
    frames[40].save(out.replace(".gif", "_still.png"))
    print(out, sum(durs) / 1000, "s")


if __name__ == "__main__":
    outdir = sys.argv[1]
    which = sys.argv[2] if len(sys.argv) > 2 else "wide"
    if which == "wide":
        build("light", f"{outdir}/blip_kernel_light.gif")
        build("dark", f"{outdir}/blip_kernel_dark.gif")
    else:
        LAYOUT = "tall"
        W, H = 600, 1000
        OX, OY = 300, 96
        BANK = (38, 590)
        build("light", f"{outdir}/blip_kernel_tall_light.gif")
        build("dark", f"{outdir}/blip_kernel_tall_dark.gif")
