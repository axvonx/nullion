# Scoring: static-site-generator (Name a static site generator)

366 answers (Bit Flip and Works on my machine left out); 23 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (0%) | 1 | 0 |
| npe | 13 (4%) | 13 | 0 |
| leak | 40 (11%) | 35 | 0 |
| race | 12 (3%) | 13 | 0 |
| heisenbug | 300 (82%) | 304 | 0 |

Same tier as today: 341/366 (93%).

## Off-by-one (1)

Next.js 6.0* [0c 40766q 1f]

## Null pointer exception (13)

Jekyll 4.1 [0c 6342q 0f], Hugo 3.6 [0c 1327q 0f], Gatsby 3.6 [0c 5966q 0f], MkDocs 3.0 [0c 295q 8f], Astro 2.8 [0c 1q 2f], Docusaurus 2.6 [0c 520q 0f], Sphinx 2.4 [0c 2468q 0f], VuePress 2.4 [0c 245q 0f], Hexo 2.3 [0c 281q 1f], Pelican 2.3 [0c 302q 0f], VitePress 2.3 [0c 33q 0f], Nuxt 2.2 [0c 12684q 0f], GitBook 2.1 [0c 179q 0f]

## Memory leak (40)

Statamic 1.8 [0c 59q 0f], Octopress 1.7 [0c 351q 0f], Gridsome 1.7 [0c 184q 0f], blogdown 1.6 [0c 526q 0f], SvelteKit 1.6 [0c 2738q 0f], Quarto 1.6 [0c 1070q 8f], Publish 1.5 [0c 3393q 1f], Slate 1.4 [0c 112q 3f], Sapper 1.3 [0c 380q 0f], R Markdown 1.3 [0c 10740q 12f], DocFX 1.3 [0c 133q 6f], Nanoc 1.3 [0c 97q 3f], bookdown 1.3 [0c 1038q 0f], Bolt 1.2 [0c 141q 0f], DocPad 1.2 [0c 254q 0f], Hakyll 1.2 [0c 80q 0f], Lektor 1.1 [0c 58q 0f], Brunch 1.1 [0c 366q 0f], Metalsmith 1.0 [0c 59q 0f], Jigsaw 0.9 [0c 519q 0f], Middleman 0.9 [0c 551q 1f], Assemble 0.8 [0c 230q 0f], Harp 0.8 [0c 63q 0f], Ace 0.8 [0c 206q 0f], Scroll 0.7 [0c 22537q 5f], Hydrogen 0.6 [0c 91q 0f], Tags 0.6 [0c 11836q 3f], Saga 0.6 [0c 502q 0f], Slick 0.6 [0c 2472q 0f], Coil 0.6 [0c 173q 1f], Dapper 0.6 [0c 2903q 0f], Keystone 0.6 [0c 243q 0f], Charge 0.5 [0c 321q 0f], Silex 0.5 [0c 1362q 0f], Cobalt 0.5 [0c 221q 6f], Poltergeist 0.4 [0c 490q 0f], Lego 0.4 [0c 245q 17f], Tapestry 0.4 [0c 979q 0f], Finch 0.4 [0c 71q 0f], Last 0.0* [0c 111q 6f]

## Race condition (12)

Zola 1.9 [0c 15q 26f], mdBook 1.8 [0c 3q 33f], Docsify 1.8 [0c 41q 0f], Antora 1.5 [0c 27q 3f], Cactus 1.1 [0c 24q 0f], Expose 1.0 [0c 33q 2f], Analog 0.9 [0c 33q 15f], React Static 0.9 [0c 38q 1f], Spike 0.6 [0c 37q 0f], Scully 0.6 [0c 29q 0f], Wintersmith 0.4 [0c 23q 0f], Blackhole 0.3 [0c 33q 2f]

## Heisenbug (300)

Nikola 1.8 [0c 15q 10f], iles 1.8 [0c 0q 0f], Hepek 1.7 [0c 0q 0f], Antwar 1.6 [0c 0q 0f], Drupan 1.6 [0c 0q 0f], Blo 1.6 [0c 0q 0f], Jus 1.6 [0c 3q 0f], entu-ssg 1.5 [0c 0q 0f], wb 1.5 [0c 0q 1f], Madoko 1.5 [0c 0q 0f], onessg 1.5 [0c 0q 0f], Minimal 1.4 [0c 0q 0f], Sculpin 1.4 [0c 5q 1f], Gridea 1.3 [0c 0q 3f], Docpress 1.3 [0c 0q 0f], Publii 1.3 [0c 0q 5f], Qgoda 1.2 [0c 1q 0f], Lume 1.2 [0c 6q 3f], 20ful 1.2 [0c 0q 0f], dssg 1.2 [0c 0q 0f], Ago 1.2 [0c 0q 0f], Elsa 1.2 [0c 0q 0f], picossg 1.2 [0c 0q 0f], Poet 1.2 [0c 6q 1f], Bestatic 1.1 [0c 0q 0f], gssg 1.1 [0c 0q 2f], idlisite 1.1 [0c 0q 0f], JBake 1.1 [0c 18q 3f], Hasclunk 1.1 [0c 0q 0f], Waffel 1.1 [0c 0q 0f], Bridgetown 1.1 [0c 0q 0f], Statue 1.1 [0c 0q 0f], Yass 1.1 [0c 0q 0f], Primo 1.1 [0c 0q 1f], Mangony 1.1 [0c 0q 0f], Greenwood 1.0 [0c 0q 0f], Grow 1.0 [0c 0q 0f], Ruhoh 1.0 [0c 3q 0f], wmk 1.0 [0c 0q 0f], Sitefi 1.0 [0c 0q 0f], Bake 1.0 [0c 0q 3f], Baker 1.0 [0c 0q 1f], Docnado 1.0 [0c 0q 0f], Lerret 1.0 [0c 0q 0f], Rspress 1.0* [0c 0q 0f], Cryogen 1.0 [0c 0q 0f], Teedoc 1.0 [0c 0q 0f], Sitio 1.0 [0c 0q 0f], Abell 1.0 [0c 0q 0f], Stacy 1.0 [0c 0q 0f], Statie 0.9 [0c 0q 0f], Roots 0.9 [0c 0q 0f], Webby 0.9 [0c 16q 1f], Yellow 0.9 [0c 7q 0f], Frog 0.9 [0c 0q 0f], Styx 0.9 [0c 0q 4f], MarkBind 0.9 [0c 0q 0f], Blogofile 0.9 [0c 0q 1f], Sitegen 0.9 [0c 0q 1f], Kart 0.9 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
