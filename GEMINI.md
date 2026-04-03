# Property Management Automation - Gemini Instructions

This file defines the commands and workflow for Gemini to follow in this project, replicating the "Speckit" workflow originally designed for Claude.

## Core Mandates

- Always follow the **Spec-Driven Development** workflow defined in `/.gemini/skills/speckit.md`.
- Prioritize TDD (Test-Driven Development) as per global instructions.
- Ensure all implementation matches the specifications in `/specs/`.

## SaaS Orchestration & Pre-flight Check

At the start of **every** turn, you MUST perform a "Pre-flight Check":
1. **Analyze the Task**: Determine the architectural and business domain (e.g., Auth, Billing, Database, UI).
2. **Select Skills**: Review the files in `/.gemini/skills/` and identify which specialized SaaS skills apply.
3. **Propose Activation**: State: "Activating skills: [list] for this task." If a new or complex approach is required, seek user confirmation first.
4. **Execute with Expertise**: Once a skill is mentioned, you MUST strictly adhere to its procedural instructions.

## Commands (Speckit Workflow)
...
To use these commands, refer to the detailed instructions in `/.gemini/skills/speckit.md`.

### `speckit.specify [description]`
Create or update a feature specification in `/specs/`.
- **Logic**: Follow "Phase: Specification" in speckit.md.

### `speckit.plan`
Generate technical artifacts (research, data model, contracts) based on the spec.
- **Logic**: Follow "Phase: Planning" in speckit.md.

### `speckit.tasks`
Generate a dependency-ordered `tasks.md` file.
- **Logic**: Follow "Phase: Task Generation" in speckit.md.

### `speckit.implement`
Execute the implementation phase based on `tasks.md`.
- **Logic**: Follow "Phase: Implementation" in speckit.md.

## Project Context

- **Stack**: Next.js 15, TypeScript, SQLite (Dev) / PostgreSQL (Prod), Prisma, Auth.js v5.
- **Root Directory**: `/mnt/c/Users/Danie/Desktop/faculdade/adminPropriedade`
- **Specs Directory**: `/specs/`
- **Speckit Scripts**: `/.specify/scripts/bash/`

## Phase 1-4 Implementation Status

The user has requested implementation of Phases 1 to 4 for the initial property management feature.
- **Current Task List**: `/specs/001-property-mgmt-automation/tasks.md`
- **Progress**: Most Phase 1-4 files have been created. Verification and final polish are needed.
