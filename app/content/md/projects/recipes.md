---
slug: recipes
title: Recipes App
---

# Untitled Recipes App

[View site](https://recipes.fumagalli.ar)  
[Source code](https://github.com/teofum/recipes-app)

## About

An **as-of-yet untitled recipes app**, built as a learning project to get some hands-on experience with full-stack development and try out the Remix framework in a "real" app project. I wanted to build something other than the typical "learning a new framework" projects, and figured an app to organize and query my own recipes would be something nice to have.

## Challenges

- Learning a new framework: Remix. Coming from apps with pre-approuter Next.js and a lot of client-side data fetching, Remix's beautiful simplicity and use of the native browser platform in handling data fetching and mutations won me over almost instantly. While it's not without its caveats, it makes full-stack development fun!
- Working with databases, designing a schema, and building a basic backend. As a primarily frontend developer, this is something I was long overdue for learning, and thanks to Remix making backend easy and Supabase making databases easy I was able to get a complete app up and running in an afternoon.
- Choosing the right service providers. I started out with Planetscale as a database for its generous free tier, but lackluster performance and the limitations of MySQL without foreign key constraints led me to search for a different solution, ending up with Supabase. Thankfully Prisma is great at interoperability, and switching database providers was as easy as changing the connection strings and a couple schema settings.

## Tech

**React** — Most things I do involve React by now.

**Remix** — Awesome React framework, makes full-stack development easier than ever.

**Tailwind** — After years trying out many styling solutions, Tailwind stuck—it's simple, versatile and performant, and that's all you ever need.

**Fly.io** — Great hosting provider that works very well with Remix. CI integration with GitHub Actions.

**Supabase** — Fast managed Postgres database, with none of the hassle of setting up a database. Makes databases easy. Good choice for a project of this type, especially if you're more of a frontend developer.

**Prisma** — Awesome ORM with great DX, a solid schema and migration system, and broad compatibility.

**Algolia** — Super fast full-text search. Used for ingredients, probably for more in the future.

## Status

Released WIP, in active development. Still needs a lot of features.

**Last updated** June 2023