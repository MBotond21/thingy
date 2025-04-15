# Thingy

**Thingy** is a user experience–driven music player with a customizable UI to make your listening experience unique and comfortable, all made available in a web application.

---

## ✨ Features

- Customizable themes
- User management
- Playlist creation and management (registration required)
- Integration with a third-party music API
- Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

- <a href="https://reactjs.org/" target="_blank">React</a>
- <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>
- <a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a>
- <a href="https://vitejs.dev/" target="_blank">Vite</a>

---

## 🚀 Getting Started

### Prerequisites

1. Clone/download the <a href="https://github.com/BroGamesJaj/BackThingy" target="_blank">Backend Repository</a> and follow its README for setup.
2. Ensure the backend runs on `http://localhost:3000`.
3. Internet connection is required for third-party music API access.

### Installation

```bash
npm install
```

### Running app

```bash
# Start the dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 👨‍💻 Developer Guide

### Project structure

```bash
├── public/      # Publicly availabe images stored
├── src/         # Source files and folders
    ├── assets/          # Static files
    ├── components/      # Reusable components
    ├── contexts/        # Global state management
    ├── pages/           # Route-level components
```

---

### API Communication

- Uses Fetch to interact with the backend at http://localhost:3000.

- Also uses Fetch to interact with a third-party API: <a href="https://developer.jamendo.com/v3.0/docs" target="_blank">Jamendo</a>

- Backend handles auth, playlists, and search functions.

- Sourced from the third-party API:
    - Tracks
    - Albums
    - Artists

---

### Testing

- This project has manual tests, for which pleas refer to the <a href="https://github.com/MBotond21/thingy/wiki/Manual-Testing-Documentation">Testing Doc</a> under the Wiki section
- You can copy the markdown if you whish to expand or retest

## 👤 Author
- <a href="https://github.com/MBotond21" target="_blank">Mészáros Botond</a>
