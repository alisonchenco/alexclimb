# Same Time. Different Climb.

A single-page, scroll-driven narrative experience inspired by Alex Honnold's 1 hour and 31 minute ascent of Taipei 101 on January 25, 2026.

This is not a productivity app. It's a time-based reflection on commitment, effort, and focus.

## The Experience

1. **Scroll through the narrative** — context about the climb, the thesis, and a moment of reflection
2. **Commit to your mission** — declare what you'll achieve in 1 hour and 31 minutes
3. **The climb begins** — scroll locks, time takes over, the building ascends with your progress
4. **Finish** — after 91 minutes, see your reflection

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: 
  - [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) — timer and factual elements
  - [Fraunces](https://fonts.google.com/specimen/Fraunces) — editorial serif (fallback for Canela)
- **Deployment**: Vercel

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the experience.

## Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/alexclimb)

### Option 2: CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 3: Git Integration

1. Push this repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Vercel will auto-detect Next.js and configure the build

## Project Structure

```
alexclimb/
├── app/
│   ├── layout.tsx      # Root layout with fonts
│   ├── page.tsx        # Main page with state management
│   └── globals.css     # Global styles and CSS variables
├── components/
│   ├── NarrativeSections.tsx  # Scroll narrative + mission form
│   ├── TimerView.tsx          # 91-minute countdown display
│   └── Taipei101.tsx          # Animated building SVG
└── public/
```

## Accessibility

- Respects `prefers-reduced-motion` — disables animations
- Semantic HTML with proper ARIA labels
- Sufficient color contrast for readability
- Mobile responsive design

## Design Notes

- **Off-white background** (#FAF9F6) — subtle warmth
- **Single accent color** (warm brown) — used sparingly
- **Building as progress** — no visible progress bars
- **Gallery/installation aesthetic** — timer offset, minimal UI

---

*Inspired by the commitment it takes to climb 101 floors without ropes.*
