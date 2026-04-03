# Speckit Workflow for Gemini

This skill replicates the Speckit workflow originally designed for Claude. It guides Gemini through the lifecycle of a feature: from natural language description to a fully tested implementation.

## Core Mandates

1. **Spec-Driven**: Every feature must have a corresponding specification in `/specs/`.
2. **TDD**: Tests first, then implementation.
3. **Dependency-Ordered**: Follow the `tasks.md` order strictly.

---

## Phase: Specification (`speckit.specify`)

**Goal**: Create or update a feature specification.

1. **Short Name**: Generate a 2-4 word short name for the feature (e.g., "user-auth").
2. **Create Branch**: Run `.specify/scripts/bash/create-new-feature.sh "$DESCRIPTION" --json --short-name "$SHORT_NAME"`.
3. **Draft Spec**: Load `.specify/templates/spec-template.md` and fill it based on the user description.
   - Focus on **WHAT** and **WHY**.
   - Max 3 `[NEEDS CLARIFICATION]` markers.
4. **Quality Checklist**: Create `FEATURE_DIR/checklists/requirements.md` and verify the spec.

---

## Phase: Planning (`speckit.plan`)

**Goal**: Generate technical design artifacts.

1. **Setup**: Run `.specify/scripts/bash/setup-plan.sh --json`.
2. **Technical Context**: Fill the `plan.md` template with tech stack details.
3. **Artifacts**:
   - **Research**: Generate `research.md` for tech decisions.
   - **Data Model**: Generate `data-model.md` (entities, schemas).
   - **Contracts**: Generate `contracts/api-contracts.md`.
   - **Quickstart**: Generate `quickstart.md`.
4. **Agent Context**: Run `.specify/scripts/bash/update-agent-context.sh gemini`.

---

## Phase: Task Generation (`speckit.tasks`)

**Goal**: Create an actionable `tasks.md`.

1. **Setup**: Run `.specify/scripts/bash/check-prerequisites.sh --json`.
2. **Generate Tasks**: Use `.specify/templates/tasks-template.md`.
   - **Strict Format**: `- [ ] [T###] [P?] [Story] Description with file path`.
   - Organized by Phase: Setup -> Foundational -> User Stories (Priority Order) -> Polish.

---

## Phase: Implementation (`speckit.implement`)

**Goal**: Execute the tasks in `tasks.md`.

1. **Validate Prerequisites**: Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`.
2. **Iterative Execution**:
   - For each task:
     - **Plan**: Define the implementation and test strategy.
     - **Act**: Write tests (if TDD), ensure they fail, then implement.
     - **Validate**: Run tests and verify against the spec.
     - **Mark Done**: Update `tasks.md` with `[X]`.
3. **Reporting**: Report progress after each task.

---

## Commands Mapping

- `/speckit.specify [desc]` -> Execute Specification Phase.
- `/speckit.plan` -> Execute Planning Phase.
- `/speckit.tasks` -> Execute Task Generation Phase.
- `/speckit.implement` -> Execute Implementation Phase.
