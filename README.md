# 📰 News Portal - Next.js 16 Enterprise Edition

![Project Banner](https://via.placeholder.com/1200x400?text=News+Portal+Enterprise+Edition)

A modern, high-performance news application built with **Next.js 16**, **TypeScript**, and **TailwindCSS**. This project features a premium design, advanced user engagement tools, and robust architectural patterns including Incremental Static Regeneration (ISR).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)](https://tailwindcss.com/)

---

## 🚀 Key Features

This application goes beyond a simple blog, offering a full suite of enterprise-grade features:

### **🌟 Premium User Experience**
- **Responsive Design**: Mobile-first layout that adapts seamlessly from phones to 4K screens.
- **Glassmorphism UI**: Modern aesthetic with backdrop blurs, smooth gradients, and micro-interactions.
- **Reading Progress Bar**: Visual indicator of reading progress at the top of every article.
- **Dark Mode Ready**: Architecture supports system-wide theme preferences.

### **🛠️ Advanced Functionality**
- **Dynamic "E-Paper"**: A digital newspaper experience (`/newsletter`) with print-to-PDF capabilities.
- **Smart Search**: Integrated search functionality with real-time results (`/search`).
- **User Dashboard**: Profile management (`/profile`) and Saved Articles (`/saved`) with local persistence.
- **Social Sharing**: Native share API integration for Twitter, WhatsApp, and LinkedIn.
- **Reading Controls**: User-adjustable font sizes and reading time estimates.

### **⚡ Performance & SEO**
- **ISR Data Fetching**: Pages auto-update without rebuilding (60s revalidation).
- **Image Optimization**: Automatic WebP/AVIF conversion and lazy loading.
- **SEO Excellence**: Dynamic meta tags, Open Graph cards, and JSON-LD structured data.
- **Offline Capable**: PWA-ready structure.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/) + [fast-check](https://fast-check.dev/) (Property-based testing)
- **Icons**: [Heroicons](https://heroicons.com/)
- **State Management**: React Hooks + Context API

---

## 📦 Installation

Get the project running locally in minutes:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/news-portal.git
    cd news-portal
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy `.env.local.example` to `.env.local`:
    ```bash
    cp .env.local.example .env.local
    ```
    *(Optional: Add your `NEXT_PUBLIC_NEWS_API_KEY` if you have one)*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Visit [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```bash
src/
├── app/                    # Next.js App Router
│   ├── article/[id]/       # Dynamic Article Pages
│   ├── category/[slug]/    # Dynamic Category Pages
│   ├── newsletter/         # E-Paper Page
│   ├── profile/            # User Dashboard
│   ├── saved/              # Saved Articles
│   ├── search/             # Search Results
│   └── layout.tsx          # Root Layout (Header/Footer)
├── components/             # Reusable UI Components
│   ├── Header.tsx          # Main Navigation
│   ├── SideMenu.tsx        # Mobile/Tablet Sidebar
│   ├── ArticleCard.tsx     # Article Preview
│   ├── VideoPlayer.tsx     # YouTube Search Embed
│   └── ...
├── lib/                    # Utilities & Config
├── services/               # API Integration
└── types/                  # TypeScript Definitions
```

---

## 🧪 Testing

We use **Vitest** for unit testing and **fast-check** for property-based testing to ensure robustness.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Built with ❤️ by the News Portal Team**
