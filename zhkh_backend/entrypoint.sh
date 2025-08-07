#!/bin/bash
set -e

echo "Starting server"
exec uvicorn app.app:start_app --factory --host 0.0.0.0 --port 8000