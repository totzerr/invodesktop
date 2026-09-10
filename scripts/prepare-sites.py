"""Stage only runtime assets; exclude source administration and backups."""
from pathlib import Path
import shutil, subprocess
root=Path(__file__).resolve().parent.parent
out=root/'dist'
if out.exists(): shutil.rmtree(out)
out.mkdir()
for name in subprocess.check_output(['git','ls-files'],cwd=root,text=True).splitlines():
 if name=='index.html' or name.startswith(('js/','css/','assets/')):
  source=root/name
  target=out/name
  target.parent.mkdir(parents=True,exist_ok=True)
  shutil.copy2(source,target)
assert (out/'index.html').is_file()
print('Runtime assets prepared')
