# EnglishQuest: English Learning App

A gamified English learning application built with React, Vite, and TailwindCSS.

## Features

- **Word Rain**: Fast-paced typing game to practice vocabulary.
- **Flash Cards**: Spaced repetition system for memorizing words.
- **Sentence Scramble**: Practice sentence structure and grammar.
- **Speech Lab**: Improve pronunciation with speech recognition.
- **Daily Drill**: Mixed practice challenges for daily engagement.
- **Dialogue Practice**: Realistic conversation scenarios.
- **Shop & Inventory**: Earn coins and buy power-ups.
- **Progress Tracking**: Level system, streaks, and achievements.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: TailwindCSS + Vanilla CSS for custom animations
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```

## Deployment

### Vercel
1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Vercel will detect Vite and configure settings automatically:
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `dist`
4.  The `vercel.json` file handles SPA routing (reloads on subpages).

### Render
1.  Create a new **Static Site** on Render.
2.  Connect your GitHub repository.
3.  Use the following settings:
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist`
4.  Add a **Rewrite Rule** in the Render Dashboard -> Redirects/Rewrites:
    -   **Source:** `/*`
    -   **Destination:** `/index.html`
    -   **Action:** Rewrite
