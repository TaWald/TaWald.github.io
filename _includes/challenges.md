<h2 id="challenges" class="scroll-element" style="margin: 2px 0px -15px;">Challenges & Hackathons</h2>

<div class="publications">
<ol class="bibliography">

{% for link in site.data.challenges.main %}

<li>
<div class="pub-row">
  <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
    {% if link.image %} 
    <img src="{{ link.image }}" class="teaser img-fluid z-depth-1" style="width=100;height=40%">
    {% endif %}
    {% if link.placement %} 
    <abbr class="badge">{{ link.placement }}</abbr>
    {% endif %}
  </div>
  <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      <div class="title"><a href="{{ link.pdf }}">{{ link.title }}</a></div>
      <div class="team">{{ link.team }}</div>
      <div class="nteams"> Participating teams: {{ link.nteams }}</div>
      <div class="periodical"><em>{{ link.conference }}</em>
      </div>
    <div class="links">
      {% if link.challengelink %} 
      <a href="{{ link.challengelink }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Challenge</a>
      {% endif %}
      {% if link.leaderboard %} 
      <a href="{{ link.leaderboard }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Leaderboard</a>
      {% endif %}
      {% if link.code %} 
      <a href="{{ link.code }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Code</a>
      {% endif %}
      {% if link.report %} 
      <a href="{{ link.report }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Technical Report</a>
      {% endif %}
      {% if link.bibtex %} 
      <a href="{{ link.bibtex }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">BibTex</a>
      {% endif %}
      {% if link.notes %} 
      <strong> <i style="color:#e74d3c">{{ link.notes }}</i></strong>
      {% endif %}
      {% if link.others %} 
      {{ link.others }}
      {% endif %}
    </div>
  </div>
</div>
</li>

<br>

{% endfor %}

</ol>
</div>

