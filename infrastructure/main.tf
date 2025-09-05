# Google Calendar Integration Infrastructure
# Automates Google Cloud project setup for FocusHive calendar integration

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

# Variables
variable "project_id" {
  description = "The Google Cloud project ID"
  type        = string
  default     = ""
}

variable "project_name" {
  description = "The Google Cloud project name"
  type        = string
  default     = "FocusHive Calendar Integration"
}

variable "organization_id" {
  description = "The Google Cloud organization ID"
  type        = string
  default     = ""
}

variable "billing_account" {
  description = "The Google Cloud billing account ID"
  type        = string
}

variable "region" {
  description = "Default region for resources"
  type        = string
  default     = "eu-central-1"
}

variable "environments" {
  description = "List of environments to create OAuth clients for"
  type = map(object({
    domain = string
    port   = optional(number)
  }))
  default = {
    development = {
      domain = "localhost"
      port   = 3000
    }
    # staging = {
    #   domain = "staging.focushive.com"
    # }
    production = {
      domain = "focushive-two.vercel.app"
    }
  }
}

variable "app_info" {
  description = "Application information for OAuth consent screen"
  type = object({
    name                = string
    user_support_email  = string
    developer_email     = string
    homepage_uri        = optional(string)
    privacy_policy_uri  = optional(string)
    terms_of_service_uri = optional(string)
  })
  default = {
    name               = "FocusHive"
    user_support_email = "f.s.a.kuzman@gmail.com"
    developer_email    = "f.s.a.kuzman@gmail.com"
    homepage_uri       = "https://focushive-two.vercel.app"
    privacy_policy_uri = "https://focushive-two.vercel.app"
    terms_of_service_uri = "https://focushive-two.vercel.app"
  }
}

# Generate random project ID suffix if not provided
resource "random_string" "project_suffix" {
  count   = var.project_id == "" ? 1 : 0
  length  = 6
  upper   = false
  special = false
}

locals {
  project_id = var.project_id != "" ? var.project_id : "focushive-calendar-${random_string.project_suffix[0].result}"
  
  # Generate redirect URIs for each environment
  redirect_uris = flatten([
    for env_name, env_config in var.environments : [
      env_config.port != null 
        ? "http://${env_config.domain}:${env_config.port}/auth/callback"
        : "https://${env_config.domain}/auth/callback"
    ]
  ])
  
  # Generate authorized origins
  authorized_origins = flatten([
    for env_name, env_config in var.environments : [
      env_config.port != null 
        ? "http://${env_config.domain}:${env_config.port}"
        : "https://${env_config.domain}"
    ]
  ])
}

# Create Google Cloud Project
resource "google_project" "focushive_calendar" {
  name            = var.project_name
  project_id      = local.project_id
  org_id          = var.organization_id != "" ? var.organization_id : null
  billing_account = var.billing_account
  
  labels = {
    environment = "multi"
    app         = "focushive"
    component   = "calendar-integration"
  }
}

# Enable required APIs
resource "google_project_service" "calendar_api" {
  project = google_project.focushive_calendar.project_id
  service = "calendar.googleapis.com"
  
  disable_on_destroy = false
}

resource "google_project_service" "oauth2_api" {
  project = google_project.focushive_calendar.project_id
  service = "oauth2.googleapis.com"
  
  disable_on_destroy = false
}

resource "google_project_service" "iam_api" {
  project = google_project.focushive_calendar.project_id
  service = "iam.googleapis.com"
  
  disable_on_destroy = false
}

# OAuth Consent Screen
resource "google_iap_brand" "focushive_brand" {
  support_email     = var.app_info.user_support_email
  application_title = var.app_info.name
  project           = google_project.focushive_calendar.project_id
  
  depends_on = [google_project_service.oauth2_api]
}

# OAuth Client for Web Application
resource "google_iap_client" "focushive_oauth_client" {
  display_name = "${var.app_info.name} Calendar Client"
  brand        = google_iap_brand.focushive_brand.name
  
  depends_on = [google_iap_brand.focushive_brand]
}

# Note: google_iap_client doesn't support redirect URIs and origins
# We need to use google_oauth2_client (if available) or manual configuration
# For now, we'll output the configuration that needs to be set manually

# Service Account for API access (if needed for server-side operations)
resource "google_service_account" "calendar_service" {
  account_id   = "focushive-calendar-service"
  display_name = "FocusHive Calendar Service Account"
  description  = "Service account for FocusHive calendar integration backend operations"
  project      = google_project.focushive_calendar.project_id
}

# Grant Calendar API permissions to service account
resource "google_project_iam_member" "calendar_service_permissions" {
  project = google_project.focushive_calendar.project_id
  role    = "roles/calendar.events.readonly"
  member  = "serviceAccount:${google_service_account.calendar_service.email}"
}

# Service Account Key (optional - only if backend service is needed)
resource "google_service_account_key" "calendar_service_key" {
  count              = 0 # Set to 1 if you need backend service account
  service_account_id = google_service_account.calendar_service.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

# Outputs
output "project_id" {
  description = "The Google Cloud project ID"
  value       = google_project.focushive_calendar.project_id
}

output "project_number" {
  description = "The Google Cloud project number"
  value       = google_project.focushive_calendar.number
}

output "oauth_client_id" {
  description = "OAuth 2.0 client ID (need to configure manually)"
  value       = "Configure manually in Google Cloud Console"
}

output "oauth_brand_name" {
  description = "OAuth brand name"
  value       = google_iap_brand.focushive_brand.name
}

output "required_redirect_uris" {
  description = "Redirect URIs that need to be configured in OAuth client"
  value       = local.redirect_uris
}

output "required_authorized_origins" {
  description = "Authorized origins that need to be configured in OAuth client"
  value       = local.authorized_origins
}

output "calendar_api_enabled" {
  description = "Whether Calendar API is enabled"
  value       = google_project_service.calendar_api.service
}

output "service_account_email" {
  description = "Service account email for backend operations"
  value       = google_service_account.calendar_service.email
}

output "next_steps" {
  description = "Manual steps required after Terraform deployment"
  value = <<-EOT
    1. Go to Google Cloud Console: https://console.cloud.google.com/
    2. Select project: ${google_project.focushive_calendar.project_id}
    3. Navigate to APIs & Services > Credentials
    4. Create OAuth 2.0 Client ID:
       - Application type: Web application
       - Name: ${var.app_info.name} Calendar Client
       - Authorized JavaScript origins: ${join(", ", local.authorized_origins)}
       - Authorized redirect URIs: ${join(", ", local.redirect_uris)}
    5. Copy the Client ID to your environment variables
    6. Configure OAuth consent screen if needed:
       - App name: ${var.app_info.name}
       - User support email: ${var.app_info.user_support_email}
       - Developer contact: ${var.app_info.developer_email}
       - Scopes: calendar.events.readonly
  EOT
}
