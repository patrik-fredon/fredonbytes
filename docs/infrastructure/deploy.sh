#!/bin/bash
# =============================================================================
# INFRASTRUCTURE DEPLOYMENT SCRIPT
# =============================================================================

set -e

case "${1:-help}" in
  start)
    echo "🚀 Starting infrastructure..."
    docker compose up -d
    echo "✅ Infrastructure started"
    echo ""
    echo "📊 Access:"
    echo "  Traefik:      http://localhost:8080"
    echo "  Beszel:       http://localhost:8090"
    echo "  Dozzle:       http://localhost:8081"
    echo "  Redis Insight: http://localhost:5540"
    ;;

  stop)
    echo "🛑 Stopping infrastructure..."
    docker compose down
    ;;

  restart)
    echo "♻️  Restarting infrastructure..."
    docker compose restart
    ;;

  logs)
    docker compose logs -f ${2:-}
    ;;

  status)
    docker compose ps
    ;;

  *)
    echo "Usage: $0 [start|stop|restart|logs|status]"
    ;;
esac
