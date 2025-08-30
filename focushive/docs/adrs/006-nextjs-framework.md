# ADR 006: Next.js React Framework

## Status
Accepted

## Context
FocusHive needed a React-based framework for building the Pomodoro timer web application with specific requirements:

1. **Static File Serving**: Test reports need to be accessible at `/reports` route
2. **Client-Side State**: Timer functionality requires browser-based state management
3. **Build Optimization**: Fast builds and efficient bundling
4. **Deployment**: Easy deployment to Vercel platform
5. **Modern React**: Support for latest React features and patterns
6. **Development Experience**: Fast refresh and modern tooling

## Decision
We will use **Next.js 15.5.0** as the React framework with App Router and Turbopack.

### Implementation Details
- **Version**: Next.js 15.5.0 (latest stable)
- **Router**: App Router (modern approach over Pages Router)
- **Bundler**: Turbopack for faster builds (`--turbopack` flag)
- **Rendering**: Client-side rendering for timer functionality
- **Static Assets**: Public directory for test reports

## Alternatives Considered

### Create React App (CRA)
- **Pros**: Simple setup, zero configuration, React-focused
- **Cons**: Discontinued, no SSR, limited build optimization
- **Why rejected**: Project is deprecated and lacks modern features

### Vite + React
- **Pros**: Fast development server, modern build tools, minimal setup
- **Cons**: No built-in routing, requires additional configuration for file serving
- **Why rejected**: Would need additional routing solution for `/reports` page

### Remix
- **Pros**: Modern React framework, excellent form handling, nested routing
- **Cons**: Server-first approach, overkill for client-side timer
- **Why rejected**: Timer functionality is inherently client-side

### Astro
- **Pros**: Excellent performance, island architecture, multi-framework support
- **Cons**: Optimized for content sites, complex for interactive apps
- **Why rejected**: Not ideal for state-heavy interactive applications

## Implementation Examples

### App Router Structure
```
src/app/
├── layout.js              # Root layout
├── page.js                # Home page with timer
├── reports/page.js        # Test reports page
├── globals.css            # TailwindCSS imports
└── components/            # React components
```

### Next.js Configuration
```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [{
      source: '/reports/:path*',
      headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }]
    }];
  }
};
```

### Build Configuration
```javascript
// package.json
"scripts": {
  "dev": "next dev --turbopack",          // Development with Turbopack
  "build": "pnpm test:report && next build --turbopack",  // Production build
  "start": "next start"                   // Production server
}
```

## Consequences

### Positive
- **File-Based Routing**: `/reports` page automatically available
- **Static File Serving**: Public directory serves test reports seamlessly
- **Build Performance**: Turbopack provides faster builds than Webpack
- **Vercel Integration**: First-party deployment platform with zero config
- **Modern React**: Latest React 19.x support with concurrent features
- **Developer Experience**: Fast refresh, error overlay, built-in optimization

### Negative
- **Framework Lock-in**: Tied to Next.js conventions and patterns
- **Bundle Size**: Framework overhead compared to minimal React setup
- **Learning Curve**: App Router is different from traditional React routing
- **Build Complexity**: More complex than simple React apps

## Technical Features Used

### App Router Benefits
- **File-based routing**: Automatic route creation from file structure
- **Layout system**: Shared layouts across pages
- **Static optimization**: Automatic static optimization where possible

### Turbopack Integration
- **Faster builds**: Rust-based bundler for improved performance
- **Development**: Faster hot reloading during development
- **Production**: Optimized production builds

### Static File Strategy
```javascript
// Test reports accessible via public directory
public/reports/index.html  → /reports/index.html
reports/junit.xml         → CI/CD artifacts
```

## Deployment Strategy

### Vercel Platform
- **Zero Configuration**: Next.js apps deploy seamlessly
- **Build Integration**: Automatic builds on git push
- **Static Optimization**: Automatic CDN distribution
- **Environment**: Production-ready with minimal setup

### Build Process
1. **Test Reports**: Generated during build via `pnpm test:report`
2. **Next.js Build**: Optimized production bundle
3. **Static Assets**: Test reports copied to public directory
4. **Deployment**: Vercel handles the rest

## Compliance Requirements
- All pages must use App Router conventions
- Static assets must be placed in public directory
- Build process must include test report generation
- Development must use Turbopack for consistency

## Future Considerations
- Evaluate Server-Side Rendering for SEO if needed
- Consider API routes for advanced timer features
- Monitor Turbopack stability as it matures
- Evaluate middleware for advanced routing needs

## Related Decisions
- TailwindCSS integration works seamlessly with Next.js (ADR 004)
- Test reports strategy relies on Next.js static file serving
- Zustand state management is client-side focused (ADR 002)
- Build process integrates with CI/CD pipeline (ADR 001)

## Notes
Next.js was chosen primarily for its static file serving capabilities needed for test reports, combined with excellent React development experience. The App Router and Turbopack provide modern development patterns while maintaining simplicity for the timer application use case.