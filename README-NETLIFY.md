# STS Netlify Deployment

This package is for Netlify, not InfinityFree.

## What Changed

- `index.html` remains the public website.
- `sts-admin.html` remains the hidden admin page.
- PHP/MySQL files were replaced with Netlify Functions.
- Admin-added topics are stored with Netlify Blobs.
- The existing browser API URLs still work through `_redirects`.

## Deploy Option A: GitHub + Netlify

1. Upload this folder to a GitHub repository.
2. In Netlify, choose **Add new project**.
3. Choose **Import an existing project**.
4. Connect your GitHub repository.
5. Use these settings:
   - Build command: `npm install`
   - Publish directory: `.`
6. Deploy the site.

## Deploy Option B: Netlify CLI

1. Open a terminal inside this folder.
2. Run `npm install`.
3. Run `npx netlify login`.
4. Run `npx netlify deploy --prod --build`.

## Open The Pages

- Main website: `https://your-site-name.netlify.app/`
- Admin website: `https://your-site-name.netlify.app/sts-admin.html`

Admin access code:

```text
Gerard-STS-Admin-2026!
```

## Important

Do not use Netlify drag-and-drop for the admin-connected version. Drag-and-drop is fine for a static website, but this version needs Netlify Functions so the admin panel can save data.
