# 💍 CopyLove - Premium Wedding Invitation Platform

Welcome to the **CopyLove RSVP** project! This is a modern, high-end digital wedding invitation platform built with **React, TypeScript, and Tailwind CSS**. It features a stunning "Premium" invitation experience with animations, music, video backgrounds, and a powerful **Admin Panel** for live customization.

## 🚀 Getting Started

Follow these steps to set up the project locally on your computer.

### Prerequisites
*   **Node.js**: Make sure you have Node.js installed (v16 or higher).
*   **Git**: To clone the repository.

### 1. Installation
Open your terminal (Command Prompt / PowerShell) in the project folder and run:

```bash
npm install
```
This downloads all the necessary libraries.

### 2. Run the Development Server
To start the project locally, run:

```bash
npm run dev
```
The console will show specific URLs (usually `http://localhost:5173`). Open this link in your browser.

---

## 📂 Project Structure & Key Files

Here is a guide to help you understand where everything is located:

### 1. `public/` (Media & Assets)
This folder holds static files that are accessible directly via the browser.
*   **`public/audio/`**: Place your background music files here (MP3).
    *   *Default file:* `All_You_Need_Is_Love-104256-mobiles24.mp3`
*   **`public/premium/intro/`**: Place your background video files here (MP4).
*   **`public/premium/lottie/`**: Animation files (JSON) for decorations.

### 2. `src/pages/` (Routes)
*   **`/invite/premium`**: The main invitation page guests will see.
*   **`/admin/premium-invitation`**: The **Admin Editor**. Here you change text, colors, fonts, and media live.
*   **`/admin/premium-invitation-preview`**: A mobile-only view used inside the Admin Editor to show you live changes.

### 3. `src/premium-invitation/` (Core Logic)
This is the heart of the premium module.
*   **`config/defaultConfig.ts`**: Contains the **default settings** (texts, colors, etc.) that load if no changes are saved.
*   **`config/types.ts`**: Defines the structure of the data (TypeScript interfaces).
*   **`components/`**: The visual building blocks:
    *   `PremiumInvitationPage.tsx`: The main container.
    *   `IntroOverlay.tsx`: The opening screen (Video/Animation + "Click to Open").
    *   `EventDetailsCard.tsx`: The card showing time, location, and waze links.
    *   `RSVPStepperWrapper.tsx`: The form for guests to confirm attendance.

---

## 🛠️ How to Customize

### Using the Admin Panel
1.  Go to `http://localhost:5173/admin/premium-invitation`
2.  Use the sidebar to edit:
    *   **Couple Names & Texts**
    *   **Event Details** (Date, Location, Waze Link)
    *   **Style** (Fonts, Colors, Button styles)
    *   **Media** (Background Music, Opening Video, GIF)
3.  Click **"Publish"** to save changes.

### Adding Custom Music 🎵
1.  Put your MP3 file in `public/audio/`.
2.  In the Admin Panel -> Media section -> Enable Music -> Enter the filename (e.g., `mysong.mp3` or path `/audio/mysong.mp3`).

### Adding Custom Video 🎥
1.  Put your MP4 file in `public/premium/intro/`.
2.  In the Admin Panel -> Media section -> Select "Video" -> Enter the path (e.g., `/premium/intro/myvideo.mp4`).

---

## 📦 Building for Production

When you are ready to deploy the site to the internet:

```bash
npm run build
```
This creates a `dist` folder with optimized files ready for hosting (e.g., on Vercel, Netlify, or Firebase).

---

## 💡 Troubleshooting

*   **Music not playing?** Browsers block auto-play. The user effectively must interact (click "Open Invitation") for music to start. This is normal behavior.
*   **Changes not showing?** Make sure you clicked "Save Draft" or "Publish" in the Admin Panel.
*   **White screen?** Check the console (F12) for errors. Often it's a missing file path.

---
*Created with ❤️ by CopyLove Team*
