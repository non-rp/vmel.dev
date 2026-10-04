---
name: vmel-git
description: Handle branches, commits, GitHub pull requests and change review in the vmel.dev repository.
---

# Git workflow

The outer directory is the Git root; the application is the nested `vmel.dev/` directory. Start with `git status --short --branch` and inspect the relevant diff. Preserve changes that belong to the user.

Use a focused branch for a new substantial task. Continue its existing branch for corrections and follow-up work; do not create a branch for every message. Keep commits coherent and use concise English Conventional Commit messages.

Stage explicit paths. Inspect `git diff --cached --stat` and `git diff --cached --check`. Confirm the staged set excludes the CV, `.qa/`, secrets, dependencies, build output and client source material. Do not use history rewriting or force pushes unless specifically requested.

When publishing changes is authorized, push the task branch and create a GitHub PR against `main`; describe the behavior, validation and any setup still needed. Do not infer authorization to merge or deploy from authorization to push a branch. Respect explicit merge or deployment authorization already present in the session.

Before handoff, inspect Git status again and identify any intentional uncommitted files. Do not discard existing work to obtain a clean status.
