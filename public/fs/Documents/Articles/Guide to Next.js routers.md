# A guide to Next.js routers

> I'm starting my first Next.js project. Should I use Pages or App router?

I've been getting this question, or some variation on it, a lot lately, mostly from people new to Next.js, or React in general. It's not unexpected; React and Next.js are both going through some massive changes, and it's a strange and confusing time for newbies.

Sometimes it's not a question, rather something along the lines of

> I'm trying to do X in my Next.js project and it's not working! Plz help!

In which X is often a Pages router feature the confused developer is trying to use in an App router app. I don't blame the newbies when this happens—this is a problem with Next's documentation being unclear—but it happens a lot, which prompted me to write this guide.

This post is meant as an answer to that question—a longer, more detailed answer than fits in a text message or Discord chat. It's not an introduction to Next.js, or a detailed explanation of App router or React Server Components; it's only meant to point people in the right direction to get started with Next.js, at a time when the official documentation often fails at that task.

## What is a router, anyway?

The router is a core component of most modern web frameworks, Next.js included. In a nutshell, the router takes care of mapping your code—components, pages, and so on—to URL _routes_. This lets SPAs look and feel like websites with distinct pages, without having to reload the entire site on navigation like a static website.

Most modern routers also implement features like server-side rendering (SSR) or static site generation (SSG), which render your pages on the server giving your site a huge boost to performance.

As of 2023, Next.js ships with two entirely different routers: the Pages router and the App router (often called _approuter_). To make matters more confusing, it's possible for a project to use _both_ routers at once!

This makes sense: it's meant to allow progressive migration to the new App router for large projects. For people just getting started with Next.js, though, it can be a source of confusion.

## The Pages router

The Pages router is Next's original router that has been around since the beginning. Since it predates Server Components, it's based around Client Components, with SSR and SSG capabilities provided by the `getServerSideProps` and `getStaticProps` functions respectively.

In Pages, routes are represented by a file in the `/pages` directory. Any file with a valid extension (`.js`, `.jsx`, `.ts`, `.tsx`, and so on) and a default export becomes a page associated to a URL.

As an example, let's look at a hypothetical to-do list app's routes as implemented in the Pages router, and the URLs they will match:

```
pages/
├─ index.tsx            -> example.com
├─ todos.tsx            -> example.com/todos
├─ todos/new.tsx        -> example.com/todos/new
├─ todos/[id].tsx       -> example.com/todos/16
└─ login.tsx            -> example.com/login
```

The way Server Side Rendering (SSR) works with the Pages router is with a function named `getServerSideProps` exported alongside the component, from the same file. This function runs on the server, which lets you do any data fetching (API requests, etc.) and return an object, which will be passed as React props to the page component.

The critical thing to know about pages router is **a route is only server-rendered once, when the page is requested directly**—that is, the first time the site is loaded, or when the user hits "refresh" in their browser. Any other time, for example when navigating to a different route, Next sends an API request, which returns the data from `getServerSideProps` directly as JSON. Next then uses this data to render the new route **on the client**.

When rendering on the server, Next produces and serves completely static HTML. After the page loads, React is loaded on the client and the page is made interactive through a process called _hydration_.

This is how SSR works in most frameworks ever since React frameworks do SSR. For the most part, everything you'd expect to work in a React SPA will work in your routes. The App router does things _very differently_.

## The App router and Server Components

Earlier this year, Next introduced the new App router, intended as a successor to Pages and the future of Next.js. The App router does away with traditional SSR, and it's built around React Server Components (RSC).

There's a lot to say about RSC. They're the bleeding edge of React, and it's a _huge_ paradigm shift—at least, in my opinion, as big as the transition from classes to hooks—that transfoms React into a _server-first_ framework. Explaining RSC is beyond the scope of this post, but I'll leave some links at the end.

When using App router in Next.js, routes live in the `/app` directory, and a folder-based structure is used: each route is a folder with a `page.jsx` (or `tsx`, etc.) file with a default export. Here's the example from before in App router:

```
app/
├─ page.tsx             -> example.com
├─ todos/               
│  ├─ page.tsx          -> example.com/todos
│  ├─ new/
│  │  └─ page.tsx       -> example.com/todos/new
│  └─ [id]/             
│     └─ page.tsx       -> example.com/todos/16
└─ login/
   └─ page.tsx          -> example.com/login
```

The different folder structure is a fairly inconsequential API change, though. Here's the important difference: **in App router, all components are Server Components by default, and all routes must be Server Components**. This has some huge implications for your app.

RSC is complicated, but to grossly oversimplify it: Server Components are _always_ rendered on the server, but rather than HTML, they're rendered to an intermediate data format specific to RSC, which is sent over the network as JSON and then drawn (or _committed_ in React terms) to the DOM by the client. The client only does the drawing, though: all the actual rendering work, like data fetching, calculations on that data, interpolating into the JSX and so on runs on the server.

This last point is worth repeating: Server Components are always rendered on the server. This means **SSR on pages is gone, because it happens at a component level, and it's the new default**.

As you might expect from rendering on the server, Server Components come with a few critical limitations (and new capabilities):

- Server Components _must_ be stateless, pure functions. This means no `useState`, no `useEffect`, no providing or using React context. We're on the server, so there's nowhere to store that state. Because the component will be rendered once and sent to the client, using effects to respond to prop changes doesn't make sense, either.
- Because of this, Server Components are largely non-interactive. The interactive parts of your app will be implemented in Client Components, which render on the client as usual and must be explicitly marked with `"use client"`.
- On the other hand, Server Components can do things the client can't, like access a database directly. You don't have to worry about importing your API keys from server components, for instance, because that code will _never_ run on the client (that doesn't mean it's a _good_ idea to have your API keys in server components, because a careless refactor to a client component can leak sensitive data, but you _can_ do it).
- You can't import Server Components from Client Components, because the client can't render them. You can import the other way around, because the server will just leave the Client Component unrendered, and replace it with a directive to the client to render it and insert it where it needs to go.
- If you need to render a Server Component inside a Client Component, you can instead pass it as a prop from another Server Component. It will by rendered on the server, and the result will be passed as a prop, so the client knows to insert it in the Client Component when it renders.

These last two points can be somewhat confusing, and I don't blame you—RSC is very different from traditional React and can be hard to wrap your head around. I found it helpful to think of it as extending React's one-way data flow beyond the network boundary: data flows from server to client, but not the other way around.

## App router isn't ready yet

Server Components are great! They're a huge change for React that will make app development easier and better in so many ways. With React as a server-first framework, we can get massive performance gains and simplify codebases—most apps don't even need a backend! Next's App router is the first major framework to come out with an RSC implementation, and it's amazing. Forget optimizing for SSR and SSG, and the woes of debugging hydration issues; RSC gives you complete granular control over where each individual component of your app is rendered. Take RSC for a spin and it doesn't take long to realize this is the future of React, and web development.

But for now at least, _it remains the future_. App router is amazing, but it's not quite ready yet, and the way Vercel handled its release has been, in my opinion, less than ideal.

Let's start with stability. Vercel released the App router as _stable_ with Next.js 13.4 earlier this year, with a lot of fanfare and a very Apple-esque keynote. Not that this isn't something to be proud of, but Vercel's confident release made it sound a lot like "stable" means "production-ready", when in reality what they meant by "stable" is "we're no longer pushing breaking changes to the APIs in minor versions".

That's a very important distinction! App router may be _stable_, but it's not tried and tested in the same way Pages router is. This is only natural, Pages has been around for years, App router for only a few months. App router is not production ready. RSC is not production ready. Such massive changes take time for the ecosystem to adapt, and most React libraries out there aren't built with RSC support in mind. A good example is CSS-in-JS libraries: RSC outright breaks most of them! (And I think good riddance, but that's a rant for another article).

As if that wasn't enough, Vercel has decided to mark App router as "recommended" in the new project wizard for `create-next-app`. I can understand why—they want people to move to App router, to speed up adoption and help bring along the change. But this is still a terrible idea! Adding a recommendation will only lead to people new to Next.js who don't know what the App router is to choose it it, get confused when their code doesn't work, and post things like the example at the start of this article.

With all that in mind, let's try and answer the big question:

## Should I use Pages or App router?

As we've seen, Next's two routing solutions are very different. App router is clearly the future, and that's great! But if you're starting a project today, in 2023 (and probably 2024), which one should you pick?

Are you building something that needs to go live? **Use the Pages router**.

App router just isn't ready for production yet, and I wouldn't risk trying it out on a production app with real users and a real client. Next allows for incremental migration anyway, so you can move individual routes to App router in time. Building apps that will be easy to migrate to RSC is a topic worthy of an article (or series) on its own, which I might do at some point.

If you're building a personal project or just learning, the answer is the ever-so-prevalent _it depends_. Learning about App router and RSC is a great idea, so if you want to be on the bleeding edge of React development, give it a go! Just don't expect a completely smooth ride, and make sure any libraries you want to use are compatible with RSC.

On the other hand, if you're completely new to Next.js and you intend to find work as a developer, I think it's wise to learn the Pages router first. Most Next apps out there use it, and that will continue to be the case for years to come—even if every new app was developed with the App router, all the existing apps built on Pages won't suddenly go away.

Another important aspect to keep in mind is that App router is very much designed to work with serverless functions, more specifically _Vercel's_ serverless functions, and won't work nearly as well in a different hosting provider. This isn't really a problem for hobby projects, Vercel sports one of the most generous hobby tiers out there, but for production apps it can get expensive. This has been the source of some controversy and fears of vendor lock-in, especially with how close the Vercel and React teams have gotten over the last few years.

And that's it! Hopefully you have a better idea of what the Pages and App routers are, what they do, and which one works best for you right now.

Or rather, that _would_ be it, but...

## A new challenger approaches

I can't write about the state of Next.js without mentioning [Remix](https://remix.run). Like Next, Remix is a React framework. Unlike Next, Remix makes the best use of the web platform I've seen since the days of static multi-page web apps.

Let me give you an example: data mutations. Show the user a form, take some user input, send it over the network to the server so it can do something like store it or query a database. This is a very common thing to want to do in web apps, and it's notoriously _bad_ in React apps. Using popular http libraries like axios, you end up writing a lot of code to handle form state on the client side, format it in a way the server will understand, send it over the network, handle the response... Then there's things like graceful error handling, or canceling requests when the user clicks "submit" again before the data was sent. _Most production apps I've seen get this wrong_, either breaking under some edge case or having bad UX like disabled form controls and loading spinners all over.

Frameworks have solutions for this issue, of course. Next is coming up with their own, _server actions_, which is in experimental phase and will allow you to call a JS function from the client but actually run it in the server through some behind-the-scenes magic. It's great, but it's a lot of work for the folks at Vercel and comes with a bunch of unexpected gotchas the API doesn't make apparent.

How does Remix approach this issue? Use HTML forms.

That's it! Request formatting, validation, canceling requests... HTML forms have handled all of this, automatically, for _decades_. _Use the platform_. It reminds me of that apocryphal tale about NASA spending billions on a pen that would work in space, only for the Russians to take a pencil. Only this one is real.

This is just one example: I could write an entire post just singing Remix's praises (and probably will). Coming from mostly Next.js apps with clunky combined SSR/SSG solutions and an amalgamation of libraries of varying quality to handle all the different features a web app needs, Remix has been an _absolute joy_ to work with. It's made web development fun again! It's "just" an SSR framework, but it makes developing full-stack apps so _easy_ and you probably won't even need a backend.

Remix's thing is simplicity: it doesn't try and do everything like Next seems to do, with options for server rendering, client rendering and static generation. It does SSR, and it does it _really well_. It's fast, easy to write, and easier to deploy. It uses the web platform wherever possible. It encourages you to write good code, because in Remix, good code is just the easiest to do. It's built around _progressive enhancement_, which means all the links, buttons and forms in your pages will work before JavaScript even loads.

If all of this sounds great to you, I highly encourage you to give it a try. The documentation's tutorials are a great way to get to know the framework. While Remix isn't as mature or widely used as Next's Pages router, its simplicity means things you expect to work usually work, and it has solid documentation and a great community around it. It's also _a lot_ nicer to work with, at least on par with App router, and it sure is a heck of a lot more mature than _that_.

Of course, there's plenty other Next alternatives out there: Svelte, Solid, Nuxt, just to name a few. Even Angular seems to be having something of a resurgence these days. Many of these are great, and I'm not qualified to write about them because I've yet to try them out at all. None of them are React, though. Remix is, and that means you can write the React code you're already familiar with (just a lot less of it!) and use the libraries you already know (just fewer of them!).

Let's revisit the conclusions. If you're building an app for a client, consider Remix! It's _so_ much nicer to use than Pages router, you'll probably end up with a better app, and unlike App router it's production ready. That said, if it's a very large client or the app will be worked on by a very large team, I'd still go for Next.js with the Pages router, just to be totally safe.

If you're building something as a side project or just for fun, App router is great, and learning RSC now is the best way to be ready when it eventually becomes the norm. If you don't want to make that move just yet, Remix has many of the same great features from App router with a more traditional SSR setup.

And that's it, for real this time! At this point you should have all you need to pick the framework that works best for you and start working on your project.
