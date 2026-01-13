# Media Assets Reference

This document lists all media assets used in the Premium Invitation module, their locations, formats, and how to replace them.

---

## Asset Inventory

### Background Music 🎵

**File:** `All_You_Need_Is_Love-104256-mobiles24.mp3`  
**Location:** `public/audio/All_You_Need_Is_Love-104256-mobiles24.mp3`  
**URL Pattern:** `/audio/All_You_Need_Is_Love-104256-mobiles24.mp3`  
**Format:** MP3  
**Size:** ~206 KB  
**Usage:** Background music that plays throughout the invitation (after user interaction)

**How to Replace:**
1. Add your MP3 file to `public/audio/`
2. In Admin Panel → Media → Enable Music → Enter filename: `/audio/your-song.mp3`
3. Or update `src/premium-invitation/config/defaultConfig.ts`:
   ```ts
   music: {
     enabled: true,
     url: "/audio/your-song.mp3",
     volume: 0.5
   }
   ```

**Recommendations:**
- Format: MP3 (best browser support)
- Bitrate: 128-192 kbps (balance quality/size)
- Duration: 2-4 minutes (loops automatically)
- Volume: Mix at moderate level (adjustable in admin)

---

### Opening Video 🎥

**File:** `weddinenv.mp4`  
**Location:** `public/premium/intro/weddinenv.mp4`  
**URL Pattern:** `/premium/intro/weddinenv.mp4`  
**Format:** MP4 (H.264 codec)  
**Size:** ~8.1 MB  
**Usage:** Displays as background in the opening overlay ("Click to Open" screen)

**How to Replace:**
1. Add your MP4 file to `public/premium/intro/`
2. In Admin Panel → Media → Select "Video" → Enter path: `/premium/intro/your-video.mp4`
3. Or update `src/premium-invitation/config/defaultConfig.ts`:
   ```ts
   intro: {
     type: "video",
     video: {
       enabled: true,
       url: "/premium/intro/your-video.mp4",
       startTimeSec: 0
     }
   }
   ```

**Recommendations:**
- Format: MP4 with H.264 codec (best compatibility)
- Resolution: 1080p or 720p (mobile-optimized)
- Duration: 5-15 seconds (short and impactful)
- File size: Under 10 MB for fast loading
- Aspect ratio: 16:9 or 9:16 (portrait works well for mobile)

---

### Floral Frame Animation 🌸

**File:** `event-side-decoration.json`  
**Location:** `public/premium/lottie/event-side-decoration.json`  
**URL Pattern:** `/premium/lottie/event-side-decoration.json`  
**Format:** Lottie JSON  
**Size:** ~132 KB  
**Usage:** Decorative floral border that frames the Event Details card

**How to Replace:**
1. Export your animation from After Effects using Bodymovin/Lottie plugin
2. Save JSON file to `public/premium/lottie/`
3. Update `src/premium-invitation/components/EventDetailsCard.tsx`:
   ```tsx
   <LottiePlayer
     src="/premium/lottie/your-animation.json"
     // ...
   />
   ```

**Recommendations:**
- Export from After Effects with Bodymovin extension
- Keep animations simple (fewer layers = smaller file size)
- Test on mobile devices (performance matters)
- Use loops for continuous decorations
- File size: Aim for under 200 KB

**Alternative - Video Instead of Lottie:**
If you prefer MP4 for the frame, replace the `<LottiePlayer>` component with a `<video>` tag.

---

### Header Background GIF ✨

**File:** `header-bg.gif`  
**Location:** `public/header-bg.gif`  
**URL Pattern:** `/header-bg.gif`  
**Format:** Animated GIF  
**Size:** ~3.5 MB  
**Usage:** Background animation in the admin builder header

**How to Replace:**
1. Add your GIF to `public/`
2. Update reference in `src/pages/admin/premium-invitation.tsx` if filename changes

**Recommendations:**
- Resolution: 800x600 or similar (doesn't need to be huge)
- Frame rate: 15-24 fps
- File size: Under 5 MB
- Subtle animations work best (not too distracting)

---

## Asset URL Patterns

All assets use **relative URLs** starting from the `public/` directory:

| Asset Type | Public Path | URL in Code |
|------------|-------------|-------------|
| Music | `public/audio/song.mp3` | `/audio/song.mp3` |
| Video | `public/premium/intro/video.mp4` | `/premium/intro/video.mp4` |
| Lottie | `public/premium/lottie/anim.json` | `/premium/lottie/anim.json` |
| Images | `public/image.gif` | `/image.gif` |

**Important:** Never use absolute Windows/Mac paths like `C:\Users\...` or `/Users/...` in the code. Always use relative URLs starting with `/`.

---

## Adding New Assets

### Step 1: Place File in Public Directory

```
public/
  ├── audio/           ← Music files
  ├── premium/
  │   ├── intro/       ← Opening videos
  │   └── lottie/      ← Lottie animations
  └── [images here]    ← Other images/GIFs
```

### Step 2: Reference in Config or Component

**For Config-based assets** (Music, Opening Video):
Edit `src/premium-invitation/config/defaultConfig.ts` or use the Admin Panel.

**For Component-embedded assets** (Lottie decorations):
Update the JSX in the component file (e.g., `EventDetailsCard.tsx`, `IntroOverlay.tsx`).

### Step 3: Test in Browser

1. Start dev server: `npm run dev`
2. Open invitation: `http://localhost:5173/invite/premium`
3. Check browser console (F12) for 404 errors
4. Verify asset loads and displays correctly

---

## Asset Optimization Tips

### For Music Files
- Use online tools to compress MP3 (e.g., mp3smaller.com)
- Lower bitrate to 128 kbps if file size is too large
- Trim silence at start/end

### For Video Files
- Use HandBrake or FFmpeg to compress
- Target bitrate: 2-4 Mbps for web delivery
- Convert to H.264 codec if using other formats

### For Lottie Animations
- Simplify vector shapes in After Effects
- Reduce number of keyframes
- Use Lottie's "Export as JSON" with compression enabled

### For GIF Files
- Use tools like ezgif.com to optimize
- Reduce colors (256 → 128 or less)
- Lower frame rate if possible
- Resize to needed dimensions only

---

## File Size Guidelines

| Asset Type | Recommended Max Size | Critical Max Size |
|------------|----------------------|-------------------|
| MP3 Music | 3 MB | 5 MB |
| MP4 Video (intro) | 10 MB | 20 MB |
| Lottie JSON | 200 KB | 500 KB |
| GIF Animation | 5 MB | 10 MB |

**Why this matters:**
- Faster page load times (especially on mobile)
- Better user experience
- Lower bandwidth costs

---

## Browser Compatibility

### Music (MP3)
- ✅ Chrome, Firefox, Safari, Edge
- ⚠️ Auto-play blocked - requires user interaction (built into design)

### Video (MP4 H.264)
- ✅ All modern browsers
- ⚠️ iOS requires specific encoding (use `-pix_fmt yuv420p` in FFmpeg)

### Lottie (JSON)
- ✅ Rendered via `lottie-web` library
- ✅ All browsers with JavaScript enabled
- ⚠️ Complex animations may lag on older mobile devices

---

## Need Help?

- **Finding free music:** Check YouTube Audio Library, Epidemic Sound, Artlist
- **Creating Lottie animations:** Use LottieFiles.com or Adobe After Effects + Bodymovin
- **Compressing videos:** Use HandBrake (free, open-source)
- **Optimizing GIFs:** Use ezgif.com or Photoshop

---

*Assets guide last updated: 2026-01-13*
