# Button Styling Guide

## Overview
This document defines the uniform styling system for all buttons in the FocusHive timer application, ensuring visual consistency and clear interaction patterns across the interface.

## Design Principles
- **Visual Hierarchy**: Clear distinction between primary, secondary, and mode selection buttons
- **Consistent Interactions**: All buttons share the same hover effects and transitions
- **Mode-Aware Theming**: Button colors adapt to the current timer mode context
- **Accessibility**: Sufficient contrast and clear interactive states

## Button Categories

### 1. Mode Selection Buttons
Used for switching between focus, short break, and long break modes.

**Active State:**
- Background: `bg-white`
- Text: Mode-specific color (`text-black`, `text-green-600`, `text-blue-600`)
- Border: `border-2 border-white`
- Font: `font-bold`

**Inactive State:**
- Background: `bg-transparent`
- Text: `text-white/70 hover:text-white`
- Border: `border-2 border-white/30 hover:border-white/50`
- Font: `font-semibold`

### 2. Primary Action Buttons (Start/Resume)
Main timer control actions.

**Styling:**
- Background: `bg-white`
- Text: Mode-specific color (`text-black`, `text-green-600`, `text-blue-600`)
- Hover: Mode-specific light background (`hover:bg-gray-100`, `hover:bg-green-50`, `hover:bg-blue-50`)
- Size: `px-8 py-4` (large touch target)

### 3. Secondary Action Buttons (Pause/Reset)
Supporting timer control actions.

**Styling:**
- Background: `bg-transparent`
- Text: `text-white/70 hover:text-white`
- Border: `border-2 border-white/30 hover:border-white/50`
- Size: Varies by function (Reset is circular `w-14 h-14`)

## Shared Properties

### Base Styling
All buttons include these consistent properties:
- **Transitions**: `transition-all duration-200`
- **Shadows**: `shadow-lg hover:shadow-xl`
- **Transform**: `transform hover:-translate-y-0.5`
- **Border Radius**: `rounded-lg` (except Reset which is `rounded-full`)

### Mode-Specific Colors
- **Focus Mode**: Black (`#000000`) and white
- **Short Break Mode**: Green (`#16a34a`) and light green
- **Long Break Mode**: Blue (`#2563eb`) and light blue

## Implementation

### Utility Functions
Located in `src/app/utils/buttonStyles.js`:

```javascript
// Base styles for all buttons
getBaseButtonStyles()

// Mode selection button styling
getModeButtonStyles(buttonMode, currentMode, isActive)

// Primary action button styling  
getActionButtonStyles(mode)

// Secondary action button styling
getSecondaryButtonStyles(mode)
```

### Usage Examples

```jsx
// Mode selection button
<button className={`px-4 py-2 rounded-lg font-semibold text-sm ${getModeButtonStyles('focus', mode)}`}>
  Focus
</button>

// Primary action button
<button className={`px-8 py-4 rounded-lg font-bold text-xl ${getActionButtonStyles(mode)}`}>
  Start
</button>

// Secondary action button
<button className={`px-8 py-4 rounded-lg font-bold text-xl ${getSecondaryButtonStyles(mode)}`}>
  Pause
</button>
```

## Alternative Approaches Considered

### Option 1: Unified Button Component
**Description**: Single reusable Button component with variant props.
**Use Case**: When standardization is more important than flexibility.
**Migration Path**: Extract common button logic into a base component, add variant props.

### Option 3: Material Design Approach
**Description**: Elevation-based button system following Material Design principles.
**Use Case**: For applications requiring strict design system compliance.
**Migration Path**: Implement Material Design elevation classes, update color palette.

### Option 4: Toggle Switch Design
**Description**: Segmented control for mode selection with sliding indicator.
**Use Case**: When space efficiency and modern aesthetics are priorities.
**Migration Path**: Replace mode buttons with segmented control component, add animation logic.

## Accessibility Considerations
- Minimum 44px touch targets for mobile devices
- Color contrast ratios meet WCAG AA standards
- Clear focus indicators for keyboard navigation
- Consistent hover states for mouse interactions

## Testing Requirements
- Visual regression tests for all button states
- Interaction tests for hover and focus states
- Cross-browser compatibility testing
- Mobile touch target validation

## Maintenance Guidelines
- All button styling changes should go through the utility functions
- New button types should follow the established hierarchy
- Test updates required when styling patterns change
- Document any deviations from the standard patterns

## Future Enhancements
- Consider adding button size variants (small, medium, large)
- Evaluate loading states for async button actions
- Assess need for disabled button states
- Explore animation enhancements for state transitions