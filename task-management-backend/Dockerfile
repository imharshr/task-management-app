# backend/Dockerfile

# Use the official Python image as base
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Copy the initialization script
COPY run.sh .

# Set execute permissions on the run.sh script
RUN chmod +x run.sh

# Expose port 8000
EXPOSE 8000

# Run the initialization script and then the FastAPI application
CMD ["bash", "run.sh"]
