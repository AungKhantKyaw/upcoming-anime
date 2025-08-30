# 📺 Upcoming Anime Episode List

A sleek React app that displays upcoming anime episodes, grouped by date, with countdown timers and pagination.  
Built with **Vite**, **React**, **TailwindCSS**, and **TypeScript**.

---

## 🚀 Features

- 🎨 **Modern UI** with TailwindCSS (gradient background, sticky headers, hover effects)  
- ⏳ **Countdown timer** for upcoming episodes  
- 🖼️ **Anime covers** with fallback placeholders  
- 🔄 **Pagination** (next / previous pages)  
- 📱 **Responsive design** (mobile → desktop)  

---

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/) – Fast dev environment  
- [React](https://react.dev/) – UI library  
- [TailwindCSS](https://tailwindcss.com/) – Styling  
- [TypeScript](https://www.typescriptlang.org/) – Type safety  
- [React Icons](https://react-icons.github.io/react-icons/) – Icons  

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/AungKhantKyaw/upcoming-anime.git
cd upcoming-anime
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root with:

```env
VITE_API_URL=http://localhost:5002
```

> The API should provide an endpoint like:  
> `/api/anime/upcoming?page=1&perPage=32`

### 4. Run the dev server
```bash
npm run dev
```

Then open 👉 [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
src/
├── components/
│   └── UpcomingAnime.tsx   # Main component
├── App.tsx
├── main.tsx
└── index.css
```

---