/**
 * Frontend Fullstack — Curriculum (HTML → CSS → JS → React → Next.js + extras).
 * Suggested order: HTML/CSS basics → Tailwind → JS → DOM + Async → React → Hooks + Router → Next.js + TypeScript + TanStack Query → Project + Testing + Deploy.
 */
window.FRONTEND_TOPICS = [
  {
    id: "fe-html",
    title: "1. HTML (Foundation)",
    modules: [
      { id: "fe-html-1", title: "Semantic HTML5: header, nav, main, article, section, aside, footer, figure, figcaption" },
      { id: "fe-html-2", title: "Forms & inputs: types (email, tel, date, range, file), validation (required, pattern, min/max), autocomplete, datalist" },
      { id: "fe-html-3", title: "Accessibility (a11y): aria-label, role, alt text, tabindex, focus management, semantic landmarks" },
      { id: "fe-html-4", title: "Basic SEO: meta tags (title, description, og:, canonical), heading hierarchy, structured data (JSON-LD)" },
      { id: "fe-html-5", title: "Multimedia & embedding: audio, video, iframe, picture + srcset (responsive images)" },
      { id: "fe-html-6", title: "HTML best practices: Doctype, lang attribute, viewport meta, favicon" }
    ]
  },
  {
    id: "fe-css",
    title: "2. CSS",
    modules: [
      { id: "fe-css-1", title: "Basics: Box Model, selectors (class, id, attribute, pseudo), specificity, cascade, !important" },
      { id: "fe-css-2", title: "Layout: Flexbox (justify-content, align-items, gap, order, flex-grow/shrink)" },
      { id: "fe-css-3", title: "Layout: CSS Grid (grid-template-columns/rows, gap, minmax, auto-fit/fill, named areas)" },
      { id: "fe-css-4", title: "Responsive design: mobile-first, media queries, container queries, clamp(), fluid typography" },
      { id: "fe-css-5", title: "Modern CSS: variables/custom properties, logical properties (margin-inline, padding-block)" },
      { id: "fe-css-6", title: "Modern CSS: :has(), :not(), :is(), :where(), aspect-ratio, object-fit, accent-color" },
      { id: "fe-css-7", title: "Animations & transitions: transition, animation, @keyframes, will-change, prefers-reduced-motion" },
      { id: "fe-css-8", title: "Tailwind CSS: utility-first, responsive variants, dark mode, arbitrary values, plugins" },
      { id: "fe-css-9", title: "shadcn/ui + Radix UI (headless components)" },
      { id: "fe-css-10", title: "CSS architecture: BEM / ITCSS / SMACSS (or Tailwind only)" },
      { id: "fe-css-11", title: "Pre/post processors: Sass/SCSS (nesting, mixins, modules) — optional" }
    ]
  },
  {
    id: "fe-js",
    title: "3. JavaScript (Core)",
    modules: [
      { id: "fe-js-1", title: "Basics: variables (let/const), data types, operators, conditionals, loops" },
      { id: "fe-js-2", title: "Functions: declaration, expression, arrow functions" },
      { id: "fe-js-3", title: "ES6+: destructuring, spread/rest, template literals, default parameters" },
      { id: "fe-js-4", title: "Array methods: map, filter, reduce, find, some, every, flat, includes" },
      { id: "fe-js-5", title: "Object methods: Object.keys/values/entries, assign, fromEntries" },
      { id: "fe-js-6", title: "DOM: querySelector/All, createElement, append/prepend/remove" },
      { id: "fe-js-7", title: "Events: addEventListener, event delegation, preventDefault/stopPropagation, bubbling vs capturing" },
      { id: "fe-js-8", title: "Async: callback → Promise → async/await" },
      { id: "fe-js-9", title: "Async: Fetch API, error handling (try/catch), .then/.catch/.finally, JSON parse/stringify" },
      { id: "fe-js-10", title: "Advanced: closure, IIFE, this (arrow vs regular), call/apply/bind" },
      { id: "fe-js-11", title: "Advanced: prototypes, inheritance, classes (constructor, extends, super)" },
      { id: "fe-js-12", title: "Modules: import/export, default" },
      { id: "fe-js-13", title: "Throttling/debouncing, event loop, microtasks vs macrotasks" },
      { id: "fe-js-14", title: "Modern: optional chaining (?.), nullish coalescing (??), logical assignment (&&=, ||=, ??=)" },
      { id: "fe-js-15", title: "BigInt, Temporal (when stable) — optional" }
    ]
  },
  {
    id: "fe-react",
    title: "4. React",
    modules: [
      { id: "fe-react-1", title: "Core: JSX, components (function preferred), props, state (useState), events" },
      { id: "fe-react-2", title: "Conditional rendering, lists and keys" },
      { id: "fe-react-3", title: "Hooks: useState, useEffect (cleanup, dependency array)" },
      { id: "fe-react-4", title: "Hooks: useRef, useReducer, useContext" },
      { id: "fe-react-5", title: "Hooks: useMemo, useCallback, custom hooks" },
      { id: "fe-react-6", title: "Routing: React Router v6+ (BrowserRouter, Routes, Route, Link/NavLink, useParams, useNavigate, Outlet, nested routes)" },
      { id: "fe-react-7", title: "State management: Context API + useReducer, Zustand or Jotai (Redux if required)" },
      { id: "fe-react-8", title: "Forms: controlled vs uncontrolled, React Hook Form" },
      { id: "fe-react-9", title: "Data fetching: useEffect + fetch/axios" },
      { id: "fe-react-10", title: "TanStack Query (React Query): caching, background sync — or SWR" },
      { id: "fe-react-11", title: "Styling in React: Tailwind + clsx/classnames, CSS Modules, styled-components" },
      { id: "fe-react-12", title: "Performance: React.memo, lazy + Suspense, code splitting, memoization, avoid unnecessary re-renders" }
    ]
  },
  {
    id: "fe-next",
    title: "5. Next.js 14/15 — App Router (critical 2025–2026)",
    modules: [
      { id: "fe-next-1", title: "App Router vs Pages Router" },
      { id: "fe-next-2", title: "Server Components (RSC) vs Client Components (\"use client\")" },
      { id: "fe-next-3", title: "Data fetching: fetch() cache, revalidatePath/revalidateTime, generateStaticParams" },
      { id: "fe-next-4", title: "Metadata, loading UI, error boundaries, streaming, Suspense" },
      { id: "fe-next-5", title: "API Routes / Route Handlers" },
      { id: "fe-next-6", title: "Dynamic routes, parallel routes, intercepting routes" },
      { id: "fe-next-7", title: "Authentication: NextAuth / Clerk / Auth.js" }
    ]
  },
  {
    id: "fe-ts",
    title: "6. TypeScript (most React jobs 2025+ require it)",
    modules: [
      { id: "fe-ts-1", title: "Types, interfaces, type inference" },
      { id: "fe-ts-2", title: "Generics, union and intersection types" },
      { id: "fe-ts-3", title: "Utility types: Partial, Pick, Omit, Record, Infer" },
      { id: "fe-ts-4", title: "Strict mode, config (tsconfig.json)" },
      { id: "fe-ts-5", title: "Typing React components, props, hooks and events" }
    ]
  },
  {
    id: "fe-git",
    title: "7. Git & GitHub",
    modules: [
      { id: "fe-git-1", title: "Branch, commit, merge, rebase" },
      { id: "fe-git-2", title: "Pull Request, code review workflow" },
      { id: "fe-git-3", title: "GitHub Actions basics (CI: lint, test, build)" }
    ]
  },
  {
    id: "fe-test",
    title: "8. Testing",
    modules: [
      { id: "fe-test-1", title: "Jest + React Testing Library (unit/component tests)" },
      { id: "fe-test-2", title: "Playwright or Cypress (E2E)" }
    ]
  },
  {
    id: "fe-deploy",
    title: "9. Deployment & Tools",
    modules: [
      { id: "fe-deploy-1", title: "Vercel (Next.js), Netlify, GitHub Pages" },
      { id: "fe-deploy-2", title: "Lighthouse: performance, accessibility, SEO" },
      { id: "fe-deploy-3", title: "Web Vitals (LCP, FID, CLS)" }
    ]
  },
  {
    id: "fe-bonus",
    title: "10. Bonus (stand out on CV)",
    modules: [
      { id: "fe-bonus-1", title: "shadcn/ui, Radix UI, Framer Motion (animations)" },
      { id: "fe-bonus-2", title: "AI tools: Cursor, GitHub Copilot, v0.dev (UI generation)" }
    ]
  },
  {
    id: "fe-extra",
    title: "11. Extra — HTTP, tooling & security",
    modules: [
      { id: "fe-extra-1", title: "HTTP basics: methods (GET/POST/PUT/DELETE), status codes, headers" },
      { id: "fe-extra-2", title: "REST API concepts: resources, idempotency, versioning" },
      { id: "fe-extra-3", title: "Browser DevTools: Elements, Network, Console, Performance" },
      { id: "fe-extra-4", title: "Package managers: npm, yarn, pnpm — package.json, scripts" },
      { id: "fe-extra-5", title: "Build tools: Vite (or Webpack basics)" },
      { id: "fe-extra-6", title: "Environment variables (.env), public vs secret" },
      { id: "fe-extra-7", title: "Security basics: XSS, CSRF, CORS, sanitization" },
      { id: "fe-extra-8", title: "PWA basics: service worker, manifest (optional)" },
      { id: "fe-extra-9", title: "GraphQL or WebSocket basics (optional)" }
    ]
  }
];
