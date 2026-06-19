from pathlib import Path
import re

root = Path(__file__).resolve().parent
patterns = [
    (re.compile(r"'Playfair Display',\s*serif"), "'Inter', sans-serif"),
    (re.compile(r'"Playfair Display",\s*serif'), '"Inter", sans-serif'),
    (re.compile(r'Playfair Display,\s*serif'), 'Inter, sans-serif'),
    (re.compile(r"'Playfair Display'"), "'Inter'"),
    (re.compile(r'"Playfair Display"'), '"Inter"'),
    (re.compile(r'Playfair\+Display'), 'Inter'),
    (re.compile(r'color\s*(:|=)\s*#666'), r'color\1 #333'),
    (re.compile(r'color\s*(:|=)\s*#777'), r'color\1 #333'),
    (re.compile(r'color\s*(:|=)\s*#999'), r'color\1 #333'),
    (re.compile(r'"#666"'), '"#333"'),
    (re.compile(r"'#666'"), "'#333'"),
    (re.compile(r'"#777"'), '"#333"'),
    (re.compile(r"'#777'"), "'#333'"),
    (re.compile(r'"#999"'), '"#333"'),
    (re.compile(r"'#999'"), "'#333'"),
]

# Fix specific files first.
index_html = root / 'index.html'
if index_html.exists():
    html = index_html.read_text(encoding='utf-8')
    html = re.sub(r'<link[^>]*href="https://fonts.googleapis.com/css2\?family=[^\"]+"[^>]*>\s*', '', html)
    if 'Inter:wght@400;500;600' not in html:
        html = html.replace(
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n',
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />\n',
        )
    index_html.write_text(html, encoding='utf-8')

index_css = root / 'src' / 'index.css'
if index_css.exists():
    css = index_css.read_text(encoding='utf-8')
    css = css.replace("font-family: 'Playfair Display', serif;", "font-family: 'Inter', sans-serif;")
    css = re.sub(r'html, body, #root \{', 'html, body, #root {\n  font-size: 16px;', css)
    if 'line-height: 1.6' not in css:
        css = css.replace('body {\n', 'body {\n  line-height: 1.6;\n  color: #202124;\n')
    if 'table th' not in css and 'table td' not in css:
        css += '\n\ntable th,\ntable td {\n  padding: 12px 14px;\n}\n'
    index_css.write_text(css, encoding='utf-8')


tailwind = root / 'tailwind.config.js'
if tailwind.exists():
    text = tailwind.read_text(encoding='utf-8')
    text = text.replace("'Playfair Display'", "'Inter'")
    text = text.replace('Playfair Display', 'Inter')
    text = re.sub(r'sans:\s*\[[^\]]+\]', "sans: ['Inter', 'sans-serif']", text)
    text = re.sub(r'display:\s*\[[^\]]+\]', "display: ['Inter', 'sans-serif']", text)
    tailwind.write_text(text, encoding='utf-8')

theme_path = root / 'src' / 'theme' / 'Theme.js'
if theme_path.exists():
    text = theme_path.read_text(encoding='utf-8')
    text = text.replace("'Playfair Display', serif", "'Inter', sans-serif")
    text = text.replace('Playfair Display, serif', 'Inter, sans-serif')
    text = text.replace('Playfair Display', 'Inter')
    text = re.sub(r'text:\s*\{\s*primary:\s*"#[0-9A-Fa-f]{6}",\s*//.*?\n\s*secondary:\s*"#[0-9A-Fa-f]{6}",', 'text: {\n    primary: "#1C1C1C",   // gần đen\n    secondary: "#4D4D4D", // xám chữ phụ', text)
    text = re.sub(r'body1:\s*\{[\s\S]*?\},\n\s*body2:', "body1: {\n    fontFamily: '\'Inter\', sans-serif',\n    fontSize: 16,\n    lineHeight: 1.6,\n  },\n  body2:", text)
    text = re.sub(r'body2:\s*\{[\s\S]*?\},\n\s*button:', "body2: {\n    fontFamily: '\'Inter\', sans-serif',\n    fontSize: 15,\n    lineHeight: 1.6,\n  },\n    button:", text)
    if 'MuiTableCell' not in text:
        text = text.replace(
            '    MuiPaper: {\n      styleOverrides: {\n        root: {\n          borderRadius: 16,\n          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",\n        },\n      },\n    },\n\n    MuiCard:',
            '    MuiPaper: {\n      styleOverrides: {\n        root: {\n          borderRadius: 16,\n          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",\n        },\n      },\n    },\n    MuiTableCell: {\n      styleOverrides: {\n        root: {\n          padding: "12px 14px",\n        },\n      },\n    },\n\n    MuiCard:',
        )
    theme_path.write_text(text, encoding='utf-8')

ignore_dirs = {'node_modules', 'dist', '.git'}
for path in sorted(root.rglob('*')):
    if any(part in ignore_dirs for part in path.parts):
        continue
    if path.is_file() and path.suffix.lower() in {'.js', '.jsx', '.ts', '.tsx', '.css', '.html'}:
        text = path.read_text(encoding='utf-8')
        new = text
        for pat, rep in patterns:
            new = pat.sub(rep, new)
        if new != text:
            path.write_text(new, encoding='utf-8')
            print('updated', path.relative_to(root))
