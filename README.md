# Wedding Invitation Project

## 🎵 Audio Setup (IMPORTANT)

To enable background music for the Premium Invitation:

1.  **Create folder**: Ensure `public/audio` exists in the project root.
2.  **Add File**: Copy your MP3 file to `public/audio/I_Like_Big_Butts-352840-mobiles24.mp3`.
    *   *Note: This file is not in source control to save space/bandwidth. You must add it manually locally.*
3.  **Verify**:
    *   Run `npm run dev`.
    *   Visit `http://localhost:5173/audio/I_Like_Big_Butts-352840-mobiles24.mp3` to confirm the browser can load it.
    *   Open the Premium Invitation page (`/invite/premium`).
    *   Tap "Tech Check" or "Open" to start the experience -> Music should play.

## Project Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run development server:
    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```

## Features

- **Premium Invitation**: `/invite/premium`
- **Admin Designer**: `/admin/premium-invitation`
- **Mobile Preview**: `/admin/premium-invitation-preview`
