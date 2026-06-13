---
title: useTransition for Non-Urgent Updates
impact: MEDIUM
impactDescription: Keeps UI responsive during heavy updates
tags: useTransition, concurrent, performance
---

## useTransition for Non-Urgent Updates

**Impact: MEDIUM - Keeps UI responsive during heavy updates**

startTransition marks updates as interruptible, allowing urgent updates to take priority.

**Incorrect (every scroll event is an urgent update):**

```tsx
import { ScrollView } from 'react-native'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)

  return (
    <ScrollView
      onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)} // Urgent update
      scrollEventThrottle={16}
    />
  )
}
```

**Correct (scroll updates marked as non-urgent):**

```tsx
import { startTransition } from 'react'
import { ScrollView } from 'react-native'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)

  return (
    <ScrollView
      onScroll={(e) => {
        const y = e.nativeEvent.contentOffset.y
        startTransition(() => setScrollY(y)) // Non-urgent
      }}
      scrollEventThrottle={16}
    />
  )
}
```

**Why**: startTransition marks updates as interruptible, allowing urgent updates to take priority.

Reference: [useTransition](https://react.dev/reference/react/useTransition)
