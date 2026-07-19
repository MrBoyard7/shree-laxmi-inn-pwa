"""Generate the Shree Laxmi Inn app icon set.

Draws a small geometric brand mark (a temple arch cut from a marigold
disc, with a diya flame above it) directly with Pillow so the icon set
has no external image dependency and no licensing question attached to
it. Run with: python3 scripts/generate_icons.py
"""

from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / 'public' / 'icons'
ICONS_DIR.mkdir(parents=True, exist_ok=True)

INDIGO = (30, 39, 73, 255)
MARIGOLD = (242, 160, 12, 255)
MARIGOLD_DARK = (212, 135, 10, 255)
GOLD = (201, 151, 28, 255)
PARCHMENT = (251, 243, 231, 255)


def draw_mark(size: int, padding_ratio: float = 0.16) -> Image.Image:
    """Draw the brand mark at the given pixel size on an indigo tile."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    corner_radius = int(size * 0.22)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner_radius, fill=INDIGO)

    pad = int(size * padding_ratio)
    disc_box = [pad, pad * 1.5, size - pad, size - pad * 0.6]
    draw.ellipse(disc_box, fill=MARIGOLD)

    # Temple arch cut-out: a parchment-colored dome sitting on the disc,
    # echoing the .temple-arch CSS shape used throughout the UI.
    arch_w = size * 0.46
    arch_h = size * 0.5
    arch_x0 = (size - arch_w) / 2
    arch_y0 = size * 0.34
    draw.pieslice(
        [arch_x0, arch_y0, arch_x0 + arch_w, arch_y0 + arch_w],
        180,
        360,
        fill=INDIGO,
    )
    draw.rectangle(
        [arch_x0, arch_y0 + arch_w / 2, arch_x0 + arch_w, arch_y0 + arch_h],
        fill=INDIGO,
    )

    # Diya flame accent above the disc.
    flame_w = size * 0.1
    flame_cx = size / 2
    flame_top = size * 0.1
    flame_bottom = size * 0.26
    draw.polygon(
        [
            (flame_cx, flame_top),
            (flame_cx + flame_w / 2, flame_bottom),
            (flame_cx, flame_bottom + flame_w * 0.35),
            (flame_cx - flame_w / 2, flame_bottom),
        ],
        fill=GOLD,
    )

    return img


def save(img: Image.Image, name: str) -> None:
    path = ICONS_DIR / name
    img.save(path, format='PNG')
    print(f'wrote {path.relative_to(ROOT)}')


def main() -> None:
    save(draw_mark(192), 'icon-192.png')
    save(draw_mark(512), 'icon-512.png')
    save(draw_mark(180), 'apple-touch-icon.png')

    # Maskable icon: same mark with extra safe-zone padding since OS
    # launchers crop maskable icons to their own shape.
    save(draw_mark(512, padding_ratio=0.28), 'icon-maskable-512.png')

    print('Done. Re-run this script whenever the brand mark changes.')


if __name__ == '__main__':
    main()
