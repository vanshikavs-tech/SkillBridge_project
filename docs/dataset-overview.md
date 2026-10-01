# SkillBridge — Dataset Overview & Catalog

This directory contains the master dataset files that power the live SkillBridge platform:

## Files:
- `backend/dataset/seedDataset.js`: Full JavaScript dataset with linked relations
- `backend/dataset/projects.json`: 20 realistic project listings with budgets, skills, and deadlines
- `backend/dataset/users.json`: 12 detailed profiles (Clients, Freelancers, Administrators)
- `backend/dataset/categories.json`: 6 industry categories with icons and slugs

## Auto-Seeding:
The backend server automatically checks if the database is empty on startup. If 0 projects are found, it seeds this entire catalog in under 2 seconds!
