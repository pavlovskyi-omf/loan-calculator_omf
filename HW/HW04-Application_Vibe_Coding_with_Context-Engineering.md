# 🏠 Home Task 04: Application Vibe Coding with Context Engineering

## Goal

Apply the Context Engineering and Vibe Coding workflow to implement a
complete demo application using GitHub Copilot, following the Prepare →
Plan → Build approach.

------------------------------------------------------------------------

## Assignment Overview

You will use the provided demo repository (with PRODUCT.md,
ARCHITECTURE.md, custom instructions, prompts, and agents) to AI-drive
the development of the entire application, not just a single feature.

Your task is to let Copilot "vibe code" the project end-to-end based on
structured context and workflows.

------------------------------------------------------------------------

## Part 1: Prepare Project Context

1.  Clone the demo repository.
2.  Review:
    -   PRODUCT.md
    -   ARCHITECTURE.md
    -   .github/copilot-instructions.md
    -   .github/prompts/\*
    -   .github/agents/\*
3.  Validate and improve context:
    -   Fix unclear requirements
    -   Add missing constraints
    -   Update instructions if needed
4.  Commit your improvements.

**Output:** - Updated documentation and instructions (if required)

------------------------------------------------------------------------

## Part 2: Plan the Full Application

1.  Use the Planning Agent or /plan-qna workflow.
2.  Generate a full application implementation plan.
3.  Ensure the plan includes:
    -   Architecture overview
    -   Major components
    -   Data flow
    -   Core features
    -   Testing strategy
    -   Deployment/setup steps
4.  Save as:

```{=html}
    app-implementation-plan.md
```

5.  Review and refine with follow-up prompts.

**Output:** - app-implementation-plan.md

------------------------------------------------------------------------

## Part 3: Vibe Code the Application

1.  Switch to Agent Mode.
2.  Reference your saved plan:

```{=html}
<!-- -->
```
    implement #app-implementation-plan.md

3.  Let Copilot:
    -   Generate structure
    -   Implement features
    -   Create tests
    -   Fix errors
    -   Refactor code
4.  Interact iteratively.

**Rule:**\
Do not manually code core logic. Guide the AI through prompts.

**Output:** - Working application - Passing tests


## Bonus (Optional)

-   Create review.agent.md
-   Add deployment workflow
-   Optimize prompts
-   Compare Agent vs Chat workflows

------------------------------------------------------------------------

## Expected Effort

-   Preparation: 30-45 min\
-   Planning: 30 min\
-   Implementation: 60-90 min

Total: \~1.5-3 hours
