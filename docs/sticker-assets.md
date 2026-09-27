# Locker artwork and cat stickers

Updated 2026-09-28.

## Whole artwork

The user requested that the two supplied layouts be placed as complete images:

- `封面-固定1920_1080.png` → `public/assets/stickers/portfolio-cover-full.webp` on the center door; original 16:9 ratio.
- `自我介绍.png` → `public/assets/stickers/about-full.webp` on the left door; original 5760:5562 ratio.

Both are full-image WebP exports, 2048 px wide, without cropping or composition changes.

## Cat cutouts

- Asset: `public/assets/stickers/cats-cutout-atlas.png`.
- Source: the user's cat collage, `codex-clipboard-bcad8e41-c01a-4a0e-9016-b1a7b620be0a.png`.
- Tool: built-in imagegen, background extraction edit (not CLI).
- The 2 × 2 transparent atlas is sampled by the Three.js texture UVs. Top row: shark-hood cat, matcha cat. Bottom row: glasses and flowers cat, pink-whisker cat.

Prompt used:

> Use case: background-extraction. Asset type: transparent PNG sticker atlas for a 3D portfolio website. Edit the supplied cat collage by extracting exactly FOUR of its existing photographic cat stickers and placing them in a square 2 by 2 grid on a genuinely transparent alpha background. Preserve the original cats, identities, expressions, photographic fur, accessories and poses as closely as possible. Top-left cell: the upper-left kitten wearing the gray shark hood with a pacifier. Top-right cell: the middle-left gray/white cat with pink bow holding the large matcha drink. Bottom-left cell: the gray/white cat wearing black glasses, pink bow and holding pink tulips, with the tiny drink. Bottom-right cell: the front-facing gray/white cat with pink drawn whiskers and small pink bow. Each cat is fully contained and centered in its own equal square quadrant with 8 percent transparent margin, no parts touching another quadrant. Keep the entire sticker silhouette including ears, bows, drinks and flowers. Add a thin clean white die-cut outline, no dark border, no shadow. Remove all white/gray rectangular source backgrounds and every other cat. Do not include a checkerboard, scenery, frame or extra text. This is one reusable sprite sheet asset, not a scene. Return transparent PNG.

The earlier cropped motifs are no longer referenced by the locker scene.
