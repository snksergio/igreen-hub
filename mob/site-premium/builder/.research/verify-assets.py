from pathlib import Path
import re
p=Path('dist')
html=(p/'index.html').read_text(encoding='utf-8')
refs=re.findall(r'(?:src|href)="([^"#]+)"',html)
missing=[r for r in refs if not r.startswith(('http','data:')) and not (p/r).exists()]
print('Missing local references:',missing)
assert not missing
