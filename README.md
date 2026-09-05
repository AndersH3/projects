# Anders Hellström — Projects

Project directory for https://projects.hellstrom.pw/, hosted with GitHub Pages from `main` / root.

## Update the collection

Edit `include.txt`, with one project per line:

```text
Project name https://github.com/owner/repository
```

Names can contain spaces. Blank lines and lines beginning with `#` are ignored. Duplicate repository URLs are listed once. Order follows the file. Only HTTPS GitHub repository URLs are accepted.

The page fetches `include.txt` on every visit, so additions and removals appear after GitHub Pages publishes the change. No GitHub API calls, tokens, packages, or build tools are required. A search field filters the collection. A static snapshot in `index.html` remains available when JavaScript or the list request is unavailable; update that snapshot if you want the fallback to reflect later edits.

Optional project website links are maintained in the `websites` map in `projects.js`. Projects without a website still receive their repository link.

## Hosting

- GitHub Settings → Pages: deploy from branch `main`, folder `/ (root)`.
- Custom domain: `projects.hellstrom.pw` (also stored in `CNAME`).
- DNS: CNAME record `projects` pointing to `andersh3.github.io`.
- Enable Enforce HTTPS once GitHub has issued the certificate.

## Implementation

`index.html`, `styles.css`, and `projects.js` are plain static files. Text from the project list is rendered through `textContent`, and URLs are validated. No visitor analytics or third-party fonts are loaded.

The initial page and documentation were created with assistance from OpenAI Codex at Anders Hellström’s request.
