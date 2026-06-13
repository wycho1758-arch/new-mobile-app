# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

> Curated for this repo's stack (Expo React Native + TypeScript). Go / Python / Rust sections,
> React Server (RSC) / Bundle sections, and Next.js TS framework integration were removed as
> not applicable. See `_role-index.md` for the role → rule mapping.

---

## TypeScript Patterns (ts-)

### 1. TypeScript - Type System (ts-types-)

**Impact:** CRITICAL
**Description:** Type safety fundamentals. Avoiding `any`, using unions, generics, const assertions, keyof typeof, and type guards.

### 2. TypeScript - Validation (ts-validation-)

**Impact:** HIGH
**Description:** Schema validation with Zod for runtime validation with inferred types.

### 3. TypeScript - Error Handling (ts-error-)

**Impact:** HIGH
**Description:** Custom errors, Result pattern, proper try-catch, error class hierarchies.

### 4. TypeScript - Async Patterns (ts-async-)

**Impact:** HIGH
**Description:** Async/await patterns, Promise.allSettled, retry with backoff, batch processing.

### 5. TypeScript - Code Organization (ts-org-)

**Impact:** MEDIUM
**Description:** Interface vs Type, barrel exports, path aliases, strict mode.

### 6. TypeScript - Anti-patterns (ts-anti-)

**Impact:** HIGH
**Description:** Type assertion abuse, @ts-ignore, empty interfaces.

---

## React Patterns (react-, React Native / Expo applicable subset)

### 7. React - Eliminating Waterfalls (react-async-)

**Impact:** CRITICAL
**Description:** Waterfalls are the #1 performance killer. Each sequential await adds full network latency.

### 8. React - Component Patterns (react-components-)

**Impact:** MEDIUM
**Description:** Foundation for clean, maintainable React code with TypeScript.

### 9. React - State Management (react-state-)

**Impact:** MEDIUM
**Description:** Core to React application architecture. Prevents bugs, improves data flow clarity.

### 10. React - Re-render Optimization (react-rerender-)

**Impact:** MEDIUM
**Description:** Reducing unnecessary re-renders minimizes wasted computation.

### 11. React - Side Effects (react-effects-)

**Impact:** LOW-MEDIUM
**Description:** Prevents bugs, memory leaks, and race conditions.

### 12. React - JavaScript Performance (react-js-)

**Impact:** LOW-MEDIUM
**Description:** Micro-optimizations for hot paths can add up to meaningful improvements.

---

## Backend / Contract Patterns

### 13. Backend Patterns (backend-patterns)

**Impact:** HIGH
**Description:** Mobile-facing backend service patterns. Pairs with `ts-validation-zod-schema` and the
`packages/contracts` shared-type SoT for the Backend/API Integrator role.

---

## Testing

### 14. Test Infrastructure (test-infrastructure)

**Impact:** HIGH
**Description:** Test setup, fixtures, and tests-first discipline supporting the repo's QA/Release evidence.
