# Scoring: web-framework (Name a web framework)

122 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (3%) | 4 | 0 |
| npe | 25 (20%) | 25 | 0 |
| leak | 43 (35%) | 43 | 0 |
| race | 4 (3%) | 4 | 0 |
| heisenbug | 46 (38%) | 46 | 0 |

Same tier as today: 122/122 (100%).

## Off-by-one (4)

React 5.1 [13686c 23291q 2f 0s], Laravel 5.0* [5106c 211530q 2f 0s], Django 4.6 [4791c 313021q 0f 0s], Ruby on Rails 4.5 [14697c 339139q 20f 59071s]

## Null pointer exception (25)

Flask 4.4 [3414c 0q 0f 0s], Express 4.4 [1295c 95509q 1f 0s], Angular 4.3 [5578c 262737q 3f 0s], Vue.js 4.3 [3817c 107354q 2f 212493s], Next.js 4.1 [9298c 40766q 0f 0s], ASP.NET 4.0* [3675c 376026q 0f 0s], Spring Boot 3.9 [3397c 148121q 1f 0s], Spring 3.9 [3167c 211136q 7f 60334s], FastAPI 3.1 [3525c 6657q 0f 0s], Svelte 2.9 [3123c 0q 0f 0s], Gatsby 2.6 [309c 5966q 0f 0s], Symfony 2.6 [1227c 74104q 0f 0s], Nest.js 2.5 [0c 12509q 8f 0s], Backbone.js 2.5 [543c 20615q 0f 0s], Nuxt 2.5 [856c 12684q 0f 0s], Gin 2.3 [0c 886q 0f 0s], SvelteKit 2.3 [0c 2738q 0f 0s], Ember.js 2.2 [661c 23979q 0f 0s], Streamlit 2.2 [0c 2169q 0f 0s], Spark 2.1 [0c 561q 0f 0s], Sinatra 2.1 [169c 5391q 1f 0s], Preact 2.1 [0c 0q 0f 0s], CodeIgniter 1.9 [485c 69624q 3f 18150s]^, Meteor 1.8 [317c 29106q 2f 44789s]^, CakePHP 1.7 [361c 31727q 5f 8797s]^

## Memory leak (43)

Remix 2.0 [0c 483q 0f 0s], Astro 2.0 [0c 594q 2f 0s], Fastify 1.9 [368c 769q 0f 0s], Struts 1.9 [0c 3608q 4f 1373s], Play Framework 1.8 [295c 17282q 0f 0s], aiohttp 1.7 [0c 1680q 0f 0s], Dojo 1.7 [0c 9225q 6f 0s], Actix 1.7 [0c 511q 0f 0s], Knockout 1.7 [275c 20272q 0f 0s], Quarkus 1.7 [792c 4458q 4f 0s], Bottle 1.7 [0c 0q 2f 8803s], Eclipse Vert.x 1.6 [208c 2656q 3f 0s], Phoenix 1.6 [425c 4056q 1f 0s], Echo 1.6 [49c 150q 3f 0s], Starlette 1.6 [0c 309q 1f 0s], Dropwizard 1.5 [0c 2011q 0f 0s], Fiber 1.5 [0c 199q 0f 0s], Micronaut 1.4 [171c 1792q 6f 0s], Sails 1.4 [324c 6581q 0f 0s], Hapi 1.4 [0c 1364q 3f 0s], Sanic 1.4 [0c 206q 1f 0s], Axum 1.4 [0c 153q 0f 0s], web2py 1.3 [135c 2134q 2f 2165s], Grails 1.3 [449c 29878q 9f 0s], Ktor 1.3 [0c 1231q 2f 0s], Mithril 1.3 [0c 0q 3f 14517s], AdonisJS 1.2 [0c 743q 0f 0s], Google Web Toolkit 1.1 [696c 20823q 0f 0s], Riot.js 1.1 [0c 226q 0f 0s], Armeria 1.1 [0c 35q 0f 0s], Helidon 1.0 [0c 153q 1f 0s], Ractive.js 1.0 [0c 433q 0f 0s], Ratpack 1.0 [0c 87q 1f 0s], Javalin 0.9 [0c 89q 0f 0s], TurboGears 0.9 [38c 111q 1f 0s], Litestar 0.9 [0c 3q 2f 8573s], CanJS 0.8 [0c 225q 0f 0s], Light-4j 0.8 [0c 44q 0f 0s], Enyo 0.6 [133c 196q 0f 0s], Ninja 0.6 [0c 650q 55f 0s], Proteus 0.6 [0c 71q 3f 0s], Gemini 0.5 [0c 45q 0f 0s], Emmett 0.4 [0c 749q 0f 0s]

## Race condition (4)

Koa 1.9 [0c 17q 0f 0s], ActFramework 0.9 [0c 15q 0f 0s], Jooby 0.7 [0c 16q 0f 0s], Knockback.js 0.6 [0c 23q 0f 0s]

## Heisenbug (46)

Tornado 1.9 [292c 0q 0f 0s], Jersey 1.8 [0c 0q 4f 0s], Blade 1.7 [0c 0q 0f 0s], Polymer 1.5 [313c 0q 0f 0s], Pyramid 1.5 [0c 0q 0f 0s], Lit 1.4 [0c 0q 0f 0s], Quart 1.4 [0c 0q 0f 0s], Apache Wicket 1.3 [196c 0q 0f 0s], Robyn 1.3 [0c 0q 0f 0s], Reagent 1.2 [0c 0q 2f 19s], Responder 1.2 [0c 0q 5f 0s], Apache Tapestry 1.1 [97c 0q 1f 0s], Aurelia 1.1 [0c 0q 1f 0s], Falcon 1.1 [0c 0q 11f 0s], Eve 1.1 [0c 0q 0f 0s], Curacao 0.8 [0c 0q 0f 0s], Solon 0.8 [0c 0q 0f 0s], BlackSheep 0.8 [0c 2q 0f 0s], Exoskeleton 0.7 [0c 0q 0f 0s], Webware 0.7 [0c 0q 0f 0s], Microdot 0.7 [0c 0q 0f 0s], Inverno 0.7 [0c 0q 0f 0s], Panther 0.7 [0c 0q 0f 0s], Revenj 0.6 [0c 0q 0f 0s], Rapidoid 0.6 [0c 8q 0f 0s], Jawn 0.6 [0c 0q 2f 0s], MuServer 0.6 [0c 0q 0f 0s], Minijax 0.6 [0c 0q 0f 0s], Magician 0.5 [0c 0q 0f 0s], TODAY-Web 0.5 [0c 0q 0f 0s], ActiveJ 0.5 [0c 0q 0f 0s], RestExpress 0.5 [0c 0q 0f 0s], Duel 0.5 [0c 0q 1f 0s], LoveQQ 0.4 [0c 0q 0f 0s], Bayou 0.4 [0c 0q 0f 0s], mrhttp 0.4 [0c 0q 0f 0s], HServer 0.4 [0c 0q 0f 0s], Wizzardo HTTP 0.4 [0c 0q 0f 0s], Voovan 0.3 [0c 0q 0f 0s], socketify.py 0.3 [0c 0q 0f 0s], jsblocks 0.3 [0c 4q 0f 0s], Redkale 0.3 [0c 0q 0f 0s], Avaje Jex 0.3 [0c 0q 0f 0s], OfficeFloor 0.2 [0c 0q 0f 0s], Lavaca 0.2 [0c 0q 0f 0s], tio-boot 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
