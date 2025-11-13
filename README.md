# Student Registration System

A small web project for Assignment 1 — add, edit, delete student records with Local Storage persistence.

## Files
- `index.html` — main page (form + display)
- `style.css` — styles & responsiveness
- `script.js` — all JS: validation, localStorage, dynamic scrollbar

## How to run
Open `index.html` in a modern browser (Chrome/Edge/Firefox). No backend required.

## Git submission instructions (Important)
Make **separate commits** for HTML, CSS, JS and README:
1. `git init`
2. `git add index.html` 
3. `git commit -m "Add index.html: basic structure and header"`
4. `git add style.css`
5. `git commit -m "Add style.css: responsive layout & styles"`
6. `git add script.js`
7. `git commit -m "Add script.js: add/edit/delete, validation, localStorage"`
8. `git add README.md`
9. `git commit -m "Add README with run & git instructions"`
10. Create a GitHub repo and push.

If you used Tailwind or any build tool remove `node_modules` before zipping.

## Notes
- Validation enforces the assignment rules:
  - Name: letters & spaces only
  - Student ID and Contact: numeric only
  - Contact minimum 10 digits
  - Email: basic valid format
- Data persists via `localStorage` under the key `students_v1`.
- The dynamic vertical scrollbar is toggled by JavaScript based on table wrapper content height.

