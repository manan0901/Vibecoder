#!/bin/bash

# VibeCoder Deployment Script
# This script handles deployment to different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT=${1:-development}
COMPOSE_FILE="docker-compose.yml"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    print_success "All prerequisites are met."
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment for: $ENVIRONMENT"
    
    # Set compose file based on environment
    case $ENVIRONMENT in
        "production")
            COMPOSE_FILE="docker-compose.production.yml"
            ;;
        "staging")
            COMPOSE_FILE="docker-compose.staging.yml"
            ;;
        "development")
            COMPOSE_FILE="docker-compose.yml"
            ;;
        *)
            print_error "Unknown environment: $ENVIRONMENT"
            print_status "Available environments: development, staging, production"
            exit 1
            ;;
    esac
    
    # Check if compose file exists
    if [ ! -f "$PROJECT_ROOT/$COMPOSE_FILE" ]; then
        print_warning "Compose file $COMPOSE_FILE not found. Using default docker-compose.yml"
        COMPOSE_FILE="docker-compose.yml"
    fi
    
    # Check if .env file exists
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        if [ -f "$PROJECT_ROOT/.env.example" ]; then
            print_warning ".env file not found. Copying from .env.example"
            cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
            print_warning "Please update .env file with your configuration before proceeding."
            read -p "Press Enter to continue after updating .env file..."
        else
            print_error ".env file not found and no .env.example available."
            exit 1
        fi
    fi
}

# Function to build images
build_images() {
    print_status "Building Docker images..."
    
    cd "$PROJECT_ROOT"
    
    # Build backend
    print_status "Building backend image..."
    docker build -t vibecoder-backend:latest ./backend
    
    # Build frontend
    print_status "Building frontend image..."
    docker build -t vibecoder-frontend:latest ./frontend
    
    print_success "Docker images built successfully."
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    cd "$PROJECT_ROOT"
    
    # Start only the database service
    docker-compose -f "$COMPOSE_FILE" up -d postgres
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    docker-compose -f "$COMPOSE_FILE" exec -T backend npx prisma migrate deploy || {
        print_warning "Migration failed. This might be expected for first-time setup."
    }
    
    print_success "Database migrations completed."
}

# Function to start services
start_services() {
    print_status "Starting services..."
    
    cd "$PROJECT_ROOT"
    
    # Start all services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_success "Services started successfully."
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    print_status "Checking backend health..."
    for i in {1..10}; do
        if curl -f http://localhost:5000/api/health >/dev/null 2>&1; then
            print_success "Backend is healthy."
            break
        else
            if [ $i -eq 10 ]; then
                print_error "Backend health check failed after 10 attempts."
                return 1
            fi
            print_status "Waiting for backend... (attempt $i/10)"
            sleep 10
        fi
    done
    
    # Check frontend health
    print_status "Checking frontend health..."
    for i in {1..10}; do
        if curl -f http://localhost:3000/health >/dev/null 2>&1; then
            print_success "Frontend is healthy."
            break
        else
            if [ $i -eq 10 ]; then
                print_error "Frontend health check failed after 10 attempts."
                return 1
            fi
            print_status "Waiting for frontend... (attempt $i/10)"
            sleep 10
        fi
    done
    
    print_success "All health checks passed."
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    print_status "Application URLs:"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:5000/api"
    echo "API Documentation: http://localhost:5000/api/docs"
    echo "Health Check: http://localhost:5000/api/health"
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    
    cd "$PROJECT_ROOT"
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful in production)
    if [ "$ENVIRONMENT" != "production" ]; then
        docker volume prune -f
    fi
    
    print_success "Cleanup completed."
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$COMPOSE_FILE" down
    
    print_success "Services stopped."
}

# Function to show logs
show_logs() {
    cd "$PROJECT_ROOT"
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Function to backup database
backup_database() {
    print_status "Creating database backup..."
    
    BACKUP_DIR="$PROJECT_ROOT/backups"
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/vibecoder_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    cd "$PROJECT_ROOT"
    docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U vibecoder vibecoder > "$BACKUP_FILE"
    
    print_success "Database backup created: $BACKUP_FILE"
}

# Main deployment function
deploy() {
    print_status "Starting VibeCoder deployment for environment: $ENVIRONMENT"
    
    check_prerequisites
    setup_environment
    build_images
    run_migrations
    start_services
    run_health_checks
    show_status
    
    print_success "Deployment completed successfully!"
    print_status "You can now access VibeCoder at http://localhost:3000"
}

# Function to show help
show_help() {
    echo "VibeCoder Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  deploy      Deploy the application (default)"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show service logs"
    echo "  status      Show deployment status"
    echo "  backup      Create database backup"
    echo "  cleanup     Clean up unused Docker resources"
    echo "  help        Show this help message"
    echo ""
    echo "Environments:"
    echo "  development (default)"
    echo "  staging"
    echo "  production"
    echo ""
    echo "Examples:"
    echo "  $0 deploy production"
    echo "  $0 stop"
    echo "  $0 logs"
    echo "  $0 backup"
}

# Main script logic
case "${2:-deploy}" in
    "deploy")
        deploy
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 5
        deploy
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "backup")
        backup_database
        ;;
    "cleanup")
        cleanup
        ;;
    "help")
        show_help
        ;;
    *)
        if [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
            show_help
        else
            deploy
        fi
        ;;
esac
