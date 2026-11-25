# Local Verification Checklist — HRGMS

Tick each item on your own machine before submitting. Take screenshots of the real results for the documentation.

## Setup
- [ ] `database/schema.sql` imports without errors (database `03_hrgms_db` appears with 5 tables).
- [ ] `.env` exists (copied from `.env.example`) with your MySQL password and a unique `JWT_SECRET`.
- [ ] `npm install` completes.
- [ ] `npm run build` completes without errors.
- [ ] `npm run start:dev` prints `API running on http://localhost:3000/api` with no errors.

## Authentication
- [ ] Register returns 201 and no password hash (or 409 if the demo user already exists).
- [ ] Login returns 200 and an `access_token`.
- [ ] `GET /api/auth/me` returns 200 with the logged-in user.
- [ ] A protected route without a token returns 401.
- [ ] A protected route with a bad token returns 401.

## CRUD (every module)
- [ ] Guest: create (201), list, count, read one, update (200), delete (200).
- [ ] Room: create (201), list, count, read one, update (200), delete (200).
- [ ] Reservation: create (201), list, count, read one, update (200), delete (200).
- [ ] Invoice: create (201), list, count, read one, update (200), delete (200).
- [ ] Foreign-key violations return 400 / 409 (not 500).
- [ ] Validation errors return 400.

## Postman
- [ ] Imported `postman/collection.json`; *Run collection* shows all tests passing.
- [ ] Exported the collection again (`.json`) for submission.

## Submission
- [ ] SQL export (`.sql`) created from phpMyAdmin after testing (Export → SQL).
- [ ] GitHub repository created; at least 5 commits (`bash scripts/git_commit_plan.sh`); `.env` NOT pushed.
- [ ] Video (5–10 min, narrated) recorded and link tested in an incognito window.
- [ ] GitHub link and video link added to the cover page of the documentation PDF.
