---
layout: homepage
---


<h2 id="about-me" class="section-title scroll-element">About me</h2>
I recently completed my Ph.D. at the [German Cancer Research Center (DKFZ)](https://www.dkfz.de/en/index.html), advised by [Klaus H. Maier-Hein](https://scholar.google.com/citations?user=oCrBpVMAAAAJ&hl=de) where I worked with many great colleagues, including [Fabian Isensee](https://scholar.google.com/citations?user=PjerEe4AAAAJ&hl=en) and [Paul Jäger](https://scholar.google.com/citations?user=9B9-8h0AAAAJ&hl=en&oi=ao). My research focuses on representation learning and foundation models, spanning self-supervised learning and vision-language models. I'm interested in understanding what deep networks learn and in building representations that transfer across tasks, with 3D medical imaging as the primary domain. 

During my internship at [Microsoft Health Futures](https://www.microsoft.com/en-us/research/lab/microsoft-health-futures/) in Cambridge, UK, I worked with [Fernando Pérez-García](https://scholar.google.com/citations?user=Gc2eg3kAAAAJ&hl=en) on 3D vision-language models for radiology report generation. The resulting model improved on the prior state of the art by +20 Macro-F1 and is now used by Microsoft's collaborators at Mayo Clinic. At DKFZ, I led pre-training efforts for [The Human Radiome Project](https://www.helmholtz.de/en/newsroom/article/helmholtz-invests-23-million-in-research-on-ai-foundation-models/) and created or maintain open-source tools used across the field, including [nnU-Net](https://github.com/MIC-DKFZ/nnUNet), [OpenMind](https://huggingface.co/datasets/MIC-DKFZ/OpenMind), and [nnssl](https://github.com/MIC-DKFZ/nnssl).


{% include_relative _includes/news.md %}

{% include pub_list.html list=site.data.publications.main title="Publications" id="publications" scholar=true %}

{% include pub_list.html list=site.data.publications_co.main title="Publications (Co-authored)" id="publications-co" %}

{% include_relative _includes/challenges.md %}

{% include_relative _includes/miscellaneous.md %}


{% include_relative _includes/contact.md %}