"""Build the standalone HTML from src/, without third-party dependencies."""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = root / "src"
html = (src / "index.html").read_text(encoding="utf-8-sig")
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + (src / "style.css").read_text(encoding="utf-8-sig") + '</style>')
html = html.replace('<script src="app.js"></script>', '<script>' + (src / "app.js").read_text(encoding="utf-8-sig") + '</script>')
(root / "izzo-fit-prototyp.html").write_text(html, encoding="utf-8")
print("Built izzo-fit-prototyp.html")
