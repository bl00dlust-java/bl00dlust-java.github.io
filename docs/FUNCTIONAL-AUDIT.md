# Functional audit

Date: 2026-11-05  
Branch: `work/audit-fixes-2026-11-05`

## Scope

This document records a static code review. It does not claim that the site has passed manual browser, mobile, or end-to-end testing.

Reviewed areas:
- Course routing, saved progress, quiz attempts, and review navigation in `js/app.js`.
- Return-session dialog in `js/welcome-init.js` and `js/welcome.js`.
- Practice, knowledge search, password generator, checklist, and custom scenarios in `js/hub.js`.
- Editorial data in `data/hub-content.json` and `data/simulators.json`.
- Script and navigation wiring in `hub.html`.

## Findings and changes

### Fixed: return dialog overwrote direct navigation

**File:** `js/welcome-init.js`

Previously, when saved progress existed, the initializer changed any current hash to `#/`. This could discard a direct link to a lesson or another route before the user had chosen an action in the return dialog.

The forced hash change was removed in commit `866c2a17cdfab134e6f2dbf2d0d574dbc6b8886a`. The dialog still offers:
- Continue from the last saved lesson/test/review.
- Open the home page.
- Stay on the currently requested page.

The return dialog builds its continue link from the saved `last` state. This behavior still requires browser verification.

### Reviewed: practice and local tools

**File:** `js/hub.js`

Static observations:
- The password generator uses `crypto.getRandomValues` and rejection sampling before mapping values to characters.
- If secure random generation is unavailable, the UI reports that the generator cannot be used in that browser.
- Clipboard copying is attempted through the browser Clipboard API and failure is reported in the button text.
- Checklist state is stored separately in local storage; reset removes only that checklist key.
- Search results are built with DOM nodes and `textContent`.
- Custom simulator content is validated before rendering and inserted with `textContent`, not interpreted as HTML.
- News/article text is escaped before insertion into HTML; links are restricted to HTTPS by the JSON loader and use `rel="noopener noreferrer"`.

No confirmed functional defect was found in these reviewed paths from static inspection alone.

### Reviewed: course progress and quiz flow

**File:** `js/app.js`

Static observations:
- Saved course state is parsed defensively and limited to known module IDs.
- Lesson indices and stored quiz answer values are bounded during load.
- Quiz submission requires an answer to every question.
- Results and review history are saved locally in the browser.
- Missing or invalid module/review routes have fallback navigation or an explanatory page.

No additional confirmed routing or persistence defect was established during this pass.



### Improved: return dialog keyboard accessibility

**File:** `js/welcome.js`

The dialog now:
- Announces its description through `aria-describedby`.
- Keeps Tab and Shift+Tab navigation within the dialog.
- Closes with Escape and returns focus to the element that was focused before the dialog opened, when that element is still available.
- Returns focus after dismissing with the stay button or clicking the backdrop. Navigation links close the dialog without forcing focus back to the previous page element.

This is a static code change; keyboard and screen-reader behavior still needs manual verification in a browser.


### Improved: mobile sidebar keyboard accessibility

**File:** `js/app-sidebar.js`

The mobile navigation drawer now:
- Receives focus on its first navigation link when opened.
- Keeps Tab and Shift+Tab navigation inside the drawer.
- Closes with Escape and restores focus to the menu trigger.
- Restores focus to the trigger when closed with the backdrop or close button; following a navigation link does not force focus back to the old page.

This is a static code change. Manual testing on narrow screens, desktop keyboard navigation, and assistive technology remains required.

## Manual verification still required

1. With existing saved progress, open a direct URL to a specific module and confirm the URL and page remain unchanged behind the return dialog.
2. Choose **Continue learning** and confirm the last saved lesson, quiz, or review opens correctly.
3. Choose **Stay on current page** and confirm the originally requested route remains open.
4. Open the course in a fresh browser session with no saved state and confirm the return dialog does not appear.
5. Complete a quiz, refresh the page, and confirm the attempt and review remain available.
6. On desktop and mobile, test the practice tabs, knowledge search, password generation/copying, and checklist persistence.
7. Test keyboard navigation and screen-reader behavior of the return dialog: Tab/Shift+Tab must stay inside it, Escape must close it, and focus should return appropriately.
8. Verify the dialog description is announced by a screen reader and that focus restoration does not interfere with navigation links.
9. On a phone-sized viewport, open the sidebar, cycle through links with Tab/Shift+Tab, close with Escape, and confirm focus returns to the menu trigger.

## Limits

- This review is static; the browser interactions above have not been executed by this audit.
- No claim is made that every browser or device has been tested.
- The public `main` branch was not changed. The work remains isolated in the audit branch and its open pull request.
