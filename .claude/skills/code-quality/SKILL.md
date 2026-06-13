---
name: code-quality
type: capability
description: "코드 품질 분석 및 개선. 코드 스멜 탐지, 리팩토링 가이드, 아키텍처 검토를 수행합니다. 사용 시점: (1) 코드 리뷰에서 품질 이슈를 체계적으로 분석할 때, (2) 리팩토링 방향을 결정할 때, (3) 아키텍처 개선점을 파악할 때. /code-quality 커맨드로 호출."
allowed-tools:
  - Read
  - Grep
  - Glob
  - LSP
  - mcp__serena__get_symbols_overview
  - mcp__serena__find_symbol
  - mcp__serena__find_referencing_symbols
---

# Code Quality

Analyze and improve code quality through systematic review, refactoring guidance, clean-architecture
checks, and TDD discipline review.

> **Independent, read-only skill.** This SKILL is self-contained and does not route to or depend on
> any other skill, the `.agents/skills` Codex SoT, or any write-capable executor. It analyzes and
> advises only — it never edits code, runs gates, or self-approves. Stack context for this repo:
> Expo React Native + TypeScript + NativeWind, with `packages/contracts` as the shared API-type SoT.

## Code Smells Detection

### Common Code Smells

```
  Smell          Description
  ─────────────  ─────────────────────────────────────────────────
  Long Method    Method doing too much (>50 lines)
  Large Class    Class with too many responsibilities
  Duplicate Code Copy-pasted logic
  Dead Code      Unused code
  Magic Numbers  Unexplained literals
  Deep Nesting   Too many indentation levels (>3)
  God Object     Object that knows/does too much
  Feature Envy   Method using other class's data excessively
  ─────────────  ─────────────────────────────────────────────────
```

### Detection Workflow

1. Analyze code structure using `get_symbols_overview`
2. Check for common patterns with Grep
3. Measure complexity metrics
4. Report findings with file:line locations

## Refactoring Patterns

### Extract Method

**Before**:
```typescript
function processOrder(order) {
  // validate
  if (!order.items) throw new Error('No items');
  if (!order.customer) throw new Error('No customer');

  // calculate total
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // apply discount
  if (order.customer.isPremium) {
    total *= 0.9;
  }

  return total;
}
```

**After**:
```typescript
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order.items);
  return applyDiscount(total, order.customer);
}
```

### Replace Magic Numbers

**Before**:
```typescript
if (user.age >= 18) {
  if (order.total > 10000) {
    discount = order.total * 0.1;
  }
}
```

**After**:
```typescript
const ADULT_AGE = 18;
const DISCOUNT_THRESHOLD = 10000;
const DISCOUNT_RATE = 0.1;

if (user.age >= ADULT_AGE) {
  if (order.total > DISCOUNT_THRESHOLD) {
    discount = order.total * DISCOUNT_RATE;
  }
}
```

### Reduce Nesting

**Before**:
```typescript
function process(data) {
  if (data) {
    if (data.valid) {
      if (data.items.length > 0) {
        return data.items.map(item => item.value);
      }
    }
  }
  return [];
}
```

**After**:
```typescript
function process(data) {
  if (!data?.valid) return [];
  if (data.items.length === 0) return [];
  return data.items.map(item => item.value);
}
```

## Quality Metrics

### Complexity Thresholds

```
  Metric                   Good   Warning  Critical
  ───────────────────────  ─────  ───────  ────────
  Cyclomatic Complexity    < 10   10-20    > 20
  Lines per Function       < 50   50-100   > 100
  Parameters per Function  < 4    4-6      > 6
  Nesting Depth            < 3    3-5      > 5
  ───────────────────────  ─────  ───────  ────────
```

### Coverage Targets

```
  Type       Minimum  Recommended
  ─────────  ───────  ───────────
  Statement  70%      85%
  Branch     60%      80%
  Function   80%      90%
  ─────────  ───────  ───────────
```

## When to Use

Use this skill when you need to:

```
  Scenario                Primary Tool              When to Use
  ──────────────────────  ────────────────────────  ──────────────────────────────────────────
  Code smell detection    Grep + patterns           Find Long Method, Magic Numbers, Nesting
  Structure analysis      get_symbols_overview      Understand file/class organization
  Impact before refactor  find_referencing_symbols  Check what will break
  Dependency check        LSP findReferences        Trace symbol usage across codebase
  Architecture violation  Grep + layer patterns     Detect layer violations
  Duplicate code          Grep multiline            Find copy-pasted blocks
  ──────────────────────  ────────────────────────  ──────────────────────────────────────────
```

### Tool Selection Guide

```
  Task                      Best Tool                Alternative
  ────────────────────────  ───────────────────────  ─────────────────────────
  Find function usages      LSP findReferences       find_referencing_symbols
  Analyze file structure    get_symbols_overview     LSP documentSymbol
  Detect code patterns      Grep with regex          search_for_pattern
  Check import dependencies Grep "import|require"    get_symbols_overview
  Measure complexity        Read + count lines       -
  ────────────────────────  ───────────────────────  ─────────────────────────
```

### When NOT to Use

- Simple typo fixes → no analysis needed (the owning role handles it directly)
- Single-line changes → no analysis needed
- Already know exact location → Read directly

> This skill is analysis-only: it surfaces findings and recommendations. Any code edit, refactor, or
> test run is performed by the owning write-side role/workflow, not by this skill.

## Tools & Integration

### Serena Plugin
- `find_symbol` - Locate code for analysis
- `get_symbols_overview` - Structure analysis
- `find_referencing_symbols` - Impact analysis before refactoring

### LSP
- `findReferences` - Find all usages before changing
- `goToDefinition` - Navigate to implementation

### Grep/Glob
- Pattern-based code smell detection
- Find duplicate code blocks

## TDD Discipline (tests-first review)

This repo follows tests-first development. Use this section to verify TDD was honored — analysis
only; this skill does not write tests or code.

### RED -> GREEN -> REFACTOR

```
  Phase     Expectation
  --------  -----------------------------------------------------------------
  RED       A failing test / eval / validator assertion lands BEFORE the
            implementation change. The narrowest test that captures intent.
  GREEN     The smallest implementation that makes the failing test pass.
            No extra scope, no speculative abstraction.
  REFACTOR  Clean up under green tests: remove duplication, extract methods,
            rename for intent. Tests stay green throughout.
  --------  -----------------------------------------------------------------
```

### TDD review checklist

- [ ] A test/eval/validator changed in the same change set as the behavior (tests-first evidence).
- [ ] The test fails without the implementation and passes with it (genuine RED->GREEN).
- [ ] Test asserts behavior/contract, not implementation details that block safe refactoring.
- [ ] Coverage meets the targets in **Quality Metrics -> Coverage Targets** below.
- [ ] Refactors are covered by existing green tests; no behavior change rides in unannounced.
- [ ] Shared API request/response types are asserted against `packages/contracts`, not re-declared.

## Workflows

### Quality Audit

1. Read file content
2. Analyze structure and complexity with `get_symbols_overview`
3. Check for code smells using pattern matching
4. Measure metrics against thresholds
5. Provide improvement suggestions with priorities

### Refactoring Session (analysis & recommendation only)

1. Analyze current implementation
2. Use `find_referencing_symbols` for impact analysis
3. Identify refactoring opportunities
4. Recommend appropriate patterns (the owning role applies them)
5. Note which tests must stay green after the refactor
6. List the changes the owning role should document

### Technical Debt Assessment

1. Scan codebase for issues using Grep patterns
2. Categorize by severity (Critical/Warning/Info)
3. Estimate effort to fix
4. Prioritize by impact
5. Create remediation plan

## Architecture Quality

### Architecture Smells

```
  Smell                Description
  ───────────────────  ───────────────────────────────────────────
  Layer Violation      Inner layer depends on outer layer
  Boundary Leak        Entity exposed outside Application
  Circular Dependency  Modules depend on each other
  God Module           Module with too many responsibilities
  Skip Layer           Controller directly calls Domain
  Framework Coupling   Domain depends on framework
  ───────────────────  ───────────────────────────────────────────
```

### Layer Dependency Rules

```
[Infrastructure] → [Adapters] → [Application] → [Domain]
     outer            ↓              ↓           inner
                  (inward only)
```

```
  Layer           May Depend On          Must NOT Depend On
  ──────────────  ─────────────────────  ─────────────────────────────────────────
  Domain          Nothing                Application, Adapters, Infrastructure
  Application     Domain                 Adapters, Infrastructure
  Adapters        Application, Domain    Infrastructure
  Infrastructure  All layers             -
  ──────────────  ─────────────────────  ─────────────────────────────────────────
```

### Architecture Anti-Patterns

**Domain Layer Violations:**
- ORM annotations in Domain entities
- HTTP Request/Response objects in Domain
- Framework dependencies in Domain

**Application Layer Violations:**
- Direct DB query execution
- HTTP request/response handling
- UI formatting logic

**Boundary Violations:**
- Entity passed directly to Controller
- ORM model used as API response
- Framework objects passed to inner layers

### Architecture Review Workflow

1. Identify layer structure using `get_symbols_overview`
2. Check dependency directions with `find_referencing_symbols`
3. Detect anti-patterns using Grep
4. Report violations with file:line locations
5. Suggest remediation steps

### Architecture Quality Gate

Checklist for architecture review:

- [ ] Domain layer has no external dependencies
- [ ] Application doesn't reference Infrastructure directly
- [ ] Data crossing boundaries uses DTOs
- [ ] External dependencies abstracted via interfaces
- [ ] No framework annotations in Domain entities

### Mobile (Expo RN) boundary notes

- Keep screens/components (presentation) free of direct data-access or transport logic; route data
  through hooks/services so UI stays declarative and testable.
- Treat `packages/contracts` as the contract boundary: mobile code consumes shared request/response
  types from it and must not redeclare or infer API shapes locally.
- Domain/business logic should not import Expo/React Native UI primitives.

This skill is self-contained; the rules above are inline and do not depend on any other skill.
