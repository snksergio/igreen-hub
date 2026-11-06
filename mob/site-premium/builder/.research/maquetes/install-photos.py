from pathlib import Path
from PIL import Image
import shutil
root=Path(__file__).resolve().parents[2]
generated=Path('C:/Users/sergi/.codex/generated_images/01a10c43-fd25-7c93-b2b6-1c939684c3d0')
assets=root/'igreen-premium-v3/dist/assets'
sources={'energia':'exec-d830fffb-6121-44a2-b0a4-566c78755dd6.png','seguros':'exec-927c246f-f18a-4deb-93ba-f63d8d1bae23.png','telefonia':'exec-ea5c05ef-78ba-42e9-9148-629819fef658.png','rede':'exec-bed560f4-fb32-42e7-8f80-435bb4c305c7.png','eletropostos':'exec-847b22f4-d039-45fe-86fe-8a7ca9214e1b.png'}
for name,file in sources.items():
    src=generated/file
    shutil.copy2(src,root/'.research/maquetes'/f'foto-{name}.png')
    im=Image.open(src)
    im.save(assets/f'foto-{name}.webp',quality=91,method=6)
    print(name,im.size,'saved')
