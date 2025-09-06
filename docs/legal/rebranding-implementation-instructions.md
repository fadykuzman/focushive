# BelugaFocus Rebranding Implementation Instructions

**LEGAL REQUIREMENT**: Complete rebranding from "Pomodoro" terminology to eliminate trademark infringement risk before commercial launch.

**Target Completion**: Before any monetization, B2C premium features, or B2B sales activities.

## Recommended New Terminology

### Primary Brand Strategy: "Focus Sessions"

**Core Methodology**: "BelugaFocus Focus Sessions" - Interval-based productivity system with customizable work and break periods.

### Terminology Mapping

| Current (Pomodoro) | New (Focus Sessions) | Usage Context |
|-------------------|---------------------|---------------|
| Pomodoro Timer | Focus Session Timer | UI labels, marketing |
| Pomodoro Technique | Focus Session Method | Documentation, help text |
| Pomodoro session | Focus session | Code, UI, documentation |
| Pomodoro cycle | Focus cycle / Productivity cycle | Technical docs |
| Pomodoro round | Focus round / Session round | Code variables |
| Pomodoro app | Focus timer app / Productivity app | Marketing, descriptions |
| 25-minute Pomodoro | 25-minute focus session | Default configurations |

## Critical File Changes (Phase 1 - Customer-Facing)

### 1. User Interface & Customer-Facing Content

#### `/belugafocus/src/app/privacy/page.jsx`
**Line 29**: Replace "Pomodoro timer application" 
```jsx
// BEFORE
BelugaFocus is designed with privacy in mind. This notice explains how we handle your data and protect your privacy while using our Pomodoro timer application.

// AFTER  
BelugaFocus is designed with privacy in mind. This notice explains how we handle your data and protect your privacy while using our focus session timer application.
```

#### UI Component Text Updates
**Search and Replace Patterns**:
```bash
# Search for any remaining user-visible text
grep -r "Pomodoro\|pomodoro" belugafocus/src/app/components/ --include="*.jsx"
```

### 2. Marketing and Documentation

#### `/docs/calendar-integration-ui-design.md`
**Line 2**: Update title
```markdown
# BEFORE
## BelugaFocus Pomodoro Timer App

# AFTER
## BelugaFocus Focus Session Timer App  
```

#### `/analysis/ux-design-analysis.md`
**Line 5**: Update application description
```markdown
# BEFORE
BelugaFocus is a Pomodoro timer application built with Next.js and React, featuring task management, note-taking, and session tracking capabilities.

# AFTER
BelugaFocus is a focus session timer application built with Next.js and React, featuring task management, note-taking, and session tracking capabilities.
```

#### `/README.md` (Project Root)
**Line 7**: Update feature description
```markdown
# BEFORE  
- ⏰ Customizable focus timer with work and break sessions

# AFTER
- ⏰ Customizable focus session timer with work and break intervals
```

### 3. Legal and Compliance Documents

#### Terms of Service (if exists)
- Replace "Pomodoro" with "Focus Session Method"
- Add disclaimer: "Not affiliated with the Pomodoro Technique®"

#### Privacy Policy Updates
- Update service descriptions to use new terminology
- Ensure consistency across all legal documents

## High Priority Changes (Phase 2 - Technical Documentation)

### 4. Architecture Decision Records (ADRs)

#### `/belugafocus/docs/adrs/002-zustand-state-management.md`
**Line 7**: 
```markdown
# BEFORE
The BelugaFocus Pomodoro timer application requires client-side state management for:

# AFTER  
The BelugaFocus focus session timer application requires client-side state management for:
```

#### `/belugafocus/docs/adrs/006-nextjs-framework.md`
**Line 7**:
```markdown
# BEFORE
BelugaFocus needed a React-based framework for building the Pomodoro timer web application with specific requirements:

# AFTER
BelugaFocus needed a React-based framework for building the focus session timer web application with specific requirements:
```

### 5. Feature Documentation  

#### `/belugafocus/docs/features/current-features-and-roadmap.md`
**Line 6**: Update core feature description
```markdown
# BEFORE
- **Pomodoro Timer Engine** (`src/app/stores/timerStore.js`)

# AFTER
- **Focus Session Timer Engine** (`src/app/stores/timerStore.js`)
```

### 6. Tutorial and Integration Guides

#### `/docs/tutorial-google-calendar-oauth-nextjs.md`
**Line 9**: Update tutorial description
```markdown
# BEFORE
In this comprehensive tutorial, we'll build a secure Google Calendar integration for a Pomodoro timer app using OAuth 2.0 with PKCE

# AFTER  
In this comprehensive tutorial, we'll build a secure Google Calendar integration for a focus session timer app using OAuth 2.0 with PKCE
```

## Code-Level Changes (Phase 3 - Internal)

### 7. Variable Names and Comments

While not legally critical, consider updating for consistency:

#### Code Comments in Core Files
**Review these files for internal comments**:
- `/belugafocus/src/app/stores/timerStore.js` - Update internal comments
- `/belugafocus/src/app/utils/timer.js` - Update function documentation
- `/belugafocus/src/app/components/notes/NotesModal.jsx` - Update "Focus Session Notes" (already correct!)

### 8. Configuration and Default Values

#### Maintain Current Timing Structure
**IMPORTANT**: Keep the 25/5/15 minute default structure - this is not trademarked, only the "Pomodoro" name is protected.

```javascript
// Current structure is LEGAL to maintain
DEFAULT_DURATIONS = {
  FOCUS: 25 * 60,      // 25 minutes - OK to keep
  SHORT_BREAK: 5 * 60, // 5 minutes - OK to keep  
  LONG_BREAK: 15 * 60  // 15 minutes - OK to keep
}
```

## Implementation Scripts

### Automated Text Replacement Script

```bash
#!/bin/bash
# run-rebranding.sh - Automated rebranding script

echo "Starting BelugaFocus rebranding process..."

# Phase 1: Customer-facing critical changes
find . -name "*.md" -type f -exec sed -i 's/Pomodoro timer/focus session timer/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/Pomodoro Timer/Focus Session Timer/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/Pomodoro Technique/Focus Session Method/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/Pomodoro application/focus session application/g' {} \;
find . -name "*.md" -type f -exec sed -i 's/Pomodoro app/focus session app/g' {} \;

# Phase 2: JSX/React components  
find ./belugafocus/src -name "*.jsx" -type f -exec sed -i 's/Pomodoro timer/focus session timer/g' {} \;
find ./belugafocus/src -name "*.jsx" -type f -exec sed -i 's/Pomodoro application/focus session application/g' {} \;

# Phase 3: Code comments (optional)
find ./belugafocus/src -name "*.js" -name "*.jsx" -type f -exec sed -i 's/\/\/ Pomodoro/\/\/ Focus Session/g' {} \;

echo "Rebranding complete. Please review changes before committing."
```

### Pre-Deployment Verification Checklist

```bash
#!/bin/bash
# verify-rebranding.sh - Check for remaining Pomodoro references

echo "=== REBRANDING VERIFICATION ==="
echo "Checking for remaining Pomodoro references..."

echo -e "\n1. Customer-facing files (CRITICAL):"
grep -r -i "pomodoro" belugafocus/src/app/components/ belugafocus/src/app/privacy/ README.md docs/ 2>/dev/null | grep -v ".git" || echo "✓ No customer-facing Pomodoro references found"

echo -e "\n2. Documentation files (HIGH PRIORITY):"  
grep -r -i "pomodoro" belugafocus/docs/ 2>/dev/null | grep -v ".git" || echo "✓ No documentation Pomodoro references found"

echo -e "\n3. All remaining references (AUDIT):"
grep -r -i "pomodoro" . 2>/dev/null | grep -v ".git" | grep -v "node_modules" | wc -l | xargs echo "Total remaining references:"

echo -e "\n=== VERIFICATION COMPLETE ==="
```

## Brand Messaging Guidelines

### New Marketing Copy Templates

#### App Store / Website Description
```
BelugaFocus - Focus Session Timer

Boost your productivity with customizable focus sessions and break intervals. Built for professionals who need to maintain deep focus while staying aware of their commitments.

Features:
• Customizable focus session durations (15-60 minutes)
• Smart break intervals (short and long breaks)  
• Task integration and session notes
• Calendar integration for meeting awareness
• Privacy-first, local data storage
• Cross-platform compatibility

Perfect for developers, writers, students, and professionals who want to maximize their productive time with structured focus intervals.
```

#### SEO-Friendly Descriptions
```
- "Focus session timer app for productivity"
- "Work interval timer with break management" 
- "Productivity timer with calendar integration"
- "Deep focus timer for professionals"
- "Time blocking app with task management"
```

### Competitive Positioning

#### Advantages of Rebranding
1. **Legal Freedom**: No licensing restrictions or trademark concerns
2. **Unique Identity**: Stand out from generic Pomodoro apps
3. **Professional Branding**: More suitable for B2B enterprise sales
4. **Feature Flexibility**: Not constrained by traditional 25-minute limitations
5. **Brand Ownership**: Build proprietary brand recognition

#### Messaging Strategy
- **Focus on Results**: "Maximize your productive time with structured focus intervals"
- **Professional Positioning**: "Built for professionals who demand focus and flexibility"  
- **Technology Integration**: "Smart calendar integration prevents focus session conflicts"
- **Privacy Leadership**: "Privacy-first productivity with local data control"

## Testing and Quality Assurance

### Pre-Launch Testing Protocol

1. **Legal Review**: Attorney verification of all customer-facing content
2. **Brand Consistency**: UI/UX review for consistent terminology
3. **SEO Impact**: Update meta tags and descriptions
4. **Documentation Audit**: Ensure all docs reflect new branding
5. **Customer Communications**: Prepare existing user migration messaging

### Rollout Strategy

#### Soft Launch Phase
- Update documentation and legal pages first
- Gradual UI updates via feature flags
- Monitor for any legal challenges

#### Full Launch Phase  
- Complete UI terminology update
- Marketing campaign with new branding
- B2B sales material updates
- Press release about enhanced productivity features

## Timeline and Responsibilities

### Week 1: Critical Changes (Legal Protection)
- [ ] Customer-facing UI text updates
- [ ] Legal document updates (Privacy Policy, Terms)  
- [ ] Marketing material updates
- [ ] App store descriptions

### Week 2: Documentation and Technical
- [ ] ADR and technical documentation updates
- [ ] Tutorial and integration guide updates  
- [ ] Code comment cleanup (optional)
- [ ] Brand asset creation (logos, icons)

### Week 3: Testing and Validation
- [ ] Legal review completion
- [ ] User interface testing
- [ ] Documentation consistency check
- [ ] SEO and marketing material review

### Week 4: Launch Preparation  
- [ ] Final verification and testing
- [ ] Customer communication preparation
- [ ] B2B sales material updates
- [ ] Launch strategy execution

## Success Metrics

### Legal Compliance Metrics
- ✅ Zero trademark infringement references
- ✅ Attorney sign-off on customer-facing content  
- ✅ Legal document consistency
- ✅ Brand trademark clearance

### Business Impact Metrics  
- Enhanced B2B enterprise positioning
- Unique market differentiation
- Freedom for future feature development
- Reduced legal risk for investors/acquirers

---

**CRITICAL REMINDER**: This rebranding is **LEGALLY REQUIRED** before any commercial activities. Prioritize customer-facing changes first, then work through technical documentation. Always consult with qualified IP attorney before commercial launch.

**Contact for Legal Questions**: Engage qualified intellectual property attorney for final review and clearance of rebranding strategy.