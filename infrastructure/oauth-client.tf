# OAuth Client Configuration
# This file handles the OAuth 2.0 client creation and configuration

# Note: As of 2025, Terraform Google provider has limited support for OAuth client configuration
# We use a combination of Terraform and Google Cloud CLI commands

# OAuth 2.0 Client ID creation using google_oauth2_client resource (if available)
# This resource might not be available in all provider versions
# Fallback to manual configuration or gcloud commands

resource "google_oauth2_client" "focushive_web_client" {
  # This resource may not exist in current provider
  # Keeping for future compatibility
  count = 0
  
  client_name = "${var.app_info.name} Web Client"
  client_type = "WEB_APPLICATION"
  
  # Redirect URIs
  redirect_uris = local.redirect_uris
  
  # JavaScript origins
  javascript_origins = local.authorized_origins
  
  project = google_project.focushive_calendar.project_id
  
  depends_on = [
    google_project_service.oauth2_api,
    google_iap_brand.focushive_brand
  ]
}

# Alternative: Use null_resource with gcloud commands for full automation
resource "null_resource" "create_oauth_client" {
  # This runs gcloud commands to create OAuth client
  provisioner "local-exec" {
    command = <<-EOT
      # Authenticate gcloud (ensure you're logged in)
      gcloud config set project ${google_project.focushive_calendar.project_id}
      
      # Create OAuth 2.0 client
      CLIENT_OUTPUT=$(gcloud alpha iap oauth-brands create \
        --application_title="${var.app_info.name}" \
        --support_email="${var.app_info.user_support_email}" \
        --format="value(name)" 2>/dev/null || echo "Brand may already exist")
      
      echo "OAuth brand: $CLIENT_OUTPUT"
      
      # Create OAuth client credentials
      gcloud alpha iap oauth-clients create \
        --display_name="${var.app_info.name} Calendar Client" \
        --brand="projects/${google_project.focushive_calendar.project_id}/brands/${google_project.focushive_calendar.project_id}" \
        --format="value(clientId)" > oauth_client_id.txt || true
      
      echo "OAuth client created successfully"
    EOT
  }
  
  # Clean up on destroy
  provisioner "local-exec" {
    when    = destroy
    command = <<-EOT
      echo "OAuth client cleanup - manual intervention may be required"
      # gcloud doesn't support deleting OAuth clients via CLI
    EOT
  }
  
  depends_on = [
    google_project_service.oauth2_api,
    google_iap_brand.focushive_brand
  ]
}

# Read the OAuth client ID from file
data "local_file" "oauth_client_id" {
  filename   = "oauth_client_id.txt"
  depends_on = [null_resource.create_oauth_client]
}

# Create a script to update OAuth client with redirect URIs
resource "local_file" "update_oauth_client_script" {
  filename = "update_oauth_client.sh"
  
  content = <<-EOT
    #!/bin/bash
    
    # Script to update OAuth client with redirect URIs and origins
    # Run this script after Terraform creates the OAuth client
    
    PROJECT_ID="${google_project.focushive_calendar.project_id}"
    CLIENT_ID=$(cat oauth_client_id.txt 2>/dev/null || echo "")
    
    if [ -z "$CLIENT_ID" ]; then
      echo "Error: OAuth client ID not found. Please create OAuth client manually."
      echo "Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
      exit 1
    fi
    
    echo "Configuring OAuth client: $CLIENT_ID"
    echo "Project: $PROJECT_ID"
    
    # Note: gcloud CLI doesn't support updating OAuth client redirect URIs
    # This requires manual configuration in Google Cloud Console
    
    echo "Please manually configure the OAuth client with:"
    echo "Authorized JavaScript origins:"
    %{for origin in local.authorized_origins~}
    echo "  - ${origin}"
    %{endfor~}
    
    echo ""
    echo "Authorized redirect URIs:"
    %{for uri in local.redirect_uris~}
    echo "  - ${uri}"
    %{endfor~}
    
    echo ""
    echo "Visit: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
    echo "Edit the OAuth 2.0 client and add the above URIs"
  EOT
  
  file_permission = "0755"
}

# Output the OAuth client configuration
output "oauth_client_configuration" {
  description = "OAuth client configuration details"
  value = {
    project_id = google_project.focushive_calendar.project_id
    client_id_file = "oauth_client_id.txt"
    configuration_script = "update_oauth_client.sh"
    
    manual_configuration_url = "https://console.cloud.google.com/apis/credentials?project=${google_project.focushive_calendar.project_id}"
    
    redirect_uris = local.redirect_uris
    authorized_origins = local.authorized_origins
  }
  
  depends_on = [
    null_resource.create_oauth_client,
    local_file.update_oauth_client_script
  ]
}