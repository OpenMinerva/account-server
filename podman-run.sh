IMAGE="prismlens-account-server"
sass public/css --no-source-map

# podman stop "$IMAGE"
podman build -t "$IMAGE" .
podman run -p 40400:40400 -d --replace --name "$IMAGE" "$IMAGE"
