#!/bin/bash

# Function to initialize the database
initialize_database() {
    python initialize.py
}

# Initialize the database
initialize_database

# Run the FastAPI application
uvicorn main:app --host 0.0.0.0 --port 8000
