#!/bin/bash

# FocusHive Calendar Integration - Complete Setup Script
# Installs dependencies and guides through Google Cloud setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

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

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            OS="ubuntu"
        elif command -v yum &> /dev/null; then
            OS="rhel"
        elif command -v pacman &> /dev/null; then
            OS="arch"
        else
            OS="linux"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
    else
        OS="unknown"
    fi
    
    print_status "Detected OS: $OS"
}

# Function to install OpenTofu
install_opentofu() {
    print_status "Installing OpenTofu..."
    
    case $OS in
        "ubuntu")
            # Install OpenTofu on Ubuntu/Debian
            curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh
            chmod +x install-opentofu.sh
            sudo ./install-opentofu.sh --install-method deb
            rm install-opentofu.sh
            ;;
        "macos")
            if command -v brew &> /dev/null; then
                brew tap opentofu/tap
                brew install opentofu
            else
                print_warning "Homebrew not found. Installing manually..."
                curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh
                chmod +x install-opentofu.sh
                sudo ./install-opentofu.sh --install-method standalone
                rm install-opentofu.sh
            fi
            ;;
        "rhel")
            curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh
            chmod +x install-opentofu.sh
            sudo ./install-opentofu.sh --install-method rpm
            rm install-opentofu.sh
            ;;
        *)
            print_warning "Automatic installation not available for $OS"
            echo "Please install OpenTofu manually from: https://opentofu.org/docs/intro/install/"
            echo "Or install Terraform from: https://learn.hashicorp.com/tutorials/terraform/install-cli"
            return 1
            ;;
    esac
    
    print_success "OpenTofu installed successfully"
}

# Function to install Google Cloud CLI
install_gcloud() {
    print_status "Installing Google Cloud CLI..."
    
    case $OS in
        "ubuntu")
            # Add Google Cloud SDK repository
            echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
            curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
            sudo apt-get update
            sudo apt-get install -y google-cloud-cli
            ;;
        "macos")
            if command -v brew &> /dev/null; then
                brew install --cask google-cloud-sdk
            else
                print_warning "Homebrew not found. Please install Google Cloud CLI manually"
                echo "Download from: https://cloud.google.com/sdk/docs/install"
                return 1
            fi
            ;;
        "rhel")
            sudo tee -a /etc/yum.repos.d/google-cloud-sdk.repo << 'EOM'
[google-cloud-cli]
name=Google Cloud CLI
baseurl=https://packages.cloud.google.com/yum/repos/cloud-sdk-el8-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOM
            sudo yum install -y google-cloud-cli
            ;;
        *)
            print_warning "Automatic installation not available for $OS"
            echo "Please install Google Cloud CLI manually from: https://cloud.google.com/sdk/docs/install"
            return 1
            ;;
    esac
    
    print_success "Google Cloud CLI installed successfully"
}

# Function to check and install dependencies
install_dependencies() {
    print_status "Checking and installing dependencies..."
    
    # Check for Terraform/OpenTofu
    if ! command -v tofu &> /dev/null && ! command -v terraform &> /dev/null; then
        print_warning "Neither OpenTofu nor Terraform found"
        read -p "Install OpenTofu? (recommended) [y/N]: " -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_opentofu
        else
            print_error "Terraform or OpenTofu is required"
            return 1
        fi
    else
        if command -v tofu &> /dev/null; then
            print_success "OpenTofu found: $(tofu version | head -n1)"
        else
            print_success "Terraform found: $(terraform version | head -n1)"
        fi
    fi
    
    # Check for Google Cloud CLI
    if ! command -v gcloud &> /dev/null; then
        print_warning "Google Cloud CLI not found"
        read -p "Install Google Cloud CLI? [y/N]: " -r
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_gcloud
        else
            print_error "Google Cloud CLI is required"
            return 1
        fi
    else
        print_success "Google Cloud CLI found: $(gcloud version --format='value(Google Cloud SDK)' | head -n1)"
    fi
    
    print_success "All dependencies checked"
}

# Function to authenticate with Google Cloud
authenticate_gcloud() {
    print_status "Setting up Google Cloud authentication..."
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 &> /dev/null; then
        print_warning "No active authentication found"
        
        echo "Please choose authentication method:"
        echo "1. Login with your Google account (recommended for development)"
        echo "2. Use service account key (for CI/CD)"
        read -p "Choice [1/2]: " -r AUTH_METHOD
        
        case $AUTH_METHOD in
            1|"")
                print_status "Opening browser for Google Cloud authentication..."
                gcloud auth login
                ;;
            2)
                read -p "Enter path to service account key JSON file: " -r KEY_PATH
                if [[ -f "$KEY_PATH" ]]; then
                    gcloud auth activate-service-account --key-file="$KEY_PATH"
                else
                    print_error "Service account key file not found: $KEY_PATH"
                    return 1
                fi
                ;;
            *)
                print_error "Invalid choice"
                return 1
                ;;
        esac
    fi
    
    ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
    print_success "Authenticated as: $ACTIVE_ACCOUNT"
    
    # Enable application default credentials
    print_status "Setting up application default credentials..."
    gcloud auth application-default login
}

# Function to configure project settings
configure_project() {
    print_status "Configuring project settings..."
    
    # Copy example variables file if terraform.tfvars doesn't exist
    if [[ ! -f "$SCRIPT_DIR/terraform.tfvars" ]]; then
        print_status "Creating terraform.tfvars from example..."
        cp "$SCRIPT_DIR/variables.tfvars.example" "$SCRIPT_DIR/terraform.tfvars"
        
        print_warning "Please edit terraform.tfvars with your configuration:"
        echo "  nano $SCRIPT_DIR/terraform.tfvars"
        echo ""
        echo "Required settings:"
        echo "  - billing_account: Your Google Cloud billing account ID"
        echo "  - app_info: Your application details"
        echo "  - environments: Your domain configuration"
        echo ""
        read -p "Press Enter after editing terraform.tfvars..." -r
    else
        print_success "terraform.tfvars already exists"
    fi
    
    # Validate required fields
    if grep -q "ABCDEF-123456-ABCDEF" "$SCRIPT_DIR/terraform.tfvars"; then
        print_error "Please update the billing_account in terraform.tfvars"
        return 1
    fi
    
    print_success "Project configuration complete"
}

# Function to run deployment
run_deployment() {
    print_status "Running infrastructure deployment..."
    
    "$SCRIPT_DIR/deploy.sh" deploy
}

# Function to show next steps
show_next_steps() {
    print_success "Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Complete any manual OAuth configuration as shown above"
    echo "2. Install Node.js dependencies:"
    echo "   cd $PROJECT_ROOT && pnpm install"
    echo "3. Start the development server:"
    echo "   pnpm dev"
    echo "4. Test calendar integration in Settings"
    echo ""
    echo "Useful commands:"
    echo "  $SCRIPT_DIR/deploy.sh status    - Show infrastructure status"
    echo "  $SCRIPT_DIR/deploy.sh destroy   - Remove all infrastructure"
    echo ""
    print_success "Happy coding! 🚀"
}

# Main script logic
main() {
    echo "FocusHive Calendar Integration - Complete Setup"
    echo "=============================================="
    echo ""
    echo "This script will:"
    echo "1. Install required dependencies (OpenTofu, Google Cloud CLI)"
    echo "2. Authenticate with Google Cloud"
    echo "3. Configure project settings"
    echo "4. Deploy infrastructure"
    echo ""
    read -p "Continue? [Y/n]: " -r
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_status "Setup cancelled"
        exit 0
    fi
    
    echo ""
    detect_os
    install_dependencies
    authenticate_gcloud
    configure_project
    run_deployment
    show_next_steps
}

# Run main function
main "$@"