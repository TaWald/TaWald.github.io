<h2 id="challenges" class="section-title scroll-element">Challenges &amp; Awards</h2>

<ol class="pub-list">
{% for c in site.data.challenges.main %}
  <li class="pub-row">
    <div class="pub-media">
      {% if c.image %}<img src="{{ c.image }}" class="teaser{% if c.image_fit == 'contain' %} teaser-contain{% endif %}" alt="{{ c.title | strip | escape }}" loading="lazy">{% else %}<div class="teaser teaser-placeholder" aria-hidden="true"><i class="fas fa-trophy"></i></div>{% endif %}
      {% if c.placement %}<abbr class="badge">{{ c.placement }}</abbr>{% endif %}
    </div>
    <div class="pub-body">
      <div class="title">{% if c.challengelink %}<a href="{{ c.challengelink }}" target="_blank" rel="noopener">{{ c.title }}</a>{% else %}{{ c.title }}{% endif %}</div>
      {% if c.team %}<div class="team">{{ c.team }}</div>{% endif %}
      {% if c.nteams %}<div class="nteams">Participating teams: {{ c.nteams }}</div>{% endif %}
      <div class="periodical"><em>{{ c.conference }}</em></div>
      <div class="links">
        {% if c.challengelink %}<a href="{{ c.challengelink }}" class="btn" target="_blank" rel="noopener">Challenge</a>{% endif %}
        {% if c.leaderboard %}<a href="{{ c.leaderboard }}" class="btn" target="_blank" rel="noopener">Leaderboard</a>{% endif %}
        {% if c.code %}<a href="{{ c.code }}" class="btn" target="_blank" rel="noopener">Code</a>{% endif %}
        {% if c.certificate %}<a href="{{ c.certificate }}" class="btn" target="_blank" rel="noopener">Certificate</a>{% endif %}
        {% if c.report %}<a href="{{ c.report }}" class="btn" target="_blank" rel="noopener">Technical Report</a>{% endif %}
        {% if c.bibtex %}<a href="{{ c.bibtex }}" class="btn" target="_blank" rel="noopener">BibTeX</a>{% endif %}
        {% if c.notes %}<span class="pub-note">{{ c.notes }}</span>{% endif %}
        {% if c.others %}{{ c.others }}{% endif %}
      </div>
    </div>
  </li>
{% endfor %}
</ol>
