---
slug: no-gray-text
title: You should stop using gray text
date: 2023-10-10
---

# You should stop using gray text

I see this all the time: almost every website, app or design system uses color to reinforce text hierarchy, usually with two or three different text colors. Most of the time, these are black and some variation of dark to mid gray (or white and a lighter gray for dark themes).

This is perfectly fine, and can be a great way to distinguish between different text elements in your app or keep some text-heavy screens from looking cramped. I'm not talking about the idea of using a gray, or "light" variant of text; there's nothing wrong with that. Rather, I'd like to discuss an implementation detail.

What I'm talking about is actual, proper gray text: a solid gray color, like `#808080`. This is a bad idea for several reasons, and yet I've seen it in almost every design I've worked on! Let's go over those reasons, and what the surprisingly simple alternative is.

## Why grey text is bad

Suppose we have an app with a simple color theme: white background, black text with two levels of gray, and a brand color. This looks just fine on white:

//image

However, we start to see problems pretty quick. Let's see what happens with gray text on the brand primary:

// image

Crap! Not only does this look _awful_, it also fails WCAG and APCA standards for contrast. You might say "just don't use light or disabled text on colored backgrounds!", but that's adding restrictions to your system that can be easily forgotten if not documented properly. In a well-designed system, all parts should fit together nicely as much as possible.

It gets worse, too. Suppose we have text on a light gray surface, a fairly common use case (for example, in a disabled button or card):

//image

This doesn't look as bad, but it still fails for contrast. Ideally, we'd want darker gray over darker backgrounds. We can fix this by having different text colors for different backgrounds, but this clutters the color system and leaves a lot of room for poor decisions. Remember, we want our system to have as few moving parts as possible that all work well together.

## A better alternative

So what can we do? The solution is elegantly simple: use partially transparent text. Let's change our gray text for black, and set the opacity instead:

//image

Looks about the same. How about colored and gray backgrounds?

//image

Much better! ...