# UI REIMAGINATION GUIDE — ORACLE ARENA

## Overview

This document provides detailed specifications for reimagining the Oracle Arena frontend UI with the new manga-cyberpunk brand identity. Each screen has been redesigned to incorporate the visual language from the Brand Playbook while maintaining full functionality.

---

## SCREEN 1: Betting Arena (Dashboard)

### Current State
- Dark theme with gold/yellow CTAs
- Stats cards showing Balance, Wagered, Won, Pending
- Filter tabs: All, Open, My Bets, Resolved
- Prediction market cards with YES/NO odds

### Reimagined Design

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Oracle Arena    Browse Topics | Betting Arena  [Agents]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  BETTING ARENA                    [Stats Toggle]  │   │
│   │  Watch the debate. Place your bet. Win credits.   │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│   │ Balance  │ │ Wagered  │ │   Won    │ │ Pending  │      │
│   │   975    │ │    25    │ │    0     │ │   87.5   │      │
│   │ [Cyan]   │ │ [Magenta]│ │ [Gold]   │ │ [Gold]   │      │
│   └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│   [All]  [Open]  [My Bets]  [Resolved]                     │
│   ────────                                                    │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ [CRYPTO]  Will BTC exceed $100K by June 30, 2026? │   │
│   │                                                     │   │
│   │  YES 2.45                    NO 1.63              │   │
│   │  [Green Orb]                 [Red Orb]            │   │
│   │                                                     │   │
│   │  Status: OPEN  •  Closes in 3 days  •  [Judge 72%]│   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Visual Specifications

**Header**
- Background: Oracle Purple (#1A0F2E) with subtle gradient
- Logo: 40px circular mark, left-aligned
- Navigation: White text, cyan on hover
- Agent icons: 32px circles in top-right (Proponent/Opponent/Judge)

**Hero Section**
- "BETTING ARENA" in Satoshi Bold, 32px, white
- Tagline in 16px, Marble White at 80% opacity
- Optional particle animation in background

**Stats Cards**
- Background: Obsidian (#0D0D0D) with 1px cyan border at 20%
- Border-radius: 12px
- Label: 12px uppercase, tracking wide
- Value: 24px bold, color-coded by type
- Hover: Border glows to 50% opacity

**Filter Tabs**
- Active: Cyan underline (2px), white text
- Inactive: 60% opacity white text
- Transition: 200ms ease

**Prediction Cards**
- Background: Gradient from Purple to Obsidian
- Border: 1px cyan at 20%, glows on hover
- Category pill: Purple background, white text, 8px radius
- YES/NO orbs: 48px circles with color-coded glows
- Odds: 18px bold below orbs

#### Interactions
- Card hover: Lift 2px, border glow intensifies
- Orb hover: Scale 1.1, glow pulse
- Filter change: Slide underline animation

---

## SCREEN 2: Homepage / Browse Topics

### Current State
- Grid of topic cards
- Categories: Crypto, Geopolitics, Sports
- "Start debate" CTAs

### Reimagined Design

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  Oracle Arena    Browse Topics | Betting Arena  [User]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │        WHERE AI AGENTS DEBATE YOUR PREDICTIONS      │   │
│   │                                                     │   │
│   │   Three agents argue. A judge scores. You decide.   │   │
│   │                                                     │   │
│   │              [Enter the Arena] [Learn More]           │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   FEATURED DEBATES                                          │
│   ───────────────                                           │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │   [CRYPTO]  │  │ [GEOPOLITICS]│  │   [CRYPTO]  │       │
│   │             │  │              │  │             │       │
│   │  Will BTC   │  │  Will Fed    │  │  Will ETH   │       │
│   │  hit $100K? │  │  cut rates?  │  │  ETF pass?  │       │
│   │             │  │              │  │             │       │
│   │  [Lightning]│  │  [Lightning] │  │  [Lightning]│       │
│   │  Start Now  │  │  Start Now   │  │  Start Now  │       │
│   └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Visual Specifications

**Hero Section**
- Full-width with subtle animated background
- Headline: 48-64px Satoshi Bold, white with cyan text-shadow
- Subhead: 18px, 80% opacity
- CTAs: Primary (Gold) + Secondary (Cyan ghost)

**Topic Cards**
- Fixed aspect ratio (4:3)
- Background: Category image with dark gradient overlay
- Border: 1px cyan at 0%, appears on hover
- Category pill: Top-left, purple background
- Title: 20px bold, white, bottom-aligned
- "Start Now" indicator: Lightning bolt icon + text

**Grid Behavior**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column, horizontal scroll optional

---

## SCREEN 3: Bet Placement Success

### Current State
- Modal with success message
- Bet details and confirmation

### Reimagined Design

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  ✓                                                  │   │
│   │                                                     │   │
│   │                    BET PLACED!                      │   │
│   │                                                     │   │
│   │              Your wager is recorded                 │   │
│   │                                                     │   │
│   │  ┌─────────────────────────────────────────────┐    │   │
│   │  │  Topic: BTC $100K by June 2026             │    │   │
│   │  │  Position: NO                              │    │   │
│   │  │  Amount: 25 credits                          │    │   │
│   │  │  Potential Payout: 87.5 credits            │    │   │
│   │  └─────────────────────────────────────────────┘    │   │
│   │                                                     │   │
│   │              [View Debate] [Place Another]          │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Visual Specifications

**Modal Container**
- Background: Purple with 95% opacity
- Border: 2px gold gradient
- Border-radius: 20px
- Box-shadow: Large gold glow
- Backdrop: Blur 10px

**Success Icon**
- Animated checkmark in circle
- Gold color with pulse animation
- Scale up on entrance

**Typography**
- "BET PLACED!": 28px bold, gold gradient text
- Details: 14px, marble white

**Confetti Effect**
- Gold coins and cyan sparks
- Falls from top, fades out
- Duration: 1.5s

---

## SCREEN 4: Active Betting Interface

### Current State
- YES/NO selection
- Bet amount input
- Quick bet buttons
- Potential payout display

### Reimagined Design

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Will BTC exceed $100K by June 30, 2026?                   │
│   [Crypto] [Open] [Judge Confidence: 72% → NO]            │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │     ┌─────────────┐         ┌─────────────┐        │   │
│   │     │             │         │             │        │   │
│   │     │    YES      │         │     NO      │        │   │
│   │     │   [Green    │         │   [Red      │        │   │
│   │     │    Orb]     │         │    Orb]     │        │   │
│   │     │             │         │             │        │   │
│   │     │    1.36     │         │    3.50     │        │   │
│   │     │   [Cyan]    │         │  [Magenta]  │        │   │
│   │     └─────────────┘         └─────────────┘        │   │
│   │                                                     │   │
│   │   Bet Amount: [    25    ] [MAX]                   │   │
│   │                                                     │   │
│   │   Quick: [10] [25] [50] [100]                      │   │
│   │                                                     │   │
│   │   Potential Payout: 87.5 credits                   │   │
│   │                                                     │   │
│   │   ┌─────────────────────────────────────────────┐  │   │
│   │   │         BET 25 ON NO                        │  │   │
│   │   │         [Gold Gradient Button]              │  │   │
│   │   └─────────────────────────────────────────────┘  │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Visual Specifications

**Selection Cards**
- Size: 140px x 180px
- Border-radius: 16px
- Unselected: 60% opacity, subtle border
- Selected: Full opacity, 2px colored border, glow effect
- Orb: 64px circle with inner gradient
- Odds: Large number below

**Amount Input**
- Background: Obsidian with cyan border
- Text: White, right-aligned
- MAX button: Cyan text, no background

**Quick Bet Buttons**
- Size: 48px x 40px
- Border: 1px cyan at 30%
- Selected: Filled cyan, dark text

**CTA Button**
- Full width of container
- Gold gradient background
- Black text, bold
- Hover: Lift + intensified glow

---

## SCREEN 5: Debate Results / Verdict

### Current State
- Verdict display
- Agent scores
- Judge reasoning

### Reimagined Design

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │                    VERDICT                          │   │
│   │                                                     │   │
│   │                      NO                             │   │
│   │                  [72% Confident]                    │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌─────────────────┐  VS  ┌─────────────────┐             │
│   │   PROPONENT     │      │    OPPONENT     │             │
│   │   [Cyan Avatar] │      │ [Magenta Avatar]│             │
│   │                 │      │                 │             │
│   │  Logic:    6/10 │      │  Logic:    8/10 │             │
│   │  [██████░░░░]   │      │  [████████░░]   │             │
│   │                 │      │                 │             │
│   │  Evidence: 5/10 │      │  Evidence: 8/10│             │
│   │  [█████░░░░░]   │      │  [████████░░]   │             │
│   │                 │      │                 │             │
│   │  Persuasion:6/10│      │  Persuasion:7/10│             │
│   │  [██████░░░░]   │      │  [███████░░░]   │             │
│   └─────────────────┘      └─────────────────┘             │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  JUDGE'S REASONING                                  │   │
│   │  ─────────────────                                  │   │
│   │                                                     │   │
│   │  The Opponent demonstrated stronger evidence...     │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Visual Specifications

**Verdict Header**
- Background: Gradient purple to obsidian
- "VERDICT": 14px uppercase, tracking wide
- Result: 48px bold, white with colored shadow (cyan or magenta)
- Confidence: 18px, colored by result

**VS Layout**
- Center "VS" in stylized typography
- Agent cards side by side on desktop, stacked on mobile
- Avatar: 64px with colored glow ring

**Score Bars**
- Height: 8px
- Background: Obsidian
- Fill: Agent color (cyan or magenta)
- Animated fill on scroll into view

**Reasoning Section**
- Card with subtle border
- Marble white text on dark background
- Max 3 lines with "Read more" expand

---

## SCREEN 6: Debate In Progress (Loading)

### Current State
- Progress steps
- Loading indicator
- Agent status

### Reimagined Design

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Will AI cause net job losses in tech by 2027?             │
│   [AI] [In Progress]                                       │
│                                                             │
│   ○──────○──────○──────○──────●                             │
│   R      R1     R2     R3    Judge                          │
│                              [Active]                       │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │              [Scales Icon Animated]                 │   │
│   │                                                     │   │
│   │           Judge is evaluating...                    │   │
│   │                                                     │   │
│   │   Analyzing arguments, evidence quality,            │   │
│   │   and persuasive impact                             │   │
│   │                                                     │   │
│   │   [Cyan particles floating upward]                  │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   [🔊 Audio: ON]  [⏹️ Skip to Verdict]                     │
│                                                             │
│   Agents: [P] [O] [R] [J]                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Visual Specifications

**Progress Timeline**
- Nodes: 32px circles
- Completed: Filled with checkmark, cyan
- Active: Pulsing ring, larger (40px)
- Future: Outline only, 30% opacity
- Connecting lines: Gradient showing progress

**Center Animation**
- Scales icon: Gentle oscillation (±5deg)
- Cyan particles: Float upward, fade out
- Subtle glow pulse on container

**Audio Toggle**
- Icon + text button
- Active: Cyan, Inactive: 50% opacity

**Agent Status Bar**
- Mini avatars (24px) showing all 4 agents
- Current speaker highlighted with glow
- Hover to see agent name

---

## COMPONENT SPECIFICATIONS

### Color Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        oracle: {
          purple: '#1A0F2E',
          cyan: '#00F0FF',
          gold: '#FFD700',
          magenta: '#FF006E',
          marble: '#F5F5F0',
          obsidian: '#0D0D0D',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.3)',
        'glow-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-magenta': '0 0 20px rgba(255, 0, 110, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  }
}
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps, icon padding |
| sm | 8px | Inline elements, small gaps |
| md | 16px | Standard spacing |
| lg | 24px | Section padding, card gaps |
| xl | 32px | Large sections |
| 2xl | 48px | Hero spacing |
| 3xl | 64px | Page margins |

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Buttons, inputs |
| md | 8px | Small cards, pills |
| lg | 12px | Medium cards |
| xl | 16px | Large cards, modals |
| 2xl | 20px | Featured cards |
| full | 9999px | Pills, avatars |

---

## ANIMATION IMPLEMENTATION

### CSS Variables for Timing

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-celebration: 800ms;
  
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-entrance: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Key Animation Classes

```css
/* Hover lift */
.hover-lift {
  transition: transform var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 240, 255, 0.2);
}

/* Glow pulse */
.glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 240, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 240, 255, 0.5); }
}

/* Shimmer text */
.shimmer {
  background: linear-gradient(
    90deg,
    #FFD700 0%,
    #FFF 50%,
    #FFD700 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s linear infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## RESPONSIVE ADAPTATIONS

### Mobile (< 640px)

**Layout Changes:**
- Navigation collapses to hamburger menu
- Stats cards stack 2x2 grid
- Prediction cards full width
- YES/NO selection side by side (smaller)
- Agent avatars in horizontal scroll

**Typography Scale:**
- Hero: 32px
- H1: 24px
- Body: 14px

### Tablet (640-1024px)

**Layout Changes:**
- Navigation visible, condensed
- Stats cards in row (scrollable)
- Prediction cards 2 columns
- Full YES/NO selection cards

### Desktop (> 1024px)

**Full Layout:**
- All navigation visible
- Stats cards 4 across
- Prediction cards 3 columns
- Sidebar optional for agent info

---

## ACCESSIBILITY CHECKLIST

- [ ] Color contrast ratios meet WCAG AA
- [ ] Focus states visible on all interactive elements
- [ ] Reduced motion preference respected
- [ ] Touch targets minimum 44px on mobile
- [ ] Screen reader labels on all icons
- [ ] Keyboard navigation fully functional
- [ ] Loading states announced to screen readers

---

## ASSETS NEEDED

### Icons (SVG)
- [ ] Logo mark (primary + simplified)
- [ ] Agent avatars (4 styles: Proponent, Opponent, Researcher, Judge)
- [ ] Category icons (Crypto, Politics, Sports, AI, etc.)
- [ ] UI icons (Check, Close, Arrow, Lightning, Scales, etc.)

### Illustrations
- [ ] Hero background (abstract arena/colosseum)
- [ ] Empty state illustration
- [ ] Error state illustration
- [ ] Success/confetti animation frames

### Audio
- [ ] Debate start sound
- [ ] Agent speak indicator
- [ ] Judge deliberation ambience
- [ ] Verdict reveal fanfare
- [ ] Win celebration sound

---

*Oracle Arena UI Reimagination Guide v1.0*
