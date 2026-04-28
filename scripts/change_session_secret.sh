#!/bin/bash

ENV_FILE=".env"

generate_new_key() {
    LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64
}

NEW_KEY=$(generate_new_key)

# Write the new SESSION_SECRET.
if grep -q "^SESSION_SECRET=" "$ENV_FILE"; then
    # If SESSION_SECRET exists, replace the line.
    sed -i "s/^SESSION_SECRET=.*/SESSION_SECRET=$NEW_KEY/" "$ENV_FILE"
else
    # Otherwise, write the whole line.
    echo "SESSION_SECRET=$NEW_KEY" >> "$ENV_FILE"
fi

echo "Session key changed."
