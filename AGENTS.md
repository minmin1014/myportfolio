<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git management (do this every session, without being asked)

This is a solo portfolio. The owner wants work committed for them — do not wait
to be told each time.

- **Commit proactively at logical breakpoints.** After finishing a coherent unit
  of work (a feature, a fix, a refactor), stage the related files and commit.
  Group changes into small, logical commits with clear messages rather than one
  giant commit.
- **Commit directly to `main`.** That is this repo's established workflow; do not
  create feature branches unless explicitly asked.
- **Do NOT `git push`.** There is no remote and the owner manages any remote/push
  themselves. Never add a remote or push unless explicitly instructed.
- End every commit message with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
