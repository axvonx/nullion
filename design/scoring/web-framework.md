# Scoring: web-framework (Name a web framework)

122 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (3%) | 4 | 0 |
| npe | 22 (18%) | 22 | 0 |
| leak | 53 (43%) | 49 | 0 |
| race | 4 (3%) | 4 | 0 |
| heisenbug | 39 (32%) | 43 | 0 |

Same tier as today: 114/122 (93%).

## Off-by-one (4)

React 5.1 [13686c 476740q 2f], Laravel 5.0* [5106c 211530q 2f], Django 4.6 [4791c 313021q 0f], Ruby on Rails 4.5 [14697c 339139q 20f]

## Null pointer exception (22)

Flask 4.4 [3414c 55724q 0f], Express 4.4 [1295c 95509q 1f], Angular 4.3 [5578c 304165q 3f], Vue.js 4.3 [3817c 107354q 3f], Next.js 4.1 [9298c 40766q 0f], ASP.NET 4.0* [3675c 376026q 0f], Spring Boot 3.9 [3397c 148121q 1f], Spring 3.9 [3167c 211136q 7f], FastAPI 3.1 [3525c 6657q 0f], Svelte 2.9 [3123c 5858q 0f], Gatsby 2.6 [309c 5966q 0f], Symfony 2.6 [1227c 74104q 0f], Nest.js 2.5 [0c 12511q 8f], Backbone.js 2.5 [543c 20615q 0f], Nuxt 2.5 [0c 12684q 0f], Gin 2.3 [0c 886q 0f], SvelteKit 2.3 [0c 2738q 0f], Ember.js 2.2 [661c 23979q 0f], Streamlit 2.2 [0c 2169q 0f], Spark 2.1 [0c 82165q 0f], Sinatra 2.1 [169c 5391q 1f], Preact 2.1 [0c 571q 0f]

## Memory leak (53)

Remix 2.0 [0c 739q 0f], Astro 2.0 [0c 594q 2f], Koa 1.9 [0c 1236q 0f], Fastify 1.9 [0c 769q 0f], CodeIgniter 1.9 [485c 69624q 3f], Tornado 1.9 [292c 3794q 0f], Struts 1.9 [0c 3608q 4f], Meteor 1.8 [317c 29148q 2f], Jersey 1.8 [0c 10413q 4f], Play Framework 1.8 [295c 17282q 0f], aiohttp 1.7 [0c 1680q 0f], Dojo 1.7 [0c 9225q 6f], Actix 1.7 [0c 511q 0f], CakePHP 1.7 [361c 31727q 5f], Knockout 1.7 [275c 20272q 0f], Blade 1.7 [0c 7396q 0f], Quarkus 1.7 [792c 4458q 4f], Bottle 1.7 [0c 1487q 2f], Eclipse Vert.x 1.6 [208c 2656q 3f], Phoenix 1.6 [425c 4070q 1f], Echo 1.6 [0c 6437q 3f], Starlette 1.6 [0c 309q 1f], Polymer 1.5 [313c 8271q 0f], Pyramid 1.5 [163c 2218q 0f], Dropwizard 1.5 [0c 2011q 0f], Fiber 1.5 [0c 529q 0f], Micronaut 1.4 [0c 1792q 6f], Lit 1.4 [0c 374q 0f], Sails 1.4 [324c 6581q 0f], Quart 1.4 [0c 180q 0f], Hapi 1.4 [0c 1364q 3f], Sanic 1.4 [0c 206q 1f], Axum 1.4 [0c 153q 0f], web2py 1.3 [135c 2134q 2f], Grails 1.3 [449c 29878q 9f], Ktor 1.3 [0c 1231q 2f], Reagent 1.2 [0c 344q 2f], AdonisJS 1.2 [0c 743q 0f], Aurelia 1.1 [0c 3409q 1f], Falcon 1.1 [0c 87q 11f], Eve 1.1 [0c 481q 5f], Google Web Toolkit 1.1 [696c 20828q 5f], Riot.js 1.1 [0c 226q 0f], Helidon 1.0 [0c 153q 1f], Ractive.js 1.0 [0c 433q 0f], Ratpack 1.0 [0c 87q 1f], Javalin 0.9 [0c 89q 0f], TurboGears 0.9 [38c 111q 1f], CanJS 0.8 [0c 225q 0f], Enyo 0.6 [133c 196q 0f], Ninja 0.6 [0c 650q 55f], Proteus 0.6 [0c 71q 3f], Emmett 0.4 [0c 749q 0f]

## Race condition (4)

Armeria 1.1 [0c 35q 0f], Light-4j 0.8 [0c 44q 0f], Knockback.js 0.6 [0c 23q 0f], Gemini 0.5 [0c 45q 0f]

## Heisenbug (39)

Apache Wicket 1.3 [196c 0q 0f], Mithril 1.3 [0c 0q 3f], Robyn 1.3 [0c 0q 0f], Responder 1.2 [0c 0q 5f], Apache Tapestry 1.1 [97c 0q 1f], ActFramework 0.9 [0c 15q 0f], Litestar 0.9 [0c 3q 2f], Curacao 0.8 [0c 0q 0f], Solon 0.8 [0c 0q 0f], BlackSheep 0.8 [0c 2q 0f], Exoskeleton 0.7 [0c 0q 0f], Webware 0.7 [0c 0q 0f], Microdot 0.7 [0c 0q 0f], Inverno 0.7 [0c 0q 0f], Panther 0.7 [0c 0q 0f], Jooby 0.7 [0c 16q 0f], Revenj 0.6 [0c 0q 0f], Rapidoid 0.6 [0c 8q 0f], Jawn 0.6 [0c 0q 2f], MuServer 0.6 [0c 0q 0f], Minijax 0.6 [0c 0q 0f], Magician 0.5 [0c 0q 0f], TODAY-Web 0.5 [0c 0q 0f], ActiveJ 0.5 [0c 0q 0f], RestExpress 0.5 [0c 0q 0f], Duel 0.5 [0c 0q 1f], LoveQQ 0.4 [0c 0q 0f], Bayou 0.4 [0c 0q 0f], mrhttp 0.4 [0c 0q 0f], HServer 0.4 [0c 0q 0f], Wizzardo HTTP 0.4 [0c 0q 0f], Voovan 0.3 [0c 0q 0f], socketify.py 0.3 [0c 0q 0f], jsblocks 0.3 [0c 4q 0f], Redkale 0.3 [0c 0q 0f], Avaje Jex 0.3 [0c 0q 0f], OfficeFloor 0.2 [0c 0q 0f], Lavaca 0.2 [0c 0q 0f], tio-boot 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
