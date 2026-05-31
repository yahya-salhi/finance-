# Finance Tracker

An AI-powered personal finance management application built with **React**, **TypeScript**, and **Supabase**.

## 🚀 Features

- **Dashboard:** Real-time overview of your financial health with interactive charts.
- **Income & Expense Tracking:** Categorize and monitor your cash flow.
- **Portfolio Management:** Track your stock positions and investments.
- **AI Financial Assistant:** Get personalized financial insights and advice powered by **Google Gemini**.
- **Cloud Sync:** Secure data persistence and multi-device synchronization via **Supabase**.
- **Social Authentication:** Secure login using GitHub or Google OAuth.
- **Local Data Migration:** Built-in utility to migrate legacy local storage (Dexie.js) to the cloud.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TypeScript.
- **Styling:** TailwindCSS, Lucide React.
- **State Management:** Zustand.
- **Backend/Auth:** Supabase (PostgreSQL, Auth, RLS).
- **AI Integration:** Google Generative AI (Gemini).
- **Charts:** Recharts.
- **Forms:** React Hook Form + Zod.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase project
- Google Gemini API Key (for the assistant)
- Alpha Vantage API Key (for stock prices)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd finance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🔒 Security

This application uses **Supabase Row Level Security (RLS)**. Every financial record is tied to a specific `user_id`, ensuring that your data is private and only accessible to you.

## 📄 License

MIT
