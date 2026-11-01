# Packs a hero's walking + running sheets (8 frames x 4 directions each, loosely gridded) into the game's
# motion sheet: 16 columns (walk 0-7, run 8-15) x 4 rows in CHARACTER_DIRECTIONS order (down, left, right, up).
#
#   python scripts/pack-character-sheet.py <walking.png> <running.png> <out-dir>
#
# Sources rows are down, up, left, right. Frames are found by transparent gaps (alpha >= 32), not by a fixed
# grid, because generated sheets drift inside their cells. Each frame is registered on the centroid of its
# head + torso (no sideways jitter) and keeps its height above its row's ground line (running bob/flight).
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ALPHA_MIN = 32            # export residue below this is dropped
GUTTER = 4                # transparent margin kept around every pose
TILE_HEIGHT = 256
GROUND_Y = 248            # foot baseline inside a tile
SOURCE_ROWS = {'down': 0, 'up': 1, 'left': 2, 'right': 3}
DIRECTIONS = ['down', 'left', 'right', 'up']


def runs(profile):
    found, start = [], None
    for index, on in enumerate(profile):
        if on and start is None: start = index
        if not on and start is not None: found.append((start, index)); start = None
    if start is not None: found.append((start, len(profile)))
    return found


def frames_of(path):
    """Returns rows[4][8] of (rgba crop, torso centroid x, offset of the crop bottom from the row ground)."""
    rgba = np.asarray(Image.open(path).convert('RGBA')).copy()
    rgba[rgba[:, :, 3] < ALPHA_MIN] = 0
    mask = rgba[:, :, 3] > 0
    rows = runs(mask.any(axis=1))
    if len(rows) != 4: raise SystemExit(f'{path}: expected 4 rows, found {len(rows)}')
    sheet = []
    for top, bottom in rows:
        cells = runs(mask[top:bottom].any(axis=0))
        if len(cells) != 8: raise SystemExit(f'{path}: expected 8 frames in row {top}, found {len(cells)}')
        row = []
        for left, right in cells:
            part = mask[top:bottom, left:right]
            ys = np.nonzero(part.any(axis=1))[0]
            y0, y1 = ys[0], ys[-1] + 1
            torso = part[y0:y0 + int((y1 - y0) * 0.45)]
            cx = np.nonzero(torso)[1].mean()
            row.append({'pixels': rgba[top + y0:top + y1, left:right], 'cx': cx, 'bottom': top + y1})
        ground = max(frame['bottom'] for frame in row)
        for frame in row: frame['lift'] = ground - frame['bottom']
        sheet.append(row)
    return sheet


def main(walk_path, run_path, out_dir):
    walk, run = frames_of(walk_path), frames_of(run_path)
    grid = [[*walk[SOURCE_ROWS[d]], *run[SOURCE_ROWS[d]]] for d in DIRECTIONS]
    half = max(max(f['cx'], f['pixels'].shape[1] - f['cx']) for row in grid for f in row)
    tile_width = 2 * int(np.ceil(half + GUTTER))
    sheet = np.zeros((TILE_HEIGHT * 4, tile_width * 16, 4), dtype=np.uint8)
    crop = [tile_width, TILE_HEIGHT, 0, 0]
    for r, row in enumerate(grid):
        for c, frame in enumerate(row):
            h, w = frame['pixels'].shape[:2]
            x = int(round(tile_width / 2 - frame['cx']))
            y = GROUND_Y - frame['lift'] - h
            if y < GUTTER or x < 0 or x + w > tile_width: raise SystemExit(f'pose {r},{c} does not fit the tile')
            sheet[r * TILE_HEIGHT + y:r * TILE_HEIGHT + y + h, c * tile_width + x:c * tile_width + x + w] = frame['pixels']
            crop = [int(v) for v in (min(crop[0], x), min(crop[1], y), max(crop[2], x + w), max(crop[3], y + h))]
    out = Path(out_dir); out.mkdir(parents=True, exist_ok=True)
    Image.fromarray(sheet, 'RGBA').save(out / 'motion-sheet.png', optimize=True)
    manifest = {
        'columns': 16, 'rows': 4, 'sourceWidth': tile_width * 16, 'sourceHeight': TILE_HEIGHT * 4,
        'crop': {'x': crop[0], 'y': crop[1], 'width': crop[2] - crop[0], 'height': crop[3] - crop[1]},
        'anchor': {'x': tile_width // 2, 'y': GROUND_Y},
        'directions': DIRECTIONS, 'poses': [*(f'walk-{i}' for i in range(8)), *(f'run-{i}' for i in range(8))],
    }
    (out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(manifest))


if __name__ == '__main__':
    main(*sys.argv[1:4])
