# Mindset in Motion: website

The website for **Mindset in Motion**, a youth-led nonprofit that runs free soccer games, lessons and races with underserved communities.

## Pages
- `index.html`: Home
- `about.html`: About us (story, what we do, what we believe, the people)
- `events.html`: Up next, full recaps of past events, how an event works
- `photos.html`: All photos and videos, filterable by event
- `sports.html`: Tap a sport to see its photos and how to sign up
- `get-involved.html`: Sign up, volunteer, partner, donate gear, contact form and FAQ

## Live site
https://seb-stek.github.io/mindset-in-motion/ (this is the link in the Instagram bio, @mindsetinmotionkids)

It's hosted free on GitHub Pages. Any change pushed to the `main` branch goes live on its own within a minute or two.

## Run it
Open `index.html` in a browser. It doesn't need a build step.

## Contact form
Messages go straight to `contactEmail` through [FormSubmit](https://formsubmit.co) (free, no account). The very first message sends a one-time "activate" email to that inbox, and you have to click the link in it before messages start arriving. If FormSubmit is ever down, the form falls back to opening the visitor's email app.

## Edit content
Everything you'll want to change often is in the `CONFIG` object at the top of `script.js`, and every page reads from it:
- `team`: names, roles, bios, what each person does, and headshots (About us page)
- `events`: titles, dates, places, highlights (Home and Events pages)
- `photos`: gallery images and videos (files go in `/photos`)
- `sports`: the sports on the Sports page
- `contactEmail`: where the contact form sends messages

Longer page text (like the story on the About us page) is written directly in that page's HTML file.
