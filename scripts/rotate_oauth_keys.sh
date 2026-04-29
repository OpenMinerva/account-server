#!/bin/bash

if [ "$(id -u)" -eq 0 ]; then
	echo
    echo "Please do not execute this script as sudo."
    echo
    read -p "Do you know what you are doing? [y/N] " choice

	case "$choice" in
	  y|Y ) echo "Okay...";;
	  * ) exit 1;;
	esac
fi

ENV_FILE=".env"

generate_new_key() {
    LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64
}

NEW_KEY=$(generate_new_key)

# Create the file if it does not exist.
if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

# Find the existing PRIMARY_KEY value.
CURRENT_PRIMARY=$(grep "^PRIMARY_KEY=" "$ENV_FILE" | cut -d '=' -f2-)

# Write the new PRIMARY_KEY
if grep -q "^PRIMARY_KEY=" "$ENV_FILE"; then
    # If PRIMARY_KEY exists, replace the line.
    sed -i "s/^PRIMARY_KEY=.*/PRIMARY_KEY=$NEW_KEY/" "$ENV_FILE"
else
    # Otherwise, write the whole line.
    echo "PRIMARY_KEY=$NEW_KEY" >> "$ENV_FILE"
fi

# Write or replace the SECONDARY_KEY with the current PRIMARY_KEY.
if grep -q "^SECONDARY_KEY=" "$ENV_FILE"; then
	# If SECONDARY_KEY exists, replace the line with the current primary key.
    sed -i "s/^SECONDARY_KEY=.*/SECONDARY_KEY=$CURRENT_PRIMARY/" "$ENV_FILE"
else
	# Otherwise, write the whole line.
    echo "SECONDARY_KEY=$CURRENT_PRIMARY" >> "$ENV_FILE"
fi

echo "OAuth2 key rotation completed."
