#!/bin/bash
# =============================================================================
# FREDONBYTES MAIN APP - DEPLOYMENT SCRIPT
# =============================================================================
# Deploys main application (fredonbytes.eu)
# Usage: ./deploy.sh [deploy|stop|restart|logs|build]
# =============================================================================

set -e

cd "$(dirname "$0")"

case "${1:-deploy}" in
  deploy)
    echo "🚀 Deploying fredonbytes main app..."
    git pull origin main || git pull origin claude/fix-redis-docker-networking-011CV66nkwDRyxNgUQpwP9zi
    docker compose up -d --build
    echo "✅ Main app deployed"
    echo "🌐 https://fredonbytes.eu"
    ;;

  stop)
    echo "🛑 Stopping main app..."
    docker compose down
    echo "✅ Main app stopped"
    ;;

  restart)
    echo "♻️  Restarting main app..."
    docker compose down
    docker compose up -d
    echo "✅ Main app restarted"
    ;;

  logs)
    docker compose logs -f app
    ;;

  build)
    echo "🔨 Building main app..."
    docker compose build --no-cache
    docker compose up -d
    echo "✅ Main app rebuilt"
    ;;

  *)
    echo "Usage: $0 [deploy|stop|restart|logs|build]"
    exit 1
    ;;
esac
