# Integration Guide - Premium Invitation Module

This guide provides detailed instructions for integrating the Premium Invitation module into your main WhatsApp/RSVP project.

## Overview

The Premium Invitation is a **self-contained React module** that provides:
- 🎨 Customizable premium wedding invitation with animations
- 🛠️ Live admin builder for real-time customization
- 📱 Mobile-optimized responsive design
- 🎵 Background music, video/animation intros, and Lottie decorations
- 📝 RSVP form integration (adaptable to your backend)

---

## Integration Method 1: Copy Module (Recommended)

This method copies the entire module into your existing React project.

### Step 1: Copy Files and Directories

Copy the following from this repository to your main project:

#### Configuration & Core Logic
```
src/premium-invitation/          → yourproject/src/premium-invitation/
  ├── components/                  (all UI components)
  ├── config/                      (default config + types)
  └── utils/                       (helper functions)
```

#### Pages/Routes
```
src/pages/PremiumInvitation.tsx               → yourproject/src/pages/PremiumInvitation.tsx
src/pages/admin/premium-invitation.tsx        → yourproject/src/pages/admin/premium-invitation.tsx
src/pages/admin/premium-invitation-preview.tsx → yourproject/src/pages/admin/premium-invitation-preview.tsx
```

#### Media Assets (Critical!)
```
public/audio/                     → yourproject/public/audio/
public/premium/                   → yourproject/public/premium/
  ├── intro/weddinenv.mp4           (opening video)
  └── lottie/event-side-decoration.json (floral frame animation)
public/header-bg.gif              → yourproject/public/header-bg.gif
```

### Step 2: Install Dependencies

Ensure your main project has these npm packages:

```bash
npm install lottie-web
```

**Already included in standard React/Vite projects:**
- `react`
- `react-dom`
- `react-router-dom` (if using client-side routing)
- `tailwindcss` (critical for styling)

### Step 3: Configure Routes

Add these routes to your router configuration:

```tsx
// Example with React Router v6
import PremiumInvitation from './pages/PremiumInvitation';
import PremiumInvitationBuilder from './pages/admin/premium-invitation';
import PremiumInvitationPreview from './pages/admin/premium-invitation-preview';

const routes = [
  {
    path: '/invite/premium',
    element: <PremiumInvitation />
  },
  {
    path: '/admin/premium-invitation',
    element: <PremiumInvitationBuilder />
  },
  {
    path: '/admin/premium-invitation-preview',
    element: <PremiumInvitationPreview />
  }
];
```

### Step 4: Verify TypeScript Configuration

Ensure your `tsconfig.json` includes path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

If using **Vite**, also update `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Step 5: Tailwind CSS Configuration

The Premium Invitation uses **Tailwind CSS** extensively. Ensure your `tailwind.config.js` scans the new files:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/premium-invitation/**/*.{js,ts,jsx,tsx}"  // Add this line
  ],
  theme: {
    extend: {
      // Your custom theme
    }
  },
  plugins: []
};
```

### Step 6: Test the Integration

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Test routes:**
   - Guest invitation: `http://localhost:5173/invite/premium`
   - Admin builder: `http://localhost:5173/admin/premium-invitation`
   - Preview (iframe): `http://localhost:5173/admin/premium-invitation-preview`

3. **Check browser console** for:
   - Missing asset errors (404s)
   - TypeScript errors
   - Lottie animation loading issues

4. **Verify media loads:**
   - Background music plays after user interaction
   - Opening video/animation displays
   - Floral decorations appear on Event Details card

---

## Integration Method 2: Git Submodule (Advanced)

For teams that want to maintain this module as a separate repository and pull updates.

### Add as Submodule

```bash
cd /path/to/your/main/project
git submodule add https://github.com/yeuda1960/rsvp.git modules/premium-invitation
git submodule update --init --recursive
```

### Link Files

Create symlinks or copy files from `modules/premium-invitation/` to your main project structure as needed.

### Update Submodule

To pull latest changes from this repository:

```bash
git submodule update --remote modules/premium-invitation
```

---

## Integration Method 3: Build Output Embed (Static)

If you want to deploy the invitation as a standalone static site and embed via iframe:

### Build Static Output

```bash
npm run build
```

This creates a `dist/` folder with all compiled assets.

### Deploy Separately

Upload `dist/` to a hosting service (Vercel, Netlify, Firebase Hosting).

### Embed in Main App

```html
<iframe 
  src="https://your-premium-invitation.vercel.app/invite/premium" 
  width="100%" 
  height="800px"
  frameborder="0"
></iframe>
```

---

## WhatsApp Integration Hooks (Placeholder)

This section is prepared for integrating RSVP data with your WhatsApp messaging system.

### Generating Invite Links

From your main application, generate personalized invite links for guests:

```ts
// Example: Generate invite link with event ID
const inviteLink = `https://yourdomain.com/invite/premium?eventId=${eventId}&guestId=${guestId}`;

// Send via WhatsApp API
sendWhatsAppMessage(phoneNumber, `You're invited! ${inviteLink}`);
```

### Capturing RSVP Data

The RSVP form in `RSVPStepperWrapper.tsx` currently saves to `localStorage`. To integrate with your backend:

1. **Modify `RSVPStepperWrapper.tsx`** to send data to your API:

```tsx
const handleSubmit = async (formData) => {
  // Your API call
  await fetch('https://your-api.com/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventId: params.eventId,
      guestId: params.guestId,
      attending: formData.attending,
      numGuests: formData.numGuests,
      // ... other fields
    })
  });
};
```

2. **Backend webhook** (optional): Configure your API to trigger WhatsApp confirmations when RSVP is submitted.

---

## Integration Checklist

Use this checklist to verify successful integration:

### Files Copied
- [ ] `src/premium-invitation/` directory
- [ ] `src/pages/PremiumInvitation.tsx`
- [ ] `src/pages/admin/premium-invitation.tsx`
- [ ] `src/pages/admin/premium-invitation-preview.tsx`
- [ ] `public/audio/` directory with music files
- [ ] `public/premium/` directory with videos and animations
- [ ] `public/header-bg.gif`

### Configuration
- [ ] Routes configured in router
- [ ] `tsconfig.json` paths alias set to `@/*`
- [ ] `vite.config.ts` alias configured (if using Vite)
- [ ] `tailwind.config.js` content paths include `premium-invitation/`

### Dependencies
- [ ] `lottie-web` installed
- [ ] `react-router-dom` installed (if not already)
- [ ] Tailwind CSS configured and working

### Testing
- [ ] Dev server starts without errors
- [ ] `/invite/premium` loads successfully
- [ ] `/admin/premium-invitation` loads successfully
- [ ] Background music plays (after user interaction)
- [ ] Opening video/animation displays
- [ ] Floral decorations visible on Event Details card
- [ ] RSVP form submits (check console/localStorage)
- [ ] No 404 errors in browser console for media assets

### Production Build
- [ ] `npm run build` completes without errors
- [ ] Built `dist/` serves correctly in production environment

---

## Troubleshooting

### Music Not Playing
**Issue:** Background music doesn't auto-play.  
**Solution:** Browsers block auto-play. Music will start after user clicks "Open Invitation" button.

### Video Not Loading
**Issue:** Opening video shows blank screen.  
**Solution:** 
1. Check file exists at `public/premium/intro/weddinenv.mp4`
2. Verify file format is supported (MP4 with H.264 codec)
3. Check browser console for 404 errors

### Lottie Animation Not Displaying
**Issue:** Floral decorations don't appear.  
**Solution:**
1. Verify `lottie-web` is installed: `npm install lottie-web`
2. Check file exists at `public/premium/lottie/event-side-decoration.json`
3. Check browser console for errors

### Tailwind Styles Not Applying
**Issue:** Page has no styling or looks broken.  
**Solution:**
1. Verify Tailwind CSS is configured in your main project
2. Ensure `tailwind.config.js` content paths include the premium-invitation files
3. Rebuild CSS: `npm run dev` (should recompile)

### TypeScript Errors
**Issue:** Import errors or "Cannot find module '@/...'"  
**Solution:**
1. Check `tsconfig.json` has correct `baseUrl` and `paths`
2. Restart TypeScript server in your IDE
3. Verify `vite.config.ts` has matching alias configuration

---

## Need Help?

For questions or issues:
1. Check the [ASSETS.md](./ASSETS.md) guide for media file requirements
2. Review the main [README.md](../README.md) for project overview
3. Open an issue on the GitHub repository

---

*Integration guide last updated: 2026-01-13*
