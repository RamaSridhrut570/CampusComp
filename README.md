# 🎓 Campus Companion – Productivity Tools (Offline MVP)

A lightweight, offline-first web app designed to help students manage their **daily academic and personal routines** with simple productivity tools.
No login, no servers — just clean tools that run **directly in the browser** with **LocalStorage** support.

---

## 🚀 Features

### ✅ Core Tools

* **Budget Manager** – Track expenses by category, view monthly totals, and see a breakdown.
* **Pomodoro Timer** – Classic focus timer with customizable sessions and streak tracking.
* **To-Do List** – Simple, fast task manager with pending/completed separation.
* **Habit Tracker** – Build positive habits with streak counters and monthly progress view.

### 🌟 Why This App?

* Fully **offline** (no internet required after first load).
* Data saved in **LocalStorage** (persists across sessions).
* Minimalist **distraction-free design**.
* Works on **mobile and desktop**.

---

## 🛠️ Tech Stack

* **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [TailwindCSS](https://tailwindcss.com/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Storage:** LocalStorage (offline persistence)

---

## 🗂️ Project Structure

```
src/
 ├─ App.tsx              # Main app layout (Sidebar + Views)
 ├─ components/          # Shared UI components
 ├─ views/
 │   ├─ Dashboard.tsx    # Summary of all tools
 │   ├─ BudgetManager.tsx
 │   ├─ PomodoroTimer.tsx
 │   ├─ TodoList.tsx
 │   └─ HabitTracker.tsx
 ├─ types.ts             # TypeScript interfaces
 ├─ constants.tsx        # Icons and static data
 └─ index.tsx            # Entry point
```

---

## 💻 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/campus-companion.git
cd campus-companion
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Dev Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 🗕️ Roadmap

* [x] MVP with Budget Manager + To-Do List
* [x] Add Pomodoro Timer
* [x] Add Habit Tracker
* [ ] Dashboard summary view
* [ ] Expense charts & habit streak visualization
* [ ] Export/import data (JSON backup)

---

## 🌈 UI/UX Principles

* **Simple & clean** → no clutter, just essentials.
* **Mobile-first** → fully responsive.
* **Stress-free colors** → soft blue/green backgrounds.

---

## 📜 License

MIT License. Free to use, modify, and share.

---

👨‍💻 Made with ❤️ by students, for students.
