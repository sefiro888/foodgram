"""Genera una versión de un solo archivo (para vistas previas) en la ruta indicada."""
import pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else root / "dist" / "foodgram.html")
html = (root / "index.html").read_text(encoding="utf-8")
body = re.search(r"<!--APP-->(.*)<!--/APP-->", html, re.S).group(1)
fonts = re.search(r'<link rel="stylesheet" href="(https://fonts[^"]+)">', html).group(1)
css = (root / "css/app.css").read_text(encoding="utf-8")
js = "\n".join((root / f).read_text(encoding="utf-8") for f in ("js/data.js", "js/plates.js", "js/app.js"))
page = (
    '<title>Foodgram</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
    f'<link rel="stylesheet" href="{fonts}">\n<style>\n{css}\n</style>\n{body}\n<script>\n{js}\n</script>\n'
)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(page, encoding="utf-8")
print(out, len(page))
