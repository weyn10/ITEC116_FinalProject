#!/usr/bin/env bash
# Creates 6 meaningful commits. Run from the project root:  bash scripts/git_commit_plan.sh
set -e
[ -d .git ] || git init
# Set these once if git asks who you are:
#   git config user.name  "Your Name"
#   git config user.email "you@example.com"

git add package.json tsconfig.json nest-cli.json .gitignore .env.example README.md
git commit -m "chore: initialize NestJS project and configuration"

git add database src/users
git commit -m "feat: add MySQL schema and User entity"

git add src/auth src/common
git commit -m "feat: implement JWT authentication, password hashing and error filter"

git add src/modules src/app.module.ts src/main.ts
git commit -m "feat: implement domain entities and CRUD REST APIs"

git add postman
git commit -m "test: add Postman collection with automated tests"

git add docs scripts
git commit -m "docs: add technical documentation, ERD, API reference and checklist"

git status --short
git log --oneline
