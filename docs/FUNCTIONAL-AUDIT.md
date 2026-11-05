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

### Fixed: admin editors could publish empty or stale drafts

**Files:** `admin/content-editor.js`, `admin/simulators-editor.js`, `admin/admin.js`

The editors initially displayed empty local values while allowing publication. Publishing before loading the existing GitHub file could replace the current knowledge base, simulator list, or typography settings with an empty configuration. The content and simulator editors also fetched the latest SHA immediately before writing, which could silently overwrite changes made by another editor after the current draft had been loaded.

Changes in commits `428902257de338462b66b2af4063b26482999d55`, `8e71209795a5370abd213bd3e45c52dba788adba`, `660fed7c32c6044470514489555fc3a329f29234`, and `f38be133f7961f838662b5a2daabdb8b2ac3a891`:
- Content and simulator publishing now requires loading the existing GitHub data first.
- Before publishing, both editors compare the current file SHA with the SHA captured at load time and stop if the file changed.
- The typography editor now requires loading the existing settings and checks that they have not changed before publishing.
- The content and simulator editors refresh their stored SHA after a successful publish.

These are static code changes. Manual verification is still required, including testing the stale-file warning with a second edit from another browser session and confirming that no write occurs when the editors have not loaded current data.

### Fixed: empty editorial collections were ignored by the public site

**File:** `js/hub.js`

The admin editor accepts valid empty arrays for articles, glossary terms, and news sources. However, the public loader only replaced its built-in defaults when each array contained at least one item. As a result, publishing an intentionally empty collection did not take effect: visitors continued to see the old built-in entries.

The loader now accepts empty arrays, matching the editor and build validator. The knowledge base and news page show clear empty-state messages instead of stale fallback content. Search distinguishes an empty knowledge base from a query with no matches.

This is a static code fix; verify by temporarily testing empty arrays in a preview build before publishing any real content changes.


### Fixed: malformed saved theme state could stop the practice page

**File:** `js/hub.js`

The practice page reads the course state from `localStorage` to determine its theme. Previously, valid JSON values such as `null`, a string, or an array were accepted without checking their shape. A stored `null` could cause the page initialization to fail when reading the theme; a primitive value could also fail when the theme toggle tried to update it.

The loader now accepts only a non-null, non-array object and falls back to an empty state for other values or invalid JSON. This protects the page from malformed or unexpected saved data. The change is covered by static inspection; browser testing with deliberately altered local storage remains outstanding.

### Fixed: failed admin reloads no longer leave an old draft publishable

**Files:** `admin/content-editor.js`, `admin/simulators-editor.js`, `admin/admin.js`

The editors previously kept their `hasLoaded` / `configLoaded` flag after a later attempt to reload the current GitHub file failed. That could leave an earlier draft marked as freshly loaded even though the user had explicitly requested a reload and it had not succeeded. Each reload now invalidates the loaded-state flag before starting; only a fully successful load enables publication again. The existing SHA comparison remains in place as a separate protection against concurrent edits.

This is a static code fix. Manual verification should include loading successfully, making a local draft, forcing a subsequent reload failure, and confirming that publishing is blocked until a successful reload.

### Fixed: clearing a font preview no longer leaves an unpublished font in the configuration

**File:** `admin/admin.js`

Previewing a font temporarily adds it to the in-memory font list. Previously, clearing the preview removed the file selection and object URL but left that temporary font entry in the list. Publishing afterward could therefore write a font configuration that referenced a file that had never been uploaded. Selecting another file after previewing could produce the same mismatch.

The editor now keeps a snapshot of the saved font list while a preview is pending, restores it when the preview is cleared or a different file is selected, and retains the previewed entry only when its file and settings are successfully published. Multiple previews before publication replace the pending preview instead of accumulating unuploaded entries.

This is a static code fix. Manual browser verification should cover preview → clear → publish, preview A → select B → publish, and preview A → preview B → publish.


### Fixed: malformed typography settings are not treated as loaded

**File:** `admin/admin.js`

The typography editor previously marked a JSON file as loaded before checking its structure. A syntactically valid but malformed file (for example, `null`, or an object without the expected `fonts` array and `assignments` object) could leave the editor in an inconsistent state and allow a subsequent publish to replace the file. Loading now validates the top-level structure and font entries before setting the loaded flag or enabling publication. Empty `fonts` arrays remain valid so an intentionally cleared font collection is supported.

This is a static code fix; manually verify malformed JSON structures are rejected and a valid empty font list can still be loaded and published.


### Fixed: typography publishing cannot silently replace an existing font asset

**File:** `admin/admin.js`

The font editor previously updated an existing asset when the uploaded file resolved to a path already present in `assets/fonts/`. Because the asset upload happens before the typography settings are saved, a later settings-write failure could leave the currently published configuration pointing to a changed font file. The editor now refuses to upload to an existing asset path and asks the editor to rename the file, avoiding an implicit replacement of a live asset.

This is a static code fix. Manual testing should confirm that a duplicate filename is rejected before any write, while a unique filename can still be uploaded and referenced by the settings.


### Fixed: typography settings validate font references and assignments

**File:** `admin/admin.js`

The typography editor now checks each loaded font's family, local asset path, supported format, and weight, and verifies that each role assignment is empty or references a font present in the list. This prevents malformed settings from silently turning an unknown assignment into a blank selection on the next publish. This remains a static fix; test with an unknown family assignment and a valid configuration in a browser.


### Fixed: temporary font previews are removed from the browser font set

**File:** `admin/admin.js`

The typography editor now tracks the temporary `FontFace` created for preview and removes it when the preview is cleared or a different file/preview is selected. Once settings are successfully published, the face is no longer treated as temporary. This prevents discarded preview fonts from lingering in the page's font registry. Browser testing is still needed for preview switching and clearing.


### Improved: font upload recovery checks references before cleanup

**File:** `admin/admin.js`

If uploading a new font asset or saving `font-settings.json` returns an ambiguous error, the editor now fetches the latest settings to reconcile whether the uploaded path is referenced. If the latest valid settings reference the uploaded asset, it reports that the file is in use. If the settings are readable and do not reference it, it reports the apparent orphan but still leaves it in place. If the follow-up read is ambiguous, malformed, or unavailable, it also leaves the asset untouched. The editor does not automatically delete the asset: a separate GitHub file deletion cannot be made atomic with a concurrent settings update, so automatic cleanup could race with another editor publishing a reference to that font. This handles ambiguous upload and settings-write responses without risking deletion of a live font.

This recovery path is statically reviewed but still requires browser/API fault-injection testing. In particular, test a definite settings-write failure, a lost/ambiguous response after an asset upload or successful settings write, and a failed follow-up read; confirm that the editor reports the state accurately and never automatically deletes the uploaded asset.


### Reviewed: HTML insertion points in the course and hub

**Files:** `js/app.js`, `js/hub.js`, `admin/content-editor.js`, `admin/simulators-editor.js`

Static review found these insertion patterns:
- The course shell replaces the app root with page templates assembled by the course renderer. Module titles/descriptions and visible labels are escaped where inserted as text. Lesson body HTML and the extended theory snippets are intentionally rendered as authored markup from the repository's course data; they are not fields exposed by the current browser admin editors.
- The demo tab swaps between two fixed, source-authored HTML fragments.
- The hub root is populated from its page-rendering functions. Custom simulator scenarios and search results are subsequently created with DOM nodes and `textContent`, rather than treating scenario or editorial text as HTML.
- The reviewed content and simulator admin editors do not use `innerHTML`.

No confirmed injection defect was established in these paths during static review. This is not a sanitizer audit of every authored lesson fragment or every script in the repository; repository-authored HTML must remain trusted and reviewed before publication.


### Reviewed: browser-side GitHub token handling in admin editors

**Files:** `admin/fonts.html`, `admin/admin.js`, `admin/content.html`, `admin/content-editor.js`, `admin/simulators.html`, `admin/simulators-editor.js`

The admin forms use password-type token fields. The font editor keeps its token in a module-local variable; the content and simulator editors likewise keep their connection token in page memory. The reviewed pages do not intentionally persist these tokens in localStorage or sessionStorage. The token is sent to GitHub's API in the Authorization header from the browser. This means the token is exposed to the browser environment and any script executing in that page; it is not server-side secret storage or a hardened authentication boundary. The UI's least-privilege guidance (fine-grained token, repository-only access, Contents read/write) is important and should remain explicit. Users should revoke the token after use if it was created only for a temporary editing session.

This is a static source review, not a runtime network inspection or a guarantee against malicious browser extensions, injected scripts, or compromised dependencies.

### Reviewed: remaining static HTML template builders

**Files:** `js/hub.js`, `js/app-sidebar.js`

The hub uses `root.innerHTML` to render page templates, and the sidebar uses `nav.innerHTML` to build navigation. These are HTML sinks, so their inputs matter. In the reviewed code, the sidebar's labels/icons/links come from fixed source constants and a fixed relative root path. Hub page templates are source-authored; the few editorial values interpolated into the knowledge/news templates are HTML-escaped. Search results and custom simulator data are rendered later with DOM nodes and `textContent`. The generic hub card helper is currently called with fixed source-authored strings.

No user-controlled or fetched editorial field was found flowing unescaped into these two template builders during this review. Keep these builders restricted to fixed markup and escaped values; if future admin-editable fields are added to them, prefer DOM construction with `textContent` or escape every interpolated value. This is a focused static review, not a runtime proof or a review of every HTML sink in the repository.

### Reviewed: course renderer and locally stored progress

**File:** `js/app.js`

The course renderer uses HTML templates for repository-authored lesson material and fixed interface fragments. Module titles/descriptions and user-selected quiz answers are escaped before insertion; quiz feedback and saved progress are reconstructed from a bounded, validated subset of localStorage data. The renderer's lesson theory and explanation fragments are intentionally authored HTML in the source file, not content supplied by the current admin editors. External lesson-source links are also repository-authored constants and currently include HTTPS URLs.

The local progress loader rejects malformed top-level state, catches invalid JSON, restricts theme values, clamps lesson positions and scores, and limits stored attempt history to the latest 100 entries per module. Since localStorage is controlled by the visitor, it must not be treated as proof of course completion or as authoritative assessment data. The project is a local demonstration and does not issue independently verifiable credentials.

No confirmed injection issue was found in the reviewed renderer paths. This does not replace review of every source-authored HTML fragment or browser-based testing; keep lesson HTML and external links under source review rather than treating them as trusted admin input.


### Hardened: typography font paths and duplicate families

**File:** `admin/admin.js`

The typography settings loader now rejects font records with paths outside the expected `/assets/fonts/<filename>` shape, path traversal segments, extensions that do not match the declared format, and duplicate family names. This avoids ambiguous font-role selections and prevents malformed settings from pointing the browser at unexpected asset paths. This is a static validation change; browser testing with malformed settings remains outstanding.
