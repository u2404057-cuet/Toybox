<div align="center">

# 🧸 ToyBox

### *Premium toys for kids — browse, filter, and check out in a clean, playful storefront.*

<br/>

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-toybox--hazel.vercel.app-2D5D7B?style=for-the-badge&logoColor=white)](https://toybox-hazel.vercel.app)
[![Repo](https://img.shields.io/badge/📁%20Repo-GitHub-1E1E1E?style=for-the-badge&logo=github)](https://github.com/u2404057-cuet/Toybox)

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38BDF8?style=flat-square&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-433E38?style=flat-square)
![NextAuth](https://img.shields.io/badge/NextAuth.js-Auth-000000?style=flat-square)

</div>

---

## 🧩 What is ToyBox?

**ToyBox** is a full-stack toy e-commerce storefront built to feel like a boutique, not a generic template. Shoppers browse toys by category, search and sort in real time, and check out through a cart — while an admin dashboard on the back end handles inventory, low-stock alerts, and order stats.

> *Built as a personal project to practice real e-commerce patterns: category filtering, client-side cart state, protected admin routes, and a decoupled REST API.*

---

## 📸 Screenshot

![ToyBox homepage](./screenshot.png)

---

## ✨ Key Features

### 🛍️ Storefront
- Browse toys across categories — Action Figures, Dolls, Board Games, Educational, Outdoor
- Live search, category filter, and sort (newest, price)
- Responsive product grid with loading states

### 🛒 Cart
- Client-side cart powered by **Zustand**, with running total
- Add / update / remove items without a page reload
- Empty-cart state with a call-to-action back to shopping

### 🔐 Authentication
- Sign in / sign up via **NextAuth.js**
- Session-aware UI (cart, account, admin access)

### 🛠️ Admin Dashboard
- Today's orders and total revenue at a glance
- Low-stock product alerts
- Add, edit, and delete products through a modal form
- Category-aware product table

### 🔔 Feedback & UX
- Toast notifications (`react-hot-toast`) for cart and admin actions
- Icon set via `lucide-react`
- Custom typography (Nunito, DM Sans, DM Mono) for a distinct storefront feel

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Client State | Zustand (cart store) |
| Auth | NextAuth.js |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Backend | Custom REST API (separate service, image uploads via multipart) |
| Deployment | Vercel |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `next` ^16.2.5 | React framework with App Router |
| `react` / `react-dom` 19.2.4 | UI library |
| `next-auth` ^4.24.14 | Authentication |
| `zustand` ^5.0.13 | Cart / global client state |
| `lucide-react` | Icon set |
| `react-hot-toast` ^2.6.0 | Toast notifications |
| `tailwindcss` ^4 | Utility-first CSS |

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- A running instance of the ToyBox API (or your own mock/API URL)

### Setup

```bash
git clone https://github.com/u2404057-cuet/Toybox.git
cd Toybox
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5001
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

---

## 🌐 Live Links

| Resource | URL |
|----------|-----|
| 🧸 Live Site | [toybox-hazel.vercel.app](https://toybox-hazel.vercel.app) |
| 📁 Repo | [github.com/u2404057-cuet/Toybox](https://github.com/u2404057-cuet/Toybox) |

---

<div align="center">

*Made with care by* **Rahimul Hoque** — *CUET CSE*

[![GitHub](https://img.shields.io/badge/GitHub-u2404057--cuet-1E1E1E?style=flat-square&logo=github)](https://github.com/u2404057-cuet)

</div>
