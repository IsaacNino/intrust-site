# InTrust website

The static marketing website for [getintrust.com](https://www.getintrust.com/).

## Preview locally

From this repository:

```sh
python3 -m http.server 1426 --bind 127.0.0.1
```

Open <http://127.0.0.1:1426/>. No build step or dependency installation is required.

The contact form is in **preview mode** on localhost, loopback addresses, or a `file:` page. With JavaScript enabled, it validates inputs but does not send requests there. On the published site it uses the existing Formspree endpoint. Do not submit production test messages without permission.

## Structure

- `index.html`: page content, navigation, product tour, calculator, FAQ, and contact form.
- `styles.css`: responsive styling, animation, and reduced-motion overrides.
- `script.js`: keyboard-accessible tabs, scroll-linked workflow progression, motion controls, optional timed playback, screenshot enlargement, estimate calculator, and form states.
- `assets/images/current/`: current desktop-app screenshots using fictional preview data.
- `assets/brand/`: existing InTrust favicon.
- `robots.txt` and `sitemap.xml`: public-site discovery metadata.
- `REDESIGN.md`: design choices and verification notes.

Google Fonts is optional: local fallback fonts keep the site usable if it is unavailable. Styling and interactions do not depend on a CDN framework or icon library.

## Review and publication

Website work is on `codex/intrust-site-workflow-redesign`. This is a separate checkout from the desktop application. No app files, legal templates, document data, or generators were changed.

Publish approved changes to `main` through the repository's existing hosting workflow. No DNS or hosting-account changes are required. The screenshots depict the redesigned application; coordinate app distribution with the features described on the website.

## Checks

```sh
node --check script.js
git diff --check
```

Browser verification covers the walkthrough, product tabs, image modal, calculator, responsive navigation, and local form validation. Live form delivery has not been exercised.
