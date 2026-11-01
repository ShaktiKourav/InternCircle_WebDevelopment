# Taskly — Interactive To-Do List with LocalStorage

A responsive task manager built with semantic HTML, CSS and vanilla JavaScript.

## Features
- Add tasks using the Add button or Enter key
- Rejects blank/whitespace-only tasks
- Mark tasks complete or active
- Delete individual tasks
- Filter All, Active and Completed tasks
- Remaining-task counter and completed summary
- Clear all completed tasks
- Persists tasks in browser `localStorage`
- Handles malformed/corrupted stored JSON safely
- Uses DOM APIs and `textContent` for user-provided task text (never `innerHTML`)

## Run locally
Open `index.html` in a browser, or use VS Code Live Server.

## How data persistence works
When the app starts, `loadTasks()` reads the saved string from `localStorage` and converts it into an array with `JSON.parse()`. It validates the parsed data before using it. Whenever tasks change, `saveTasks()` converts the current array into a string with `JSON.stringify()` and stores it with `localStorage.setItem()`. This means tasks remain available after a page reload in the same browser on the same device.

If stored data is invalid JSON or has an unexpected shape, the app catches the error and starts with an empty task list rather than crashing.

## Publish free with GitHub Pages
1. Create a public GitHub repository, e.g. `Interactive-Todo-LocalStorage`.
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/(root)`, then Save.
5. Wait for GitHub Pages to publish and open the public URL.

## Suggested submission note
> I used browser localStorage to persist the task array. On page load, the app reads and validates the saved JSON using `JSON.parse()`. When a task is added, completed, deleted or cleared, the updated array is saved using `JSON.stringify()` and `localStorage.setItem()`. User-entered text is rendered with `textContent` to avoid injecting HTML.
