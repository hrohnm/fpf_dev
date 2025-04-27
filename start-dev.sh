#!/bin/bash

# Start the backend and frontend in development mode
echo "Starting Freiplatzfinder development environment..."

# Start the backend
echo "Starting backend..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for the backend to start
echo "Waiting for backend to start..."
sleep 5

# Start the frontend
echo "Starting frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

# Function to handle exit
function cleanup {
  echo "Shutting down..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Development environment is running. Press Ctrl+C to stop."
wait
