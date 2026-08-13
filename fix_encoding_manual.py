import os

files = ['index.html', 'politica.html', 'gracias.html']
replacements = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Â¿': '¿',
    'Ã­': 'í',
    'Ã\xad': 'í',
    'Ã\xa1': 'á',
    'Ã\xa9': 'é',
    'Ã\xb3': 'ó',
    'Ã\xba': 'ú',
    'Ã\xb1': 'ñ',
    'Â\xbf': '¿',
    'Ã“': 'Ó',
    'Ã\x93': 'Ó',
    'Â¡': '¡',
    'Ã\x81': 'Á',
    'Ã\x89': 'É',
    'Ã\x8d': 'Í',
    'Ã\x9a': 'Ú',
    'Ã\x91': 'Ñ'
}

for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            text = f.read()
            
        for bad, good in replacements.items():
            text = text.replace(bad, good)
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Fixed {file}")
    except Exception as e:
        print(f"Error {file}: {e}")
