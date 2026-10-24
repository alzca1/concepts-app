DESIGN.md

Design Direction

Build modern, polished and visually engaging interfaces with a strong sense of hierarchy, depth and personality.

The UI should feel premium and contemporary without becoming noisy or decorative for its own sake. Favor clean layouts enhanced by thoughtful color, typography, spacing, motion and subtle visual effects.

Every screen should feel intentionally designed rather than assembled from generic components.

⸻

Core Principles

1. Modern but timeless

Use contemporary UI patterns without blindly following trends.

Prefer:

- clean compositions;
- strong visual hierarchy;
- generous whitespace;
- refined typography;
- rounded but not excessively pill-shaped surfaces;
- subtle depth;
- purposeful color;
- high-quality interaction feedback.

Avoid interfaces that look like generic admin templates.

2. Visually attractive

The interface should have visual character.

Use:

- tasteful gradients;
- soft shadows;
- subtle glows;
- translucent surfaces when appropriate;
- layered backgrounds;
- blurred decorative elements;
- elegant borders;
- smooth hover and focus effects;
- restrained glass-like surfaces;
- subtle textures or noise when they improve the composition.

Effects must support hierarchy and atmosphere rather than distract from content.

3. Pleasant color palettes

Use harmonious, comfortable colors.

Prefer slightly muted or sophisticated tones over extremely saturated colors.

A typical palette should contain:

- one primary brand color;
- one optional accent color;
- neutral background tones;
- elevated surface colors;
- clear text hierarchy;
- semantic success, warning and error colors.

Do not rely exclusively on pure black or pure white.

For light themes, consider warm or cool off-whites.

For dark themes, prefer deep charcoal, navy or subtly tinted backgrounds rather than #000000.

Accent colors may be vibrant, but large surfaces should remain comfortable to look at.

4. Strong hierarchy

Users should immediately understand:

1. where they are;
2. what matters;
3. what they can do;
4. what information is secondary.

Achieve this primarily through:

- typography;
- spacing;
- contrast;
- positioning;
- scale;
- grouping.

Do not solve every hierarchy problem with borders or containers.

⸻

Color

Create palettes appropriate to the product instead of applying the same palette everywhere.

Good directions include combinations such as:

- indigo + violet;
- blue + cyan;
- emerald + teal;
- coral + warm orange;
- violet + pink;
- deep navy + electric blue.

Use gradients selectively for important visual moments such as:

- hero sections;
- primary actions;
- highlighted cards;
- charts;
- decorative backgrounds;
- selected states.

Prefer subtle gradients with related hues.

Avoid rainbow gradients unless the product identity explicitly requires them.

Maintain sufficient contrast for accessibility.

⸻

Typography

Typography should contribute significantly to the visual identity.

Prefer modern sans-serif typefaces with excellent readability.

Use a clear type scale.

Typical hierarchy:

- Display: 48–72px
- H1: 36–48px
- H2: 28–36px
- H3: 20–24px
- Body: 15–18px
- Secondary: 13–14px
- Caption: 12–13px

Adapt sizes to viewport and product type rather than following these values rigidly.

Use large, confident headings where appropriate.

Body text should remain highly readable.

Avoid excessive font weights. Usually 2–4 weights are enough.

Use slightly tighter tracking for large headings and comfortable line-height for paragraphs.

⸻

Layout

Favor spacious layouts with deliberate rhythm.

Use a consistent spacing system based approximately on multiples of 4 or 8.

Prefer:

- generous section spacing;
- clear content groups;
- balanced margins;
- responsive grids;
- intentional asymmetry when it improves the composition.

Do not wrap every piece of information inside a card.

Use whitespace to create structure.

Important content should have room to breathe.

For desktop interfaces, avoid unnecessarily narrow layouts when the available viewport can be used effectively.

⸻

Surfaces and Cards

Cards should feel lightweight and refined.

Prefer combinations of:

- subtle background differences;
- low-contrast borders;
- soft shadows;
- gentle gradients;
- controlled transparency.

Typical card radius:

12px–20px

Large feature surfaces may use:

20px–28px

Avoid excessive rounding on every small element.

Interactive cards should clearly react to hover and keyboard focus.

Possible hover treatments:

- slight elevation;
- subtle border highlight;
- soft glow;
- small translation;
- background transition.

Keep movement restrained.

⸻

Depth

Create depth using multiple subtle techniques rather than strong shadows.

Prefer:

- layered surfaces;
- tonal differences;
- soft shadows;
- translucent overlays;
- blurred background decoration;
- borders with low opacity.

Avoid large dark drop shadows.

Depth should feel natural and atmospheric.

⸻

Visual Effects

Effects are encouraged when they improve the experience.

Possible effects include:

Gradient glow

Use large blurred radial gradients behind important areas.

Keep opacity low.

Glass surfaces

Use translucent backgrounds with backdrop blur for floating navigation, overlays or highlighted surfaces.

Always maintain sufficient contrast.

Gradient borders

Use sparingly for selected, premium or highlighted elements.

Light effects

Subtle illumination can reinforce active or interactive elements.

Background decoration

Consider:

- blurred color blobs;
- abstract geometric shapes;
- grids;
- dot patterns;
- radial gradients;
- subtle noise;
- masked gradients.

Decoration should remain behind the content and never reduce readability.

⸻

Motion

Use motion to make interactions feel responsive and polished.

Prefer transitions around:

150ms–300ms

Use natural easing.

Animate properties such as:

- opacity;
- transform;
- background;
- border color;
- shadow.

Good interactions include:

- buttons subtly lifting on hover;
- cards gaining depth;
- icons shifting slightly;
- dropdowns fading and moving into place;
- modals smoothly entering;
- selected states transitioning between colors;
- content appearing with restrained fade/translate animations.

Avoid constant decorative animation.

Animation should usually be triggered by interaction or meaningful state changes.

Respect prefers-reduced-motion.

⸻

Buttons

Buttons must clearly communicate hierarchy.

Primary

Visually prominent.

May use:

- solid brand color;
- subtle gradient;
- soft glow;
- strong contrast.

Secondary

Lower visual weight.

Use:

- neutral surfaces;
- subtle borders;
- tinted backgrounds.

Tertiary

Minimal treatment for low-priority actions.

Buttons should have clear:

- hover;
- active;
- focus;
- disabled;
- loading states.

Avoid excessive pill-shaped buttons unless appropriate to the product identity.

⸻

Forms

Forms should feel clean and effortless.

Inputs should provide:

- visible labels;
- clear focus states;
- helpful placeholder text when useful;
- inline validation;
- accessible error messages;
- disabled states;
- comfortable click/touch targets.

Focus states may use the primary color with a subtle ring or glow.

Do not rely solely on placeholder text as a label.

⸻

Navigation

Navigation should feel stable and visually integrated with the product.

Depending on context, consider:

- floating navigation;
- translucent sticky headers;
- compact sidebars;
- contextual subnavigation.

Clearly distinguish the active destination.

Use icons only when they improve recognition.

Avoid unnecessary navigation complexity.

⸻

Icons

Use a consistent icon family.

Prefer simple outline or subtly filled icons.

Icons should reinforce meaning, not act as decoration everywhere.

Maintain consistent:

- stroke width;
- visual size;
- alignment.

Do not mix unrelated icon styles.

⸻

Data Visualization

Charts should follow the application’s visual language.

Use harmonious colors and avoid unnecessary saturation.

Keep:

- grid lines subtle;
- labels readable;
- legends concise;
- tooltips polished;
- highlighted series clearly distinguishable.

Use gradients or glow only when they do not interfere with interpreting the data.

Data clarity always has priority over decoration.

⸻

Empty States

Never leave empty screens feeling unfinished.

Empty states should explain:

- what is missing;
- why it matters when relevant;
- what the user can do next.

They may include tasteful illustrations, icons or subtle decorative graphics.

⸻

Loading States

Prefer skeletons for content-heavy interfaces.

Use spinners mainly for small actions or indeterminate operations.

Avoid unnecessary layout shifts when content loads.

⸻

Responsive Design

Design mobile, tablet and desktop experiences intentionally.

Do not simply shrink the desktop interface.

On smaller screens:

- simplify hierarchy;
- stack content naturally;
- reduce decorative effects when necessary;
- preserve comfortable touch targets;
- collapse secondary navigation;
- keep primary actions accessible.

Typography and spacing should scale fluidly where appropriate.

⸻

Accessibility

Visual quality must never compromise usability.

Ensure:

- sufficient color contrast;
- visible keyboard focus;
- semantic HTML;
- keyboard-accessible interactions;
- readable text sizes;
- meaningful labels;
- adequate touch targets;
- non-color indicators for important states;
- support for reduced motion.

Decorative effects must never make content harder to read.

⸻

Dark Mode

When dark mode is used, design it intentionally rather than simply inverting colors.

Prefer backgrounds such as:

- charcoal;
- graphite;
- dark navy;
- subtly tinted black.

Use several surface levels to establish depth.

Avoid pure white text for everything. Use softer neutral whites for secondary content.

Colored accents and gradients may become slightly more luminous in dark mode while remaining comfortable.

⸻

Avoid

Do not default to:

- generic Bootstrap-like layouts;
- endless grids of identical cards;
- excessive pill shapes;
- excessive borders;
- pure black backgrounds;
- extremely saturated palettes;
- giant shadows;
- gradients everywhere;
- unnecessary glassmorphism;
- excessive animations;
- decorative effects without purpose;
- tiny typography;
- weak contrast;
- overcrowded interfaces;
- overly centered layouts;
- generic SaaS dashboard aesthetics.

Avoid making every section visually independent.

The application should feel like one coherent visual system.

⸻

Creative Freedom

Do not treat this document as a rigid component specification.

Adapt the visual language to the product’s purpose and audience.

Explore distinctive compositions when appropriate.

Use visual effects confidently, but with restraint.

Prefer a few memorable visual ideas executed consistently over many unrelated effects.

When choosing between a safe generic solution and a more distinctive solution that preserves usability, prefer the distinctive solution.

The final result should feel:

modern, polished, expressive, coherent, responsive and pleasant to use.
