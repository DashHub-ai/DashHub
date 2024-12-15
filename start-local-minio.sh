#!/bin/bash

# Set variables
MINIO_VOLUME_DIR="./tmp/data"
CONTAINER_NAME="minio-local"
ACCESS_KEY="minioadmin"
SECRET_KEY="minioadmin"
DEFAULT_BUCKET="default"

# Create volume directory if it doesn't exist
if [ ! -d "$MINIO_VOLUME_DIR" ]; then
    mkdir -p "$MINIO_VOLUME_DIR"
    echo "Created Minio volume directory: $MINIO_VOLUME_DIR"
fi

# Remove dangling images
echo "Removing dangling Podman images..."
podman image prune -f

# Stop and remove existing container if it exists
if [ "$(podman ps -aq -f name=$CONTAINER_NAME)" ]; then
    podman stop $CONTAINER_NAME
    podman rm $CONTAINER_NAME
fi

# Start Minio container
echo "Starting Minio container..."
podman run -d \
    --name $CONTAINER_NAME \
    -p 9000:9000 \
    -p 9001:9001 \
    -e "MINIO_ROOT_USER=$ACCESS_KEY" \
    -e "MINIO_ROOT_PASSWORD=$SECRET_KEY" \
    -v "$(pwd)/$MINIO_VOLUME_DIR:/data:z" \
    docker.io/minio/minio server /data --console-address ":9001"

# Wait for MinIO to be ready with proper health check
echo "Waiting for MinIO to be ready..."
sleep 1

until podman exec $CONTAINER_NAME /bin/sh -c "curl -s http://localhost:9000/minio/health/ready"; do
    sleep 1
done

# Configure mc client and create public bucket if it doesn't exist
echo "Configuring MinIO client and creating bucket..."
podman exec $CONTAINER_NAME /bin/sh -c "\
    mc alias set myminio http://localhost:9000 $ACCESS_KEY $SECRET_KEY && \
    if ! mc ls myminio/$DEFAULT_BUCKET > /dev/null 2>&1; then \
        mc mb myminio/$DEFAULT_BUCKET && \
        mc anonymous set download myminio/$DEFAULT_BUCKET; \
    else \
        echo 'Bucket already exists'; \
    fi && \
    mc ls myminio/"

echo "Minio is running!"
echo "API endpoint: http://localhost:9000"
echo "Console: http://localhost:9001"
echo "Access Key: $ACCESS_KEY"
echo "Secret Key: $SECRET_KEY"
echo "Default bucket: $DEFAULT_BUCKET"
