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

## Privacy page
`privacy.html` explains what the site collects (only what people type into the contact form), the services it uses (GitHub Pages, FormSubmit, Google Fonts), and how parents can ask for a photo of their child to be taken down. It's linked in every footer and under the contact form. If you ever add analytics, a donation button, a sign-up list, or anything else that collects information, update that page and the "Last updated" date.

## Security
The site has no server, database or logins, so there's very little to attack. What's in place:
- **Content Security Policy** (the `Content-Security-Policy` line at the top of every page). Browsers will only run `script.js`, and the page can only talk to FormSubmit and Google Fonts. If you ever add something from another website (a video embed, a donate widget, analytics), you have to add that website to this line on every page, or it will be blocked.
- **HTTPS is forced** in the GitHub Pages settings.
- **Everything shown on the page is escaped** in `script.js` (the `esc()` helper), and link options like `?sport=` only accept values from `CONFIG`.
- **Contact form spam protection**: a hidden "honeypot" field bots fill in, plus length limits on every field.
- **No hidden location data** in the photos or videos. Before adding new photos, export them from your phone without location info (or check that they have none).
- `.gitignore` blocks `.env` and key files so passwords never get committed by accident.

The biggest real risk is someone getting into one of the **accounts** behind the site. Turn these on once:
- [ ] GitHub: two-factor authentication (Settings, then Password and authentication)
- [ ] Gmail (mindsetinmotionkids@gmail.com): 2-Step Verification
- [ ] Instagram (@mindsetinmotionkids): two-factor authentication
- [ ] Only give GitHub access to people who need to edit the site
