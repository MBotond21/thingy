# Thingy

**Thingy** is a user experience–driven music player with a customizable UI to make your listening experience unique and comfortable.

---

## ✨ Features

- Customizable themes
- User management
- Playlist creation and management (registration required)
- Integration with a third-party music API
- Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 🚀 Getting Started

### Prerequisites

1. Clone/download the [Backend Repository](https://github.com/BroGamesJaj/BackThingy) and follow its README for setup.
2. Ensure the backend runs on `http://localhost:3000`.
3. Internet connection is required for third-party music API access.

### Installation

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
src/
├── assets/          # Static files
├── components/      # Reusable components
├── contexts/        # contexts
├── pages/           # Route-level components
```

---

### API Communication

- Uses Fetch to interact with the backend at http://localhost:3000.

- Backend handles auth, playlists, and search functions.

## 👥 Authors / Contributors

- Pásztor Botond
- Mészáros Botond