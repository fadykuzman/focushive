# ADR 004: TailwindCSS for Styling

## Status
Accepted

## Context
The FocusHive application requires a styling solution for:

1. **Responsive Design**: Timer interface must work across devices
2. **Component Styling**: Multiple React components need consistent styling
3. **Utility-First**: Rapid prototyping and development speed
4. **Design System**: Consistent spacing, colors, and typography
5. **Build Integration**: Must work with Next.js and our build pipeline
6. **Test Reports UI**: Styling for the `/reports` page interface

## Decision
We will use **TailwindCSS v4** as the primary styling framework with PostCSS integration.

### Implementation Details
- **Version**: TailwindCSS 4.x (latest major version)
- **Integration**: PostCSS plugin via `@tailwindcss/postcss`
- **Configuration**: Minimal setup leveraging defaults
- **Usage**: Utility-first classes directly in JSX components

## Alternatives Considered

### CSS Modules
- **Pros**: Scoped styles, no naming conflicts, works with any CSS
- **Cons**: More verbose, requires separate CSS files, no design system
- **Why rejected**: Slower development, no built-in design consistency

### Styled Components
- **Pros**: CSS-in-JS, dynamic styling, component-scoped
- **Cons**: Runtime overhead, larger bundle size, complex SSR setup
- **Why rejected**: Performance concerns and unnecessary complexity

### Regular CSS
- **Pros**: Universal support, no dependencies, full control
- **Cons**: No design system, naming conflicts, maintenance overhead
- **Why rejected**: Lack of design consistency and slower development

### Material-UI / Chakra UI
- **Pros**: Pre-built components, consistent design system
- **Cons**: Heavy bundle size, limited customization, component lock-in
- **Why rejected**: Overkill for timer application, unnecessary complexity

## Implementation Examples

### Component Styling
```javascript
// Timer display component
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
  <div className="text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">
      {formatTime(timeLeft)}
    </h1>
  </div>
</div>
```

### Configuration
```javascript
// postcss.config.mjs
const config = {
  plugins: ["@tailwindcss/postcss"],
};
```

## Consequences

### Positive
- **Fast Development**: Utility classes enable rapid UI iteration
- **Consistent Design**: Built-in design system with spacing/color scales
- **Small Bundle**: Only used classes are included in final CSS
- **Responsive**: Mobile-first approach with responsive utilities
- **No CSS Files**: Styles colocated with components reduce context switching
- **Community**: Large ecosystem and excellent documentation

### Negative
- **Learning Curve**: Team needs to learn utility class names
- **HTML Verbosity**: Long className attributes can reduce readability
- **Purge Dependencies**: Build process must be configured correctly
- **Design Constraints**: Limited to Tailwind's design system

## Configuration Details

### PostCSS Integration
- **Plugin**: `@tailwindcss/postcss` v4 for Next.js integration
- **Processing**: Automatic purging of unused styles
- **Output**: Optimized CSS bundle with only used utilities

### Next.js Integration
- **Global Styles**: Imported in `app/globals.css`
- **Build Process**: Integrated with Next.js compilation
- **Optimization**: Automatic CSS optimization and minification

## Usage Guidelines

### Component Patterns
- Use semantic class combinations for reusable patterns
- Prefer responsive utilities over media queries
- Maintain consistent spacing using Tailwind's scale
- Use color utilities for theme consistency

### Report Pages
```javascript
// Test reports styling
<div className="min-h-screen bg-gray-50 flex items-center justify-center">
  <code className="bg-gray-100 px-4 py-2 rounded text-sm">
    pnpm test:report
  </code>
</div>
```

## Compliance Requirements
- All styling must use TailwindCSS utilities
- No custom CSS except for global styles in `globals.css`
- Responsive design must use Tailwind's breakpoint system
- Color scheme must use Tailwind's predefined palette

## Future Considerations
- Evaluate custom design system when application grows
- Consider dark mode implementation using Tailwind's dark mode utilities
- Add custom component variants if patterns emerge
- Monitor bundle size as utility usage increases

## Related Decisions
- Next.js framework provides the build pipeline for TailwindCSS (ADR 006)
- Component architecture benefits from utility-first styling approach
- Test reports page uses TailwindCSS for consistent design

## Notes
TailwindCSS was selected for its balance of rapid development speed and design consistency. The utility-first approach aligns well with the component-based React architecture and enables quick iterations on the timer interface.