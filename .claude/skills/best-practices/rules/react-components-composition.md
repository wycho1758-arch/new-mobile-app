---
title: Component Composition over Props Drilling
impact: MEDIUM
impactDescription: Reduces coupling, increases flexibility
tags: composition, props, patterns
---

## Component Composition over Props Drilling

**Impact: MEDIUM - Reduces coupling, increases flexibility**

Composition allows consumers to customize structure and content without adding more props.

**Incorrect (props drilling makes component inflexible):**

```tsx
import { View, Text } from 'react-native'

interface CardProps {
  title: string
  content: string
  headerClassName?: string
  bodyClassName?: string
}

function Card({ title, content, headerClassName, bodyClassName }: CardProps) {
  return (
    <View className="card">
      <View className={headerClassName}><Text>{title}</Text></View>
      <View className={bodyClassName}><Text>{content}</Text></View>
    </View>
  )
}
```

**Correct (composition pattern):**

```tsx
import { View, Text } from 'react-native'

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={`card ${className ?? ''}`}>{children}</View>
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <View className="card-header">{children}</View>
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <View className="card-body">{children}</View>
}

// Usage - highly flexible (NativeWind className on RN primitives)
<Card>
  <CardHeader><Text>Title</Text></CardHeader>
  <CardBody><Text>Any content here</Text></CardBody>
</Card>
```

**Why**: Composition allows consumers to customize structure and content without adding more props.

Reference: [Composition vs Inheritance](https://react.dev/learn/thinking-in-react)
