from pathlib import Path
from PIL import Image
p=Path('dist/assets')
for f in p.glob('*.png'):
 im=Image.open(f);im.save(f.with_suffix('.webp'),quality=88)
print('Converted original assets to optimized WebP')
