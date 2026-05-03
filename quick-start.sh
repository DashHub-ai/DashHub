#!/usr/bin/env bash
# DashHub quick-start installer
# Usage: bash quick-start.sh

set -euo pipefail

REPO="https://github.com/DashHub-ai/DashHub.git"
COMPOSE_FILE="docker-compose.quickstart.yml"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()    { echo -e "${CYAN}[dashhub]${NC} $*"; }
success() { echo -e "${GREEN}[dashhub]${NC} $*"; }
warn()    { echo -e "${YELLOW}[dashhub]${NC} $*"; }
die()     { echo -e "${RED}[error]${NC} $*" >&2; exit 1; }

# ── prerequisites ─────────────────────────────────────────────────────────────

command -v docker >/dev/null 2>&1 || die "Docker is not installed. Get it at https://docs.docker.com/get-docker/"
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 required. Update Docker Desktop or install the plugin."

# ── clone or pull ─────────────────────────────────────────────────────────────

TARGET_DIR="dashhub"

if [ -d "$TARGET_DIR/.git" ]; then
  info "Updating existing clone in ./$TARGET_DIR …"
  git -C "$TARGET_DIR" pull --ff-only
else
  info "Cloning DashHub into ./$TARGET_DIR …"
  git clone --depth=1 "$REPO" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

# ── start ─────────────────────────────────────────────────────────────────────

info "Starting DashHub (first run builds the image, ~3 min) …"
docker compose -f "$COMPOSE_FILE" up -d --build

# ── wait for app ──────────────────────────────────────────────────────────────

info "Waiting for the API to become ready …"
MAX=90; WAITED=0
until curl -sf http://localhost:3000/api/health >/dev/null 2>&1 || [ $WAITED -ge $MAX ]; do
  sleep 3; WAITED=$((WAITED+3))
  printf '.'
done
echo

if [ $WAITED -ge $MAX ]; then
  warn "API not responding yet — it may still be starting. Check with: docker compose -f $COMPOSE_FILE logs app"
else
  success "DashHub is ready!"
fi

# ── done ──────────────────────────────────────────────────────────────────────

echo
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${CYAN}DashHub is running${NC}"
echo
echo -e "  Chat app  →  ${CYAN}http://localhost:5173${NC}"
echo -e "  Admin UI  →  ${CYAN}http://localhost:5174${NC}"
echo -e "  API       →  ${CYAN}http://localhost:3000${NC}"
echo
echo -e "  Email:    root@dashhub.ai"
echo -e "  Password: dashhub123"
echo
echo -e "  Stop:     docker compose -f $COMPOSE_FILE down"
echo -e "  Logs:     docker compose -f $COMPOSE_FILE logs -f"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
