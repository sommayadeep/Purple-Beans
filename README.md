<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=32&duration=3000&pause=1000&color=A855F7&center=true&vCenter=true&width=600&lines=Purple+Beans+%E2%98%95;Crafted+Beyond+Coffee;Cinematic+E-Commerce+Experience;Next.js+%2B+TypeScript+%2B+Razorpay" alt="Typing SVG" />

<br/>

![Repo Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=PURPLE%20BEANS&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Premium%20AI-Powered%20Cinematic%20Coffee%20Roastery&descAlignY=58&descSize=18)

<p>
  <img src="https://img.shields.io/badge/TypeScript-99.3%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/status-in%20development-A855F7?style=for-the-badge" />
  <img src="https://img.shields.io/github/stars/sommayadeep/Purple-Beans?style=for-the-badge&color=FFD700&logo=github" />
  <img src="https://img.shields.io/github/last-commit/sommayadeep/Purple-Beans?style=for-the-badge&color=6E56CF" />
</p>

<p>
  <a href="https://purple-beans.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-visit%20site-9333EA?style=for-the-badge&logo=vercel&logoColor=white" /></a>
</p>

</div>

## ☕ About the Project

**Purple Beans** is a full-stack, cinema-inspired e-commerce platform built for **Purple Beans Agro Industries Pvt Ltd** — a premium micro-lot coffee roastery. This repo was built during my internship as a Software Development intern, where I owned the end-to-end build: storefront experience, checkout flow, and backend services.

The design direction leans into a **"Dark Roast Cinema"** aesthetic — moody gradients, cinematic motion, and a luxury-retail feel — while the engineering underneath is a modern, type-safe, production-grade stack.

> 🔗 **Live site:** [purple-beans.vercel.app](https://purple-beans.vercel.app/)

<br/>

## ✨ Features

```
🛍️  Reserve Collection storefront with curated micro-lot listings
📖  Coffee Journal / blog for storytelling & brand content
🔐  Secure authentication flow (login / account access)
💳  Integrated payment processing for checkout
📬  Newsletter capture for limited-release drops
🎬  Cinematic, motion-driven UI/UX across the storefront
📱  Fully responsive, mobile-first layout
```

<br/>

## 🧠 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nextjs,ts,react,nodejs,express,postgres,prisma,tailwind,vercel,render,git,github" />

</div>

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router), TypeScript, TailwindCSS, Framer Motion |
| **Backend** | Node.js / Express (deployed separately, see `render.yaml`) |
| **Database & ORM** | Supabase (PostgreSQL) + Prisma |
| **Payments** | Razorpay |
| **Hosting** | Frontend on **Vercel**, Backend on **Render** |
| **Language Split** | 99.3% TypeScript |

</div>

<br/>

## 🏗️ Project Structure

```bash
Purple-Beans/
├── frontend/          # Next.js storefront — UI, routing, checkout flow
├── backend/           # Node/Express API — auth, orders, payments
├── render.yaml        # Render deployment config for the backend service
├── package.json       # Root workspace config
└── .gitignore
```

<br/>

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/sommayadeep/Purple-Beans.git
cd Purple-Beans

# 2. Install dependencies for each workspace
cd frontend && npm install
cd ../backend && npm install

# 3. Set up environment variables
# create .env files in /frontend and /backend — see below

# 4. Run the frontend
cd frontend
npm run dev

# 5. Run the backend
cd backend
npm run dev
```

### 🔑 Environment Variables

<details>
<summary>Click to expand</summary>

**frontend/.env.local**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_API_BASE_URL=
```

**backend/.env**
```env
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_SECRET=
PORT=
```

</details>

<br/>

## 🗺️ Roadmap

- [x] Storefront UI + product listings
- [x] Auth flow
- [x] Payment integration
- [ ] Order tracking dashboard
- [ ] Admin panel for inventory
- [ ] Reviews & ratings system

<br/>

## 🤝 Contributing

This is currently a solo-built internship project, but suggestions and issues are welcome — feel free to open a PR or drop an issue.

```bash
1. Fork the repo
2. Create your branch:  git checkout -b feature/your-feature
3. Commit your changes: git commit -m "Add: your feature"
4. Push:                git push origin feature/your-feature
5. Open a Pull Request
```

<br/>

## 👤 Author

<div align="center">

**Sommayadeep Saha**

[![Portfolio](https://img.shields.io/badge/Portfolio-deepsfolio.vercel.app-A855F7?style=for-the-badge&logo=vercel&logoColor=white)](https://deepsfolio.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-sommayadeep-181717?style=for-the-badge&logo=github)](https://github.com/sommayadeep)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>
