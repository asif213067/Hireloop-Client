<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project structure rules
- components/dashboard/ (root): only components used by two or more roles (shell, sidebar, topbar, sidebar state, footer rows, generic form fields).
- components/dashboard/<role>/ (recruiter, seeker, admin): components used by that role only. Create a role folder only when its first file exists.
- components/jobs/: job UI shared by the public site and several dashboards (future cards, badges).
- Routes stay under app/dashboard/<role>/ and mirror the URL. Shared logic, types and validation stay in lib/.
- Never move a file out of its role folder or delete a role folder unless I explicitly ask. If a task prompt names a different path for a role-only component, ask before following it.
