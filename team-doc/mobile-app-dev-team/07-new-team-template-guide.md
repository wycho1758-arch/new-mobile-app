# New Team Template Guide

Use this guide when creating another development team from this one.

## Step 1. Freeze Source Inputs

- Identify the repo/project SoT.
- Record runtime paths for skills, agents, hooks, evidence, and validation.
- Separate current managed docs from historical source exports.
- Confirm whether OpenClaw skills exist or remain deferred.

## Step 2. Define Team Shape

- List display titles separately from Operating Role values.
- Keep Operating Role values stable when skills, agents, fixtures, gates, or validators depend on them.
- Use Chief Product Officer (CPO) / Product Delivery Lead only as the top product/delivery display title when Product/Planning remains the operating role.
- Route technical decisions from Product/Planning to the technical owner instead of collapsing architecture authority into the product role.
- List LLM roles.
- List non-LLM deterministic gates separately.
- Do not create SOUL.md for deterministic gates.
- Avoid adding roles until a repeated ownership gap exists.

## Step 3. Write Role SOUL.md Files

Each role page should contain:

- Display Title.
- Operating Role.
- Authority Level.
- Mission.
- Responsibilities.
- Inputs.
- Outputs.
- Available skills.
- Available read-only agents.
- Handoffs.
- Do-not rules.
- Human gate triggers.

## Step 4. Create Capability Matrix

Document:

- What each role can do.
- What each role produces.
- Who receives the handoff.
- What the role must not do.

## Step 5. Create Skill/Agent Matrix

- Treat only actual local skill directories as active.
- Mark old names as historical.
- Separate primary routing from legacy/runtime-specific agents.
- Keep reviewer/researcher agents read-only.

## Step 6. Define Process

At minimum:

1. Intake.
2. Scope/readiness.
3. Design/API readiness.
4. Tests-first implementation.
5. QA evidence.
6. Reviewer evidence.
7. PR gates.
8. Release/human gates.

## Step 7. Add Validation

- Add the smallest validator/eval/assertion before writing implementation docs.
- Run the validator and confirm it fails for missing docs.
- Add docs until the validator passes.
- Run xhigh read-only review for role-boundary and source-map correctness.
