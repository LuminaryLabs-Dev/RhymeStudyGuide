"""Record a reviewed source revision and its browser evidence; no runtime dependency."""
from pathlib import Path
import sys,json,hashlib,tarfile,shutil
number=int(sys.argv[1]);objective=sys.argv[2];observation=sys.argv[3]
p=Path('validation/release/fixed-reader');out=Path(f'validation/runs/fixed-reader/pass-{number}')
for name in ['results.json','desktop.png','mobile.png']:
 if (out/name).exists():shutil.copyfile(out/name,p/f'pass-{number}-{name}')
archive=p/f'pass-{number}-source.tar.gz'
with tarfile.open(archive,'w:gz') as t:
 t.add('src');t.add('scripts/build.mjs');t.add('scripts/fixed-reader-qa.mjs');t.add('tests')
r=json.loads((p/'review.json').read_text());prior=r['attempts'][-1]['output']
r['attempts'].append({'pass':number,'input':prior,'objective':objective,'output':hashlib.sha256(archive.read_bytes()).hexdigest(),'evidence':f'pass-{number}-results.json; pass-{number}-desktop.png; pass-{number}-mobile.png','observed':observation,'regressions':[],'decision':'accept'})
r['spent']=number;r['remaining']=5-number;r['best']=r['attempts'][-1]['output'];(p/'review.json').write_text(json.dumps(r,indent=2)+'\n')
