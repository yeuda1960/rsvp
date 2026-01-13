# 💍 CopyLove - Premium Wedding Invitation Platform

A modern, high-end digital wedding invitation platform with **live customization**, **animations**, **music**, and beautiful **mobile-responsive design**.

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.

---

## ✨ Features

- 🎨 **Premium Design** - Elegant invitation with floral Lottie animations
- 🛠️ **Live Admin Builder** - Real-time customization panel for text, colors, fonts, and media
- 📱 **Mobile Optimized** - Fully responsive design for all devices
- 🎵 **Background Music** - Auto-playing music after user interaction
- 🎥 **Video/Animation Intro** - Eye-catching opening overlay with video or Lottie animation
- 💐 **Decorative Elements** - Animated floral frame around event details
- 📝 **RSVP Form** - Guest confirmation with attendee count and dietary preferences
- 🔗 **Waze Integration** - Direct navigation link to venue

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yeuda1960/rsvp.git
   cd rsvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📍 Important Routes

| Route | Description |
|-------|-------------|
| `/invite/premium` | **Guest Invitation Page** - The main invitation experience guests will see |
| `/admin/premium-invitation` | **Admin Builder** - Live editor for customizing invitation content, style, and media |
| `/admin/premium-invitation-preview` | **Mobile Preview** - Embedded iframe view used in the admin panel |

---

## 📂 Project Structure

```
copylove/
├── public/                          # Static assets (directly accessible via URL)
│   ├── audio/                       # Background music files (MP3)
│   │   └── All_You_Need_Is_Love-104256-mobiles24.mp3
│   ├── premium/
│   │   ├── intro/                   # Opening video files (MP4)
│   │   │   └── weddinenv.mp4
│   │   └── lottie/                  # Lottie animation files (JSON)
│   │       └── event-side-decoration.json
│   └── header-bg.gif                # Admin header background
│
├── src/
│   ├── premium-invitation/          # Core invitation module
│   │   ├── components/              # UI components
│   │   │   ├── PremiumInvitationPage.tsx    # Main container
│   │   │   ├── IntroOverlay.tsx             # Opening screen ("Click to Open")
│   │   │   ├── EventDetailsCard.tsx         # Event info with floral frame
│   │   │   ├── RSVPStepperWrapper.tsx       # RSVP form
│   │   │   ├── LottiePlayer.tsx             # Lottie animation player
│   │   │   └── ...
│   │   ├── config/                  # Configuration and types
│   │   │   ├── defaultConfig.ts             # Default invitation settings
│   │   │   └── types.ts                     # TypeScript interfaces
│   │   └── utils/                   # Helper functions
│   │       └── audioManager.ts              # Background music control
│   │
│   ├── pages/                       # Route components
│   │   ├── PremiumInvitation.tsx            # Guest-facing page (/invite/premium)
│   │   └── admin/
│   │       ├── premium-invitation.tsx       # Admin builder (/admin/premium-invitation)
│   │       └── premium-invitation-preview.tsx # Preview iframe
│   │
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # Entry point
│
├── docs/                            # Documentation
│   ├── INTEGRATION.md               # Integration guide for main project
│   └── ASSETS.md                    # Media assets reference
│
├── README.md                        # This file
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

---

## 🛠️ Customization

### Using the Admin Panel (Recommended)

1. Navigate to `http://localhost:5173/admin/premium-invitation`
2. Use the sidebar sections:
   - **Content** - Edit couple names, event title, date/time, location
   - **Style** - Change fonts, colors, button radius, spacing
   - **Media** - Upload/configure music, video, and GIF
3. **Save Draft** to store changes locally
4. **Publish** to make changes live

### Adding Custom Music 🎵

1. Place your MP3 file in `public/audio/`
2. In Admin Panel → Media → Enable Music → Enter path:
   ```
   /audio/your-song.mp3
   ```

### Adding Custom Video 🎥

1. Place your MP4 file in `public/premium/intro/`
2. In Admin Panel → Media → Select "Video" → Enter path:
   ```
   /premium/intro/your-video.mp4
   ```

### Manual Configuration (Advanced)

Edit `src/premium-invitation/config/defaultConfig.ts` directly:

```ts
export const premiumInvitationDefaultConfig: PremiumInvitationConfig = {
  content: {
    coupleNames: {
      bride: "שירה",
      groom: "דוד"
    },
    eventDetails: {
      date: "17.03",
      dayOfWeek: "יום שלישי",
      time: "19:30",
      venue: "עדן על המים",
      location: "נרן אילנו",
      wazeLink: "https://waze.com/..."
    }
  },
  style: {
    fonts: {
      heading: "Playfair Display",
      body: "Heebo"
    },
    colors: {
      primary: "#2d2d2d",
      accent: "#d4af37"
    }
  },
  media: {
    music: {
      enabled: true,
      url: "/audio/All_You_Need_Is_Love-104256-mobiles24.mp3",
      volume: 0.5
    },
    intro: {
      type: "video",
      video: {
        enabled: true,
        url: "/premium/intro/weddinenv.mp4"
      }
    }
  }
  // ... more options
};
```

---

## 📦 Building for Production

### Build Static Files

```bash
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

### Deploy

Upload the `dist/` folder to any static hosting service:
- **Vercel** (recommended for Vite projects)
- **Netlify**
- **Firebase Hosting**
- **GitHub Pages**

---

## 🔗 Integration with Larger Projects

**Want to integrate this module into your main WhatsApp/RSVP project?**

See the comprehensive [Integration Guide](./docs/INTEGRATION.md) for:
- Step-by-step file copying instructions
- Route configuration
- Dependency setup
- WhatsApp integration hooks (placeholder)
- Troubleshooting tips

---

## 📚 Documentation

- **[INTEGRATION.md](./docs/INTEGRATION.md)** - How to integrate into larger projects
- **[ASSETS.md](./docs/ASSETS.md)** - Media asset reference and optimization guide

---

## 🐛 Troubleshooting

### Music Not Playing?
Browsers block auto-play. Users must click "Open Invitation" to start music. This is normal browser behavior.

### Changes Not Showing?
Make sure you clicked **"Save Draft"** or **"Publish"** in the Admin Panel. Data is stored in `localStorage`.

### White Screen or Errors?
1. Check browser console (F12) for error messages
2. Verify all media files exist in `public/` directory
3. Ensure paths are correct (no Windows paths like `C:\...`)

### Lottie Animations Not Loading?
1. Install dependency: `npm install lottie-web`
2. Check file exists: `public/premium/lottie/event-side-decoration.json`
3. Verify JSON is valid Lottie format

---

## 🧪 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lottie Web** - Animation player
- **React Router** (if using client-side routing)

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 💬 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check the [INTEGRATION.md](./docs/INTEGRATION.md) for common setup questions
- Review [ASSETS.md](./docs/ASSETS.md) for media-related guidance

---

*Built with ❤️ by the CopyLove Team*  
*Last updated: 2026-01-13*
