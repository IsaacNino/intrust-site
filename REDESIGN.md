# Website redesign — October 18, 2026

## Direction

“Less busywork. More forward motion.” connects document preparation to the work around it. The revised direction restores the original midnight navy, slate, warm cream, and muted gold palette. The hero starts with the dark app preview. Scroll movement reveals content in layers, settles the product frame into place, draws route/progress lines, and brings the large transition statement into focus. On sufficiently tall desktop windows, a pinned workflow advances through its four stages as the visitor scrolls. Native scrolling is never intercepted. Smaller windows retain the manual step controls.

The page progresses through:

1. Current product introduction with light/dark workspace previews.
2. Four-step interactive workflow: details, package selection, generation and review, follow-up.
3. Actual screenshots of Overview, Document packages, Clients, Calendar, and Case fees, with accessible enlargement.
4. Case tasks, email drafts, and productivity context.
5. A visitor-controlled time comparison using clearly labeled illustrative inputs.
6. Firm-specific scope/pricing, local storage, help, FAQ, and demo request.

The original Formspree action, contact email, phone number, and favicon are preserved. External Tailwind runtime and unpinned icon script were removed; the page uses static CSS and local JavaScript. Previous media files remain in the repository but are no longer referenced by the page.

## Accuracy boundaries

- Screenshots were captured from the current desktop app's disposable browser preview using fictional Morgan-family records. The preview toolbar was excluded from the capture; website captions explicitly label fictional data.
- Calendar handoffs are copies or drafts, not two-way synchronization.
- Client emails are drafts for the user to review and send.
- Expected fees are not payments, invoicing, or profit.
- Contact profiles do not automatically populate document fields.
- Document assembly and basic entry checks do not replace professional review.
- Calculator numbers are user-editable estimates, not measured results or guaranteed savings. Negative and zero differences remain visible.
- The site describes the current redesigned desktop branch. Publication should be coordinated with distribution of that application version.

## Accessibility and behavior

All content is visible without JavaScript or when motion is disabled. Scroll reveals are progressive enhancements, with keyboard focus revealing their content immediately. Both tab groups support arrows, Home, End, and a single selected tab stop. The image dialog uses native modal behavior and returns focus when closed. Mobile navigation reports its expanded state and closes after navigation or Escape. Inputs have labels, focus indicators are visible, status messages use live regions, and motion honors reduced-motion preferences. Timed playback starts only after a visitor requests it and pauses when focus enters its content, when it leaves view, or when the tab becomes hidden. Desktop scrolling can also select the workflow stage. A Motion on/off control disables the scroll effects, collapses the pinned scene, and cancels active animations. The operating-system reduced-motion preference takes precedence.

The original contact action remains a normal HTML form for progressive enhancement. JavaScript prevents sends on local previews, prevents duplicate submissions on the live site, applies a delivery timeout, and preserves entered details on failure. Only a confirmed successful response produces the delivery-success message.

## Verification

- `node --check script.js` and `git diff --check` pass.
- All four workflow states and keyboard switching verified. Playback advances, and Pause stops it.
- All five gallery tabs show the matching screenshot and caption. Enlargement and Escape-to-close verified.
- Light/dark hero previews verified.
- Time comparison checked with positive, negative, zero, and empty inputs.
- Required form validation and complete local-preview submission verified; no message sent.
- Desktop layout checked at 1280px. Mobile layout, menu, gallery navigation, and form checked in a 390px-wide iframe because the browser viewport override did not take effect. No horizontal page overflow at either width.
- No broken loaded images or browser console errors observed.
- Static checks verify unique IDs, valid fragment targets, and local asset references.

The OS reduced-motion setting was not toggled during QA; CSS and JavaScript guards were inspected. Production contact delivery was not tested. The checks above were performed before publication.

## Dark palette and scroll revision

Verified native scrolling advances the pinned desktop workflow through to its final stage, with the panel staying at the intended offset. Motion off restores a static layout. Dark hero appearance and the updated palette were visually checked. Mobile verification at 390px confirmed no horizontal overflow, an unpinned workflow, working manual stage selection, and menu closure after navigation. This revision changes only the website; no desktop app files were changed.

Section 02 now uses genuine dark-mode captures for all five gallery tabs and their enlarged views. New client, calendar, document-package, and case-fee captures use the same fictional app preview data; the hero appearance switch is unchanged.
