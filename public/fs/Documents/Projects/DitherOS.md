# DitherOS

[View site](https://fumagalli.ar/dither)  
[Source code](https://github.com/teofum/dither)

![Screenshot](/fs/Documents/Projects/screenshots/DitherOS.webp)

## About

**DitherOS** is a project I built for fun around DitherLab, a general-purpose _dithering engine_ made as an exploration on different dithering techniques and ways to implement them on the web. The project itself explores recreating a desktop-like user interface inspired by the operating systems of the late 1990s and early 2000s.

While DitherLab is the primary feature, I've used DitherOS as something of a playground for any retro-styled applications or games I might want to make for fun. After all, what's a retro OS without a classic time-killer like Minesweeper?

This site—the second version of my personal website—is a follow-up on the same ideas explored in DitherOS, building and expanding upon them. Eventually all applications, DitherLab included, will be ported over.

## Challenges

- Writing a window manager in React was quite the fun challenge involving global state management, complex event handling and DOM manipulation (focusing, moving and resizing windows) and more. Worked well enough for a first time around, though the version in this website is much cleaner.
- Learning to handle Web Workers to spawn multiple threads and harness the full power of the user's CPU. This was definitely a fun challenge, and something not often done in traditional web apps.
- Learning WebGL—vanilla WebGL at that—from scratch. Wouldn't recommend it for a more traditional use like 3D graphics, the APIs are rather awkward and there's great libraries like Three.js out there, but for image processing it was simple enough and worked great. Watching the render time for large images and palettes go from 5-10 seconds on the CPU to a few milliseconds on the GPU was immensely satisfying.
- Learned a lot about dithering and image processing as well!

## Tech

**React** — This was one of my first completed personal projects using React and CRA. It's built as a single-page app with no framework, and all work is done client-side.

**Vite** — It's fast!

**Web Workers** — DitherLab's software renderer makes extensive use of web workers, going as far as using a tiny custom thread controller to run the process on multiple CPU threads.

**WebGL** — A later version of DitherLab added GPU rendering for some dithering processes, using plain WebGL and implementing the dithering algorithms as GLSL shaders.

## Status

Finished, since superceded by this website.

**Last updated** 2022