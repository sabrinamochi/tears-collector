# Visual Refresh — tears collector
## Prompt for Claude Code

Read CLAUDE.md first. Then apply every change in this document.
This is a **visual-only** pass — no logic, no data model, no animation timing changes.
Touch only: colors, fonts, spacing, borders, text transforms, SVG fill values.

---

## 1. FONTS — replace both fonts everywhere

Remove: `DM Mono`, `Instrument Serif`
Add via next/font/google:

```typescript
import { Fraunces, Inter } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400'],
  axes: ['opsz'],  // optical size axis — required for Fraunces
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-ui',
});
```

Apply to layout.tsx className: `${fraunces.variable} ${inter.variable}`

### Font usage rules — apply everywhere

| Element | Font | Weight | Style | Transform | Size |
|---|---|---|---|---|---|
| App name | Fraunces | 300 | italic | none | 17px |
| Entry note body | Fraunces | 300 | italic | none | 15–17px |
| Tooltip note | Fraunces | 300 | italic | none | 14px |
| Card annotation | Fraunces | 300 | italic | none | 11px |
| ALL labels | Inter | 300 | normal | lowercase | 9–10px |
| Sort bar buttons | Inter | 300 | normal | sentence case | 11–12px |
| Date/meta | Inter | 300 | normal | lowercase | 10px |
| Reason tags | Inter | 300 | normal | lowercase | 9px |
| Buttons | Inter | 300 | normal | lowercase | 10px |
| Legend | Inter | 300 | normal | lowercase | 10px |

**Critical rule:** Nothing in the UI should be `uppercase` except `font-variant: small-caps`
on dates if you choose to use it. No `text-transform: uppercase` anywhere.
No `font-weight: 500` or `600` except the collect/submit button.

---

## 2. COLORS — replace entire palette

In `globals.css`, update CSS variables:

```css
:root {
  /* background */
  --bg:             #F6F5F2;
  --card-bg:        #2a2825;

  /* ink */
  --ink:            #27251f;
  --ink-60:         rgba(39,37,31,0.60);
  --ink-35:         rgba(39,37,31,0.35);
  --ink-14:         rgba(39,37,31,0.14);
  --ink-07:         rgba(39,37,31,0.07);

  /* tears — NEW values, replacing old sad/happy/yawn */
  --sad:            #4A5B73;
  --sad-deep:       #2e3d52;
  --touched:        #C8A36A;   /* replaces 'happy' */
  --touched-deep:   #9e7a3e;
  --unsure:         #7A7D80;   /* replaces 'yawn' */

  /* bottle */
  --glass-fill:     rgba(74,91,115,0.08);
  --glass-stroke:   rgba(74,91,115,0.35);
  --cork:           #c8b48a;
  --cork-stroke:    #a89060;
}
```

Also rename the mood type:
```typescript
// lib/types.ts
export type Mood = 'sad' | 'touched' | 'unsure';
// was: 'sad' | 'happy' | 'yawn'
```

Update all references to 'happy' → 'touched', 'yawn' → 'unsure' in:
- store.ts seed data
- positions.ts mood groupings
- all components

---

## 3. TEAR SHAPES — remove stroke, desaturate fills

In `lib/tearShape.ts`, update the COLORS map:

```typescript
export const COLORS: Record<Mood, {
  fill: string;
  deep: string;
  stroke: string;  // keep in type but set to 'none'
}> = {
  sad:     { fill: '#4A5B73', deep: '#2e3d52', stroke: 'none' },
  touched: { fill: '#C8A36A', deep: '#9e7a3e', stroke: 'none' },
  unsure:  { fill: '#7A7D80', deep: '#5a5e62', stroke: 'none' },
};
```

In `TearDrop.tsx`, the base path SVG element:
- Remove `stroke` attribute entirely (or set `stroke="none"`)
- Reduce `fill-opacity` range from `0.60–0.85` to `0.58–0.78`
- Reduce white highlight `fill-opacity` from `0.38–0.60` to `0.15–0.22`
- Keep all other layers (inner pool, mid-tone) as-is

---

## 4. SORT BAR — remove heavy borders, sentence case

In `SortBar.tsx`:

```tsx
// Remove: border around the whole container, padding box, background fill
// Replace with: bottom-border underline style only

// Container:
className="flex border-b border-[var(--ink-14)]"

// Each button — inactive:
className="font-[family-name:var(--font-ui)] font-light text-[11px] tracking-[0.02em]
           px-5 pb-[10px] pt-1 border-b-2 border-transparent -mb-px
           text-[var(--ink-35)] bg-transparent hover:text-[var(--ink-60)]"

// Active button:
className="... text-[var(--ink)] border-b-2 border-[var(--ink)]"

// Labels: "Scattered" / "By mood" / "By date"  ← sentence case, not uppercase
```

---

## 5. LEGEND — squares → dots, uppercase → lowercase

In `Legend.tsx`:

```tsx
// Remove: square divs (w-3 h-3 rounded-sm)
// Replace with: small circles

<div className="w-[6px] h-[6px] rounded-full" style={{ background: color, opacity: 0.82 }} />

// Text: lowercase, Inter 300, 10px, tracking-[0.03em], text-[var(--ink-35)]
// NOT uppercase, NOT font-weight 500
```

---

## 6. ENTRY CARD — dots, lowercase, annotation

In `TearTooltip.tsx` (or wherever the expanded card lives):

### Mood indicator
```tsx
// Remove: square div with border-radius: 2px
// Replace with: small circle
<div className="w-[7px] h-[7px] rounded-full" style={{ background: moodColor, opacity: 0.82 }} />
```

### Mood label
```tsx
// Change: font-weight 500, uppercase, tracking-[0.14em]
// To: font-weight 300, lowercase, tracking-[0.10em], Inter, text-[var(--ink-35)]
```

### Date line
```tsx
// Change: uppercase, font-weight 500
// To: lowercase, font-weight 300, Inter, tracking-[0.12em], opacity 0.35
```

### Note text (the long italic body)
```tsx
// Change: DM Mono → Fraunces italic 300
// Size: 16px, line-height 1.7
className="font-[family-name:var(--font-display)] italic font-light text-[16px] leading-[1.7]"
```

### "Pour" button
```tsx
// Change: uppercase, font-weight 500
// To: lowercase, font-weight 300, border-[var(--ink-14)], text-[var(--ink-35)]
// Text: "pour" not "POUR"
```

### Add annotation (new element)
```tsx
// Add a small incidental date note floating above the card
// Fraunces italic, 11px, color var(--touched), opacity 0.65, rotate(-1.8deg)
// Content: abbreviated date, e.g. "Feb 12 ↗"
// Position: absolute, top: -14px, right: 22px
// This is decoration only — aria-hidden="true"
```

---

## 7. ADD FORM — lowercase everything

In `AddPanel.tsx`, `MoodPicker.tsx`, `ReasonTags.tsx`:

### Form title
```tsx
// Change: "What made you cry?" in Inter medium
// To: "what made you cry?" in Fraunces italic 300, 17px, opacity 0.65
```

### Mood labels
```tsx
// Change: "SAD" "TOUCHED" "UNSURE" uppercase Inter 500
// To: "sad" "touched" "unsure" lowercase Inter 300
```

### Reason tags
```tsx
// Change: "WORK" "FRIENDS" uppercase Inter 500
// To: "work" "friends" lowercase Inter 300, tracking-[0.06em]
// Border: 1px solid var(--ink-14) inactive, var(--ink-35) active
```

### Buttons
```tsx
// Change: "COLLECT" uppercase Inter 500
// To: "collect" lowercase Inter 300
// Change: "CLOSE" uppercase
// To: "close" lowercase Inter 300
```

---

## 8. BACKGROUND — subtle vignette

In `globals.css`, add to `body` or the main canvas wrapper:

```css
/* very subtle radial vignette */
background: radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(39,37,31,0.04) 100%),
            var(--bg);
```

The existing grain overlay stays but reduce its opacity to `0.020` (from wherever it currently is).

---

## 9. WHAT NOT TO CHANGE

Do not touch:
- TEAR_BASE_PATH SVG path
- seededRandom algorithm
- Any animation timing values
- Any positioning logic
- The bottle SVG shapes
- localStorage / Zustand logic
- The feTurbulence watercolor filters

---

## 10. VERIFICATION CHECKLIST

After making changes, visually check:
- [ ] No uppercase text anywhere (except possibly dates with font-variant: small-caps)
- [ ] No visible stroke on any tear shape
- [ ] Sort bar has only a bottom underline for active state — no box
- [ ] Legend uses circles not squares
- [ ] Mood labels in form are lowercase
- [ ] Reason tags are lowercase
- [ ] Collect/close buttons are lowercase
- [ ] Note text in card uses Fraunces italic (not DM Mono)
- [ ] All tear fills use new hex values (#4A5B73, #C8A36A, #7A7D80)
- [ ] Background is #F6F5F2 not the old #f4f0e8
