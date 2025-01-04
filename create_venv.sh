#!/bin/bash

# Set variables
VENV_DIR="./moments-backend-python/venv"
REQUIREMENTS_FILE="./moments-backend-python/requirements.txt"
PYTHON_VERSION="python3.12"

# Step 1: Check if Python 3.12 is available
if ! command -v $PYTHON_VERSION &> /dev/null; then
    echo "Error: $PYTHON_VERSION is not installed or not in PATH."
    exit 1
fi

# Step 2: Remove existing virtual environment if it exists
if [ -d "$VENV_DIR" ]; then
    echo "Removing existing virtual environment at $VENV_DIR..."
    rm -rf "$VENV_DIR"
fi

# Step 3: Create new virtual environment
echo "Creating a new virtual environment at $VENV_DIR..."
$PYTHON_VERSION -m venv "$VENV_DIR"

# Step 4: Activate the virtual environment
echo "Activating the virtual environment..."
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

# Step 5: Install requirements
if [ -f "$REQUIREMENTS_FILE" ]; then
    echo "Installing requirements from $REQUIREMENTS_FILE..."
    pip install --upgrade pip
    pip install -r "$REQUIREMENTS_FILE"
else
    echo "Warning: $REQUIREMENTS_FILE not found. Skipping requirements installation."
fi

echo "Virtual environment setup complete!"