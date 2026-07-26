#!/usr/bin/env bash
#
# Redeploy the portfolio.
#
#   ./deploy.sh          # pull main, build, restart — no-op if already up to date
#   ./deploy.sh --force  # rebuild & restart even with no new commits
#
# Safe by design: the build runs BEFORE the restart, so a broken build aborts
# (set -e) and leaves the currently running app untouched — no downtime.
#
set -euo pipefail

APP="portfolio"
BRANCH="main"
PORT="3003"        # must match the port the app is served on (nginx -> :3003)
HEALTH_URL="http://localhost:${PORT}/ja"

cd "$(dirname "$0")"

log()  { printf '\033[1;34m▶ %s\033[0m\n' "$*"; }
fail() { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

FORCE=false
[ "${1:-}" = "--force" ] && FORCE=true

# Refuse to run on a dirty tree so a pull can never clobber local edits.
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  fail "Working tree has uncommitted changes. Commit or stash them first."
fi

log "Fetching origin/${BRANCH}…"
git fetch --quiet origin "$BRANCH"

before="$(git rev-parse HEAD)"
after="$(git rev-parse "origin/${BRANCH}")"

if [ "$before" = "$after" ] && [ "$FORCE" = false ]; then
  log "Already up to date (${before:0:9}). Use --force to rebuild anyway."
  exit 0
fi

if [ "$before" != "$after" ]; then
  log "Updating ${before:0:9} → ${after:0:9}"
  git merge --ff-only "origin/${BRANCH}"
fi

# Install dependencies only when the lockfile changed (or node_modules is absent).
if [ ! -d node_modules ] || ! git diff --quiet "$before" "$after" -- package-lock.json; then
  log "Dependencies changed — running npm ci…"
  npm ci
else
  log "Dependencies unchanged — skipping install."
fi

log "Building production bundle…"
npm run build

log "Restarting pm2 app: ${APP}"
PORT="$PORT" pm2 restart "$APP" --update-env
pm2 save --force >/dev/null

log "Health check ${HEALTH_URL}…"
sleep 2
for i in $(seq 1 15); do
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$HEALTH_URL" || true)"
  [ "$code" = "200" ] && { log "OK — HTTP 200. Deploy complete."; exit 0; }
  sleep 1
done
fail "App did not return HTTP 200 (last: ${code:-none}). Check: pm2 logs ${APP}"
