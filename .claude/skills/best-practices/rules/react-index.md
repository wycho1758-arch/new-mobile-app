---
title: React Best Practices Index
impact: N/A
tags: index, summary, anti-patterns
---

# React Best Practices Index

> Version: 19+ (React Native / Expo applicable subset)
> Last Updated: 2026-01-22
> Total Patterns: 29
> Structure: 6 Categories (Priority-Sorted)
> Curation note: web-only categories (Bundle Optimization, Server-Side / RSC) and DOM-only
> `react-js-passive-events` were removed — not applicable to Expo React Native. See `_role-index.md`.
>
> **Reading examples for React Native:** the rules teach framework-agnostic React-core concepts
> (state, effects, re-render, transitions, composition) that apply identically in RN. Where an
> example still uses web/DOM syntax, substitute RN primitives and patterns: `<div>/<span>` → `<View>`,
> text → `<Text>`, `<button>` → `<Pressable>`, `className` → NativeWind on RN primitives,
> `window`/DOM events → RN equivalents (`onScroll`/`contentOffset`, gesture handlers). The pattern is
> what matters, not the host element.

## Summary by Priority

| Priority | Category | Patterns | Key Patterns |
|----------|----------|----------|--------------|
| CRITICAL | Eliminating Waterfalls | 5 | Promise.all, defer await, Suspense |
| MEDIUM | Components | 4 | TypeScript, composition, discriminated unions |
| MEDIUM | State | 4 | Local vs global, reducer, context, derived |
| MEDIUM | Re-renders | 7 | memo, useMemo, useCallback, transitions |
| LOW-MED | Side Effects | 4 | Dependencies, cleanup, race conditions |
| LOW | JS Performance | 5 | Index maps, Sets, immutable methods |

## Pattern Files by Category

### Category 1: Eliminating Waterfalls (CRITICAL)
- `react-async-promise-all.md`
- `react-async-defer-await.md`
- `react-async-suspense-boundaries.md`
- `react-async-parallel.md`
- `react-async-dependencies.md`

### Category 2: Component Patterns (MEDIUM)
- `react-components-typescript.md`
- `react-components-composition.md`
- `react-components-discriminated-unions.md`
- `react-components-conditional-render.md`

### Category 3: State Management (MEDIUM)
- `react-state-local.md`
- `react-state-reducer.md`
- `react-state-context.md`
- `react-state-derived.md`

### Category 4: Re-render Optimization (MEDIUM)
- `react-rerender-memo.md`
- `react-rerender-usememo.md`
- `react-rerender-usecallback.md`
- `react-rerender-functional-setstate.md`
- `react-rerender-lazy-init.md`
- `react-rerender-transitions.md`
- `react-rerender-avoid-inline-objects.md`

### Category 5: Side Effects (LOW-MEDIUM)
- `react-effects-dependencies.md`
- `react-effects-cleanup.md`
- `react-effects-race-condition.md`
- `react-effects-custom-hooks.md`

### Category 6: JavaScript Performance (LOW)
- `react-js-index-maps.md`
- `react-js-tosorted.md`
- `react-js-early-exit.md`
- `react-js-property-access.md`
- `react-js-set-lookups.md`

---

## Anti-Patterns to Avoid

### 1. Mutating State Directly

**Bad**:
```tsx
const [items, setItems] = useState([1, 2, 3])
items.push(4) // Direct mutation - FORBIDDEN
setItems(items) // Won't trigger re-render (same reference)
```

**Good**:
```tsx
setItems([...items, 4]) // New array
// Or
setItems(prev => [...prev, 4])
```

### 2. Using Index as Key for Dynamic Lists

**Bad**:
```tsx
{items.map((item, index) => (
  <li key={index}>{item}</li> // Breaks on reorder/delete
))}
```

**Good**:
```tsx
{items.map(item => (
  <li key={item.id}>{item.name}</li> // Stable identity
))}
```

### 3. Inline Objects/Arrays in JSX

**Bad**:
```tsx
// New array every render
<Select options={['a', 'b', 'c']} />
// New object every render
<div style={{ color: 'red' }} />
```

**Good**:
```tsx
const OPTIONS = ['a', 'b', 'c']
const redStyle = { color: 'red' }

<Select options={OPTIONS} />
<div style={redStyle} />
```

### 4. Unnecessary useEffect for Derived State

**Bad**:
```tsx
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')

useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])
```

**Good**:
```tsx
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const fullName = `${firstName} ${lastName}` // Just calculate it
```

---

## Key Principles

1. **Parallelize independent operations** (CRITICAL impact)
2. **Load code on demand, not upfront** (CRITICAL impact)
3. **Derive state instead of syncing it**
4. **Use the right state solution for the scope**
5. **Memoize expensive computations and stable references**
6. **Always clean up side effects**
7. **Build indexes for repeated lookups**
