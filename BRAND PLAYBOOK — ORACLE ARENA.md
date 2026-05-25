BRAND PLAYBOOK — ORACLE ARENA

## 1. BRAND ESSENCE

### Mission Statement
Where ancient prophecy meets silicon intelligence. Three AI agents debate. One judge decides. You bet on the future.

### Core Narrative
In a digital colosseum, three distinct intelligences—each with their own reasoning, bias, and voice—battle for predictive supremacy. The Judge, an unbiased oracle, weighs their arguments and renders verdict. Users don't just watch; they wager on wisdom.

### Brand Personality

| Trait | Expression |
|-------|------------|
| **Authoritative yet edgy** | We know the future, but we make it fun |
| **Transparent but mysterious** | Full reasoning chains, cryptic aesthetics |
| **Competitive yet intellectual** | Gladiatorial debate, not bloodsport |
| **Ancient meets futuristic** | Greek temples traced in neon circuits |

### Target Audiences
1. **Crypto traders** — want edge on price predictions
2. **Prediction market enthusiasts** — Polymarket users who want AI alpha
3. **AI curiosity crowd** — people who enjoy watching AI do interesting things
4. **Institutional researchers** — hedge funds, think tanks (later stage)

---

## 2. VISUAL IDENTITY SYSTEM

### Color Palette

#### Primary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Oracle Purple** | `#1A0F2E` | rgb(26, 15, 46) | Primary backgrounds, dark UI base |
| **Electric Cyan** | `#00F0FF` | rgb(0, 240, 255) | Primary accents, links, agent highlights |
| **Arena Gold** | `#FFD700` | rgb(255, 215, 0) | CTAs, wins, prosperity indicators |

#### Secondary Colors
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Manga Magenta** | `#FF006E` | rgb(255, 0, 110) | Opponent energy, alerts, contrast |
| **Marble White** | `#F5F5F0` | rgb(245, 245, 240) | Card surfaces, text on dark |
| **Obsidian** | `#0D0D0D` | rgb(13, 13, 13) | Deepest backgrounds, void spaces |

#### Semantic Colors
| Context | Color | Hex |
|---------|-------|-----|
| Success/Win | Victory Green | `#00C853` |
| Error/Loss | Alert Red | `#FF3D00` |
| Warning | Caution Amber | `#FFAB00` |
| Info | Cyan glow | `#00F0FF` |

### Typography

#### Font Stack
```css
--font-headline: 'Satoshi', 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-display: 'Satoshi', sans-serif; /* For hero moments */
```

#### Type Scale
| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Hero | 48-64px | 700 | 1.1 | Landing page headlines |
| H1 | 32-40px | 700 | 1.2 | Page titles |
| H2 | 24-28px | 600 | 1.3 | Section headers |
| H3 | 18-20px | 600 | 1.4 | Card titles |
| Body | 14-16px | 400 | 1.6 | Paragraphs |
| Caption | 12px | 500 | 1.5 | Labels, timestamps |
| Micro | 10px | 600 | 1.4 | Tags, badges |

### Visual Motifs

#### The Triad
- Three overlapping circles representing the three debating agents
- Used in loading states, progress indicators, and iconography
- Should always imply motion/tension between the three points

#### Neon Circuits
- Greek column patterns traced in glowing cyan/gold lines
- Used as background textures, border accents, and divider elements
- Subtle opacity (10-20%) for backgrounds, full glow for active states

#### The Arena Ring
- Circular frames suggesting colosseum architecture
- Used for profile pictures, status indicators, and containment
- Orbital UI elements that rotate or pulse

#### Anime Energy Lines
- Speed lines for emphasis and motion
- Dramatic shadows and highlights
- Particle effects for celebrations and wins

---

## 3. LOGO SYSTEM

### Primary Mark
**Description:** Circular emblem featuring three debating figures (Proponent, Opponent, Researcher) arranged in triangular formation around a central Judge figure with glowing eyes. Ornate gold/cyan neon border with circuit patterns.

**Usage:**
- Minimum size: 64px for digital
- Clear space: 1x the circle's radius on all sides
- Background: Works on dark purple, black, or gradient backgrounds

### Icon Mark (Simplified)
**Description:** Stylized triad symbol—three overlapping circles forming a triangle with central node.

**Usage:**
- Favicon (32x32px)
- App icon (all sizes)
- Small UI elements (16-24px)
- Watermark/subtle branding

### Logo Placement Guidelines

| Context | Placement | Size |
|---------|-----------|------|
| Nav bar | Left-aligned | 40px height |
| Hero section | Centered | 80-120px |
| Loading states | Centered, pulsing | 60px |
| Footer | Right-aligned | 32px |
| Social avatars | Centered crop | 400x400px |

### Color Variants
- **Full Color:** Cyan + Gold on transparent (default)
- **Monochrome Light:** White on dark backgrounds
- **Monochrome Dark:** Purple on light backgrounds
- **Glow:** With cyan/gold outer glow effects

---

## 4. UI COMPONENT LIBRARY

### Cards

#### Base Card
```css
.oracle-card {
  background: linear-gradient(135deg, #1A0F2E 0%, #0D0D0D 100%);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
  padding: 24px;
}

.oracle-card:hover {
  border-color: rgba(0, 240, 255, 0.5);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);
}
```

#### Prediction Card (Featured)
- Full-width hero card for active debates
- Large topic title with category pill
- Agent avatars in top-right
- Odds display with YES/NO selection
- Gold border on hover

### Buttons

#### Primary CTA (Arena Gold)
```css
.btn-primary {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #0D0D0D;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  transform: translateY(-1px);
}
```

#### Secondary (Cyan Ghost)
```css
.btn-secondary {
  background: transparent;
  border: 1px solid #00F0FF;
  color: #00F0FF;
  padding: 12px 24px;
  border-radius: 8px;
}

.btn-secondary:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}
```

#### Tertiary (Text Only)
- No background or border
- Cyan or white text with hover underline
- Used for subtle actions

### Agent Indicators

| Agent | Color | Icon | Glow |
|-------|-------|------|------|
| **Proponent** | Cyan `#00F0FF` | Sword/Up arrow | Cyan glow |
| **Opponent** | Magenta `#FF006E` | Shield/Down arrow | Magenta glow |
| **Researcher** | Gold `#FFD700` | Scroll/Book | Gold glow |
| **Judge** | White `#F5F5F0` | Scales | White glow |

### Progress & Timeline

#### Debate Timeline
```css
.timeline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-node {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(0, 240, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-node.active {
  border-color: #00F0FF;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.timeline-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, #00F0FF, transparent);
}
```

### Form Elements

#### Input Fields
```css
.input-oracle {
  background: rgba(26, 15, 46, 0.8);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 8px;
  color: #F5F5F0;
  padding: 12px 16px;
}

.input-oracle:focus {
  border-color: #00F0FF;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  outline: none;
}
```

#### Selection Cards (YES/NO)
- Large touch targets (min 120px)
- Color-coded: Green for YES, Red for NO
- Selected state: Full glow + border highlight
- Unselected: Subtle opacity (60%)

### Badges & Pills

| Type | Style | Usage |
|------|-------|-------|
| Category | Purple bg, white text | Crypto, Politics, Sports |
| Status | Gold border, gold text | Open, Closing Soon, Resolved |
| Confidence | Cyan bg, dark text | 72% Judge Confidence |
| Tier | Gradient border | Lite, Live, Arena |

---

## 5. VOICE & TONE

### Headlines
Bold, dramatic, slightly theatrical. Use arena/oracle metaphors.

- "The Oracle Has Spoken"
- "Enter the Arena"
- "Three Minds. One Truth."
- "Debate the Future"
- "Where AI Battles for Truth"

### Microcopy
Precise, confident, slightly mysterious.

| Context | Copy |
|---------|------|
| Loading | "The Judge evaluates..." / "Consensus forming..." |
| Success | "Wisdom prevails." / "Your wager is recorded." |
| Empty | "The arena is silent... for now." |
| Error | "The oracle is clouded. Try again." |
| Win | "Victory! The future favored your insight." |

### Button Copy
- Primary: "Place Bet" / "Enter Arena" / "Start Debate"
- Secondary: "View Reasoning" / "Listen to Debate" / "See All"
- Destructive: "Cancel Wager" / "Withdraw"

---

## 6. ANIMATION PRINCIPLES

### Timing
- **Micro-interactions:** 150-200ms (hovers, toggles)
- **Transitions:** 300ms (page changes, modal opens)
- **Celebrations:** 800-1200ms (wins, verdict reveals)

### Easing
- **Standard:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Entrance:** `cubic-bezier(0, 0, 0.2, 1)` (decelerate)
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)` (accelerate)
- **Bounce:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

### Key Animations

#### Debate Start
1. Flash of cyan light across screen (100ms)
2. Circular ripple from center (300ms)
3. Agents "materialize" with glow (400ms staggered)

#### Agent Speaking
- Subtle border pulse (glow 0% → 100% → 50%)
- Duration: matches speech length
- Easing: sine wave

#### Judge Deliberating
- Scales icon gently oscillates (±5deg)
- Cyan particles float upward
- "Thinking..." text with ellipsis animation

#### Verdict Reveal
1. Dramatic "slash" wipe transition (cyan line sweeps across)
2. Verdict text scales up with gold shimmer
3. Confetti/particles burst (gold coins, cyan sparks)

#### Win State
- Gold coins rain down
- "VICTORY" text with speed lines
- User balance counts up with glow

---

## 7. IMAGERY & ILLUSTRATION

### Photography Style
- **Subject:** Abstract technology, neon lights, architectural details
- **Treatment:** High contrast, deep shadows, cyan/gold color grading
- **Mood:** Mysterious, futuristic, slightly ominous

### Illustration Style
- **Anime/manga influence:** Clean lines, dramatic shadows, expressive faces
- **Agent portraits:** Consistent style, distinct color coding
- **Background elements:** Greek columns with circuit patterns, neon accents

### Iconography
- **Style:** Outlined, 2px stroke, rounded caps
- **Library:** Custom set matching brand curves
- **States:** Default (cyan), Hover (gold), Active (white)

---

## 8. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | < 640px | Single column, stacked cards |
| Tablet | 640-1024px | Two columns, adjusted spacing |
| Desktop | 1024-1440px | Three columns, full layout |
| Wide | > 1440px | Max-width container, centered |

### Mobile Adaptations
- Logo shrinks to icon mark only
- Cards stack vertically
- Agent avatars inline (horizontal scroll)
- Bottom nav replaces sidebar
- Touch targets minimum 44px

---

## 9. ACCESSIBILITY

### Color Contrast
- All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- Interactive elements have visible focus states
- Don't rely on color alone—use icons + text

### Motion
- Respect `prefers-reduced-motion`
- Provide static alternatives for animated content
- No flashing content > 3Hz

### Typography
- Minimum 14px for body text
- Line height 1.5+ for readability
- Sans-serif for UI elements

---

## 10. DO'S AND DON'TS

### DO
- Use generous spacing (24px+ between elements)
- Apply glow effects subtly (10-30% opacity)
- Maintain the purple → cyan → gold hierarchy
- Use the triad motif consistently
- Keep anime influences tasteful (not overwhelming)

### DON'T
- Use pure black backgrounds (use Obsidian #0D0D0D)
- Overwhelm with glow effects (less is more)
- Mix competing anime styles (stay consistent)
- Use default browser styling for anything
- Forget mobile touch targets

---

*Oracle Arena Brand Playbook v1.0*
*Last updated: May 2025*

---