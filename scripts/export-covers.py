"""Export the approved cover atlas into production images; requires Pillow."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parent.parent
atlas = Image.open(root / 'assets/world/cover-atlas.webp').convert('RGB')
# The approved generated atlas has these measured row boundaries.
rows = [0, 341, 652, 1024]
output = root / 'assets/volumes'
output.mkdir(exist_ok=True)
for i in range(12):
    row, col = divmod(i, 4)
    cover = atlas.crop((col * 384, rows[row], (col + 1) * 384, rows[row + 1])).resize((384, 512), Image.Resampling.LANCZOS)
    cover.save(output / f'volume-{i + 1:02}.webp', quality=88)
    cover.resize((180, 240), Image.Resampling.LANCZOS).save(output / f'volume-{i + 1:02}-small.webp', quality=80)
