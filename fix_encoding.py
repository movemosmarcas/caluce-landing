import os

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove BOM if present
        if content.startswith('\ufeff'):
            content = content[1:]
            
        # Reverse the cp1252 double encoding
        fixed_content = content.encode('cp1252').decode('utf-8')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Could not fix {filepath}: {e}")

fix_file('index.html')
fix_file('gracias.html')
fix_file('politica.html')
