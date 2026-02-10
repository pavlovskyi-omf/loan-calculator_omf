# 🏠 HomewoHome Task 05: Apply Specification-Driven Development Flow to an Existing Project

## Goal
Practice the full Specification-Driven Development (SDD) workflow using GitHub Spec Kit by implementing a feature in an **existing (brownfield) project**.

You will apply the full flow:
**Constitution → Spec → Clarify → Plan → Tasks → Analyze → Implement**

---

## Context

Choose **one** of the following options.

### Option A – Demo Project (Recommended)
- Work branch:  
  https://github.com/pavlovskyi-omf/loan-calculator_omf/tree/context-engineering_inital-state
- User Story:  
  **Dynamic Adjustment of Estimated Monthly Payment Options**  
  https://github.com/pavlovskyi-omf/loan-calculator_omf/blob/spec-kit_demo/docs/user-stories/dynamic-estimated-payment-user-story.md

### Option B – Your Own Project
- Any existing repository where you can safely experiment with Spec Kit.

---

## Step-by-Step Tasks

### 1. Initialize Spec Kit
- Run `specify init` in the project root
- Use `--here` or `--force` if needed
- Verify setup with `specify check`

Expected result:
- `.specify/` directory
- `.github/prompts/` directory

---

### 2. Define Project Constitution
Use `/speckit.constitution`.

Include:
- Coding standards
- Testing requirements
- Performance constraints
- Security rules
- Architectural boundaries
- References to existing docs (`PRODUCT.md`, `ARCHITECTURE.md`) if available

Output:
- `.specify/memory/constitution.md`

---

### 3. Create Feature Specification
Use `/speckit.specify`.

Your spec must include:
- Current behavior
- Desired behavior
- User stories
- Edge cases
- Acceptance criteria
- Backward compatibility constraints

For Option A, base the spec on the provided user story.

Output:
- `.specify/specs/<NNN-feature-name>/spec.md`

---

### 4. Clarify Open Questions
Use `/speckit.clarify`.

Focus on:
- Integration risks
- Rollout strategy
- Failure scenarios
- Testing approach
- Migration considerations

Update the spec if needed.

---

### 5. Generate Technical Plan
Use `/speckit.plan`.

Plan must describe:
- Components affected
- Architecture alignment
- Data or API changes
- Testing strategy
- Deployment and rollout
- Observability and logging

Output:
- `plan.md` in the same spec folder

---

### 6. Generate Task Breakdown
Use `/speckit.tasks`.

Ensure tasks are:
- Small
- Reviewable
- Testable
- Aligned with repository standards

Output:
- `tasks.md`

---

### 7. Analyze and Implement
Before coding:
- Run `/speckit.analyze`

Then:
- Run `/speckit.implement`
- Complete the generated tasks
- Update or add tests
- Validate acceptance criteria

---

## Deliverables

Submit:
1. Repository link (branch or fork)
2. Spec directory containing:
   - `spec.md`
   - `plan.md`
   - `tasks.md`
3. Implemented feature
4. Short reflection (README or comment):
   - What worked well
   - Main challenges
   - Where AI helped most
   - How SDD changed your workflow

---

## Acceptance Criteria

The task is complete if:
- Spec Kit is initialized correctly
- Constitution is defined
- Feature spec is clear and complete
- Plan aligns with existing architecture
- Tasks are granular and traceable
- Feature works as specified
- Tests are updated or added
- Reflection is provided

---

## Bonus (Optional)
- Compare SDD vs vibe coding
- Improve the constitution after implementation
- Add rollback or migration notes
- Propose improvements to the original user story

---

Use AI intentionally and stay smart 🚀
