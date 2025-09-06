# BelugaFocus Rebranding Plan

**From:** FocusHive → **To:** BelugaFocus  
**Created:** 2025-09-05  
**Status:** Planning Phase

## 🎯 Overview

Comprehensive step-by-step plan to rebrand the productivity software from "FocusHive" to "BelugaFocus" while maintaining code integrity and avoiding legal conflicts.

## 📋 Progress Tracking

**Legend:** ❌ Not Started | 🔄 In Progress | ✅ Completed | ⚠️ Needs Review

## Phase 1: Legal & Administrative Foundation

### Step 1.1: Legal Clearance and Protection
**Status:** ❌ Not Started  
**Git Commit Theme:** `legal: secure BelugaFocus trademark protection`

- [ ] Engage trademark attorney for professional clearance search
- [ ] File USPTO trademark application (Classes 9 & 42)
- [ ] Research international trademark requirements (EU, CA, UK)
- [ ] Document legal compliance in `docs/legal/belugafocus-trademark.md`

### Step 1.2: Domain and Digital Assets
**Status:** ❌ Not Started  
**Git Commit Theme:** `assets: secure BelugaFocus digital presence`

- [ ] Register primary domains (belugafocus.com, .net, .org)
- [ ] Reserve social media handles (@belugafocus across platforms)
- [ ] Set up email forwarding from new domains
- [ ] Document domain ownership in `docs/digital-assets.md`

## Phase 2: Brand Identity Development

### Step 2.1: Visual Identity Creation
**Status:** ❌ Not Started  
**Git Commit Theme:** `design: create BelugaFocus brand identity`

- [ ] Design logo variations (primary, icon, wordmark)
- [ ] Develop color palette (Arctic blue, navy, white scheme)
- [ ] Create favicon and app icons (16x16 to 512x512)
- [ ] Generate brand style guide
- [ ] Save assets to `public/brand/belugafocus/`

### Step 2.2: Marketing Materials Foundation
**Status:** ❌ Not Started  
**Git Commit Theme:** `marketing: develop BelugaFocus messaging`

- [ ] Write brand messaging guidelines
- [ ] Create tagline options ("Navigate Your Productivity")
- [ ] Draft elevator pitch and product descriptions
- [ ] Update value proposition statements
- [ ] Document in `docs/marketing/brand-messaging.md`

## Phase 3: Codebase Rebranding

### Step 3.1: Package Configuration
**Status:** ✅ Completed - Commit: 5e54623  
**Git Commit Theme:** `config: update package.json for BelugaFocus`

- [x] Update `package.json` name field: `"name": "belugafocus"`
- [x] Update package.json description, author, homepage fields
- [x] Update package.json repository URL
- [x] Update package.json keywords array
- [x] Run `pnpm install` to ensure no conflicts

**Files to modify:**
- `focushive/package.json`

### Step 3.2: Application Metadata
**Status:** ✅ Completed - Commit: b9e636e  
**Git Commit Theme:** `meta: update BelugaFocus app metadata`

- [ ] Update `next.config.js` if present (not found)
- [x] Update `app/layout.js` metadata (title, description)
- [ ] Update `app/manifest.json` or similar PWA config (not found)
- [ ] Update any SEO-related meta tags (none found)
- [x] Update `app/favicon.svg` with BelugaFocus branding

**Files to modify:**
- `focushive/src/app/layout.tsx`
- `focushive/src/app/manifest.json` (if exists)
- `focushive/next.config.js` (if exists)

### Step 3.3: Environment and Configuration
**Status:** ✅ Completed - Commit: 00f3037  
**Git Commit Theme:** `env: update BelugaFocus environment configuration`

- [x] Update `.env.local` and `.env.example` app names (no .env files found)
- [x] Update any API endpoint references (none found in config files)
- [x] Update database names or connection strings if needed (none found)
- [x] Update any third-party service configurations (no brand references found)
- [x] Update `README.md` project name and descriptions

**Files to modify:**
- `.env.local`, `.env.example`
- `README.md`

## Phase 4: User Interface Rebranding

### Step 4.1: Core UI Components
**Status:** ✅ Completed - Commit: eb8d2c3  
**Git Commit Theme:** `ui: rebrand core BelugaFocus components`

- [x] Update GitHub repository link to belugafocus
- [x] Update privacy policy page with BelugaFocus branding
- [x] Update terms of service page with BelugaFocus branding
- [x] Update auth callback success/error messages
- [x] Update notification text with BelugaFocus branding (🐋 whale emoji)
- [x] Update code comments and service documentation
- [x] Preserve localStorage keys for user data compatibility

**Files to review:**
- `focushive/src/app/components/` (all UI components)
- Look for hardcoded "FocusHive" references

### Step 4.2: Settings and Modals
**Status:** ✅ Completed - No Changes Needed  
**Git Commit Theme:** `ui: update BelugaFocus settings and modals`

- [x] Verified SettingsModal.jsx contains no brand references
- [x] Confirmed StatsDashboard uses appropriate "Productivity Statistics" terminology
- [x] Validated modal components use generic terminology ("Focus Sessions", etc.)
- [x] Confirmed notification messages already use appropriate branding
- [x] All settings and modal components already align with BelugaFocus brand direction

**Finding:** Settings and modal components were already designed with generic, brand-neutral terminology and require no updates for the BelugaFocus rebrand.

**Files to modify:**
- `focushive/src/app/components/settings/SettingsModal.jsx`
- Any modal/dialog components with brand references

### Step 4.3: Authentication and User Flow
**Status:** ✅ Completed - No Changes Needed  
**Git Commit Theme:** `auth: update BelugaFocus authentication flow`

- [x] Verified no dedicated login/signup pages (OAuth only)
- [x] Confirmed auth callback welcome messages already updated in Step 4.1
- [x] Verified no email templates exist in project
- [x] Confirmed first-time user messages use generic, brand-neutral language
- [x] Validated user flow components already align with BelugaFocus brand direction

**Finding:** Authentication and user flow components were already well-designed with generic terminology and required no additional updates beyond what was completed in Step 4.1.

**Files to review:**
- `focushive/src/app/auth/` (authentication components)
- Any user onboarding flows

## Phase 5: Content and Documentation

### Step 5.1: Internal Documentation
**Status:** 🔄 In Progress  
**Git Commit Theme:** `docs: update BelugaFocus internal documentation`

- [x] Update `CLAUDE.md` project instructions
- [x] Update key ADR documents in `docs/adrs/` (003-google-calendar-integration.md)
- [ ] Update remaining technical documentation (many files with brand references)
- [ ] Update development setup guides
- [ ] Update contributor guidelines if any

**Note:** Many documentation files contain "FocusHive" references. Updated critical files for now - remaining docs can be updated in future commits as needed.

**Files to modify:**
- `CLAUDE.md`
- `docs/adrs/*.md`
- Any `docs/` directory files

### Step 5.2: User-Facing Content
**Status:** ❌ Not Started  
**Git Commit Theme:** `content: update BelugaFocus user content`

- [ ] Update help documentation
- [ ] Update FAQ content
- [ ] Update feature descriptions
- [ ] Update any tutorial content
- [ ] Update terms of service/privacy policy (when ready)

**Files to review:**
- Any content or copy files in the project
- Component strings and user-facing text

## Phase 6: Testing and Quality Assurance

### Step 6.1: Search and Replace Validation
**Status:** ❌ Not Started  
**Git Commit Theme:** `test: validate BelugaFocus rebranding completeness`

- [ ] Run global search for remaining "FocusHive" references
- [ ] Run global search for remaining "focushive" references (lowercase)
- [ ] Check file names for old brand references
- [ ] Verify all imports/exports still work correctly
- [ ] Test application functionality end-to-end

**Commands to run:**
```bash
# Search for any remaining brand references
rg -i "focushive" focushive/
rg -i "focus.*hive" focushive/
```

### Step 6.2: Build and Deploy Testing
**Status:** ❌ Not Started  
**Git Commit Theme:** `test: validate BelugaFocus build and deployment`

- [ ] Run `pnpm build` to ensure clean build
- [ ] Run `pnpm test:run` to validate all tests pass
- [ ] Run `pnpm lint` to check code quality
- [ ] Test development server (`pnpm dev`)
- [ ] Verify all assets load correctly

**Commands to run:**
```bash
cd focushive
pnpm build
pnpm test:run
pnpm lint
```

## Phase 7: Launch Preparation

### Step 7.1: SEO and Analytics
**Status:** ❌ Not Started  
**Git Commit Theme:** `seo: implement BelugaFocus SEO optimization`

- [ ] Update Google Analytics/tracking codes
- [ ] Update Google Search Console if configured
- [ ] Update social media meta tags
- [ ] Submit sitemap with new brand URLs
- [ ] Update any third-party integrations

### Step 7.2: Launch Coordination
**Status:** ❌ Not Started  
**Git Commit Theme:** `launch: finalize BelugaFocus launch preparation`

- [ ] Coordinate domain DNS cutover
- [ ] Update any CI/CD pipeline configurations
- [ ] Plan social media announcement
- [ ] Prepare press release or launch announcement
- [ ] Schedule launch date and communications

## 🔧 Development Commands

**Navigate to project directory:**
```bash
cd /home/fady/workspace/codefuchs/projects/focushive/focushive
```

**Key development commands:**
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test:run

# Lint code
pnpm lint

# Search for brand references
rg -i "focushive" .
rg -i "focus.*hive" .
```

## 📝 Progress Notes

**Phase 1 Notes:**
- Awaiting legal consultation for trademark filing
- Domain research needed before purchase

**Phase 2 Notes:**
- Brand identity design can proceed in parallel with legal
- Maintain consistent arctic/marine theme

**Phase 3-4 Notes:**
- Recommend one commit per step to maintain code integrity
- Test after each UI change to catch issues early

**Phase 5-6 Notes:**
- Save comprehensive search/replace for final validation
- Critical to test build process after each major change

## 🚨 Critical Reminders

1. **Git Strategy**: Each step = one focused commit
2. **Testing**: Run build/test after each phase
3. **Backup**: Create git tags at phase completion
4. **Legal**: Don't proceed with public launch until trademark filed
5. **Documentation**: Keep this file updated with progress

---

**Last Updated:** 2025-09-05  
**Next Review:** After Phase 1 completion