# FocusHive Calendar Integration - Infrastructure

This directory contains OpenTofu/Terraform infrastructure-as-code for automating Google Cloud setup for FocusHive's calendar integration.

## 🚀 Quick Start

**Complete automated setup:**
```bash
./setup.sh
```

**Deploy infrastructure only:**
```bash
./deploy.sh
```

## 📁 File Structure

```
infrastructure/
├── main.tf                    # Main infrastructure configuration
├── oauth-client.tf           # OAuth client setup
├── versions.tf               # Provider versions
├── variables.tfvars.example  # Example configuration
├── setup.sh                  # Complete setup automation
├── deploy.sh                 # Infrastructure deployment
└── README.md                 # This file
```

## ⚙️ Configuration

1. **Copy example configuration:**
   ```bash
   cp variables.tfvars.example terraform.tfvars
   ```

2. **Edit terraform.tfvars:**
   ```hcl
   # Required: Your Google Cloud billing account
   billing_account = "ABCDEF-123456-ABCDEF"
   
   # Application information
   app_info = {
     name               = "FocusHive"
     user_support_email = "support@focushive.com"
     developer_email    = "dev@focushive.com"
     # ... other settings
   }
   
   # Environment configuration
   environments = {
     development = {
       domain = "localhost"
       port   = 3001
     }
     production = {
       domain = "focushive.com"
     }
   }
   ```

## 🔧 Prerequisites

**Manual installation:**
- [OpenTofu](https://opentofu.org/docs/intro/install/) or [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- Google Cloud account with billing enabled

**Automatic installation:**
The `setup.sh` script will install missing prerequisites automatically.

## 📋 Commands

### Complete Setup
```bash
./setup.sh                    # Install dependencies + deploy infrastructure
```

### Infrastructure Management
```bash
./deploy.sh deploy            # Full deployment (plan + apply)
./deploy.sh plan              # Show deployment plan
./deploy.sh apply             # Apply planned changes
./deploy.sh destroy           # Remove all infrastructure
./deploy.sh status            # Show current status
./deploy.sh init              # Initialize Terraform
```

### Manual Terraform Commands
```bash
# Initialize
terraform init                # or: tofu init

# Plan deployment
terraform plan -var-file="terraform.tfvars"

# Apply changes
terraform apply -var-file="terraform.tfvars"

# Show current state
terraform show

# Destroy infrastructure
terraform destroy -var-file="terraform.tfvars"
```

## 🏗️ What Gets Created

### Google Cloud Resources
- **Project**: New Google Cloud project for calendar integration
- **APIs**: Calendar API and OAuth2 API enabled
- **OAuth Brand**: OAuth consent screen configuration
- **OAuth Client**: Web application OAuth credentials
- **Service Account**: For backend operations (optional)
- **IAM**: Appropriate permissions for calendar access

### Generated Files
- `oauth_client_id.txt` - OAuth client ID for environment variables
- `update_oauth_client.sh` - Script to configure redirect URIs
- `.env.local` - Environment variables for Next.js app

## 🌍 Multi-Environment Support

The infrastructure supports multiple environments automatically:

```hcl
environments = {
  development = {
    domain = "localhost"
    port   = 3001
  }
  staging = {
    domain = "staging.focushive.com"
  }
  production = {
    domain = "focushive.com"
  }
  preview = {
    domain = "preview-pr-123.focushive.com"
  }
}
```

This generates appropriate redirect URIs and authorized origins for all environments.

## 🔒 Security Features

- **PKCE-ready OAuth configuration**
- **Minimal required scopes** (`calendar.events.readonly`)
- **Environment-specific redirect URIs**
- **No client secrets** (public client pattern)
- **Proper IAM permissions**

## 🐛 Troubleshooting

### Authentication Issues
```bash
# Check gcloud authentication
gcloud auth list

# Re-authenticate if needed
gcloud auth login
gcloud auth application-default login
```

### Terraform State Issues
```bash
# Refresh state
terraform refresh -var-file="terraform.tfvars"

# Import existing resources (if needed)
terraform import google_project.focushive_calendar PROJECT_ID
```

### OAuth Client Configuration
If OAuth client creation fails, manually configure:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID
5. Use the redirect URIs from Terraform outputs

### Permission Errors
```bash
# Check current project
gcloud config get-value project

# Set project if needed
gcloud config set project PROJECT_ID

# Check permissions
gcloud projects get-iam-policy PROJECT_ID
```

## 📊 Outputs

After deployment, you'll get:
- Project ID
- OAuth client ID (if successfully created)
- Required redirect URIs and origins
- Manual configuration steps
- Environment variables for your app

## 🧹 Cleanup

**Remove all infrastructure:**
```bash
./deploy.sh destroy
```

**Manual cleanup:**
```bash
# Remove Terraform state
rm -f terraform.tfstate*
rm -f .terraform.lock.hcl
rm -rf .terraform/

# Remove generated files
rm -f oauth_client_id.txt
rm -f update_oauth_client.sh
```

## 🆘 Support

If you encounter issues:
1. Check the [troubleshooting section](#troubleshooting) above
2. Verify your `terraform.tfvars` configuration
3. Ensure you have the required Google Cloud permissions
4. Check the [main setup guide](../docs/GOOGLE_CALENDAR_SETUP.md)

## 📝 Notes

- OAuth client redirect URI configuration may require manual steps due to Google Cloud API limitations
- The infrastructure creates a new Google Cloud project by default
- Billing must be enabled on your Google Cloud account
- Generated files are gitignored for security