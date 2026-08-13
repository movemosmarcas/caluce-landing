import os

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove BOM if present
        if content.startswith('\ufeff'):
            content = content[1:]
            
        # Reverse the encoding using latin-1 which maps 1:1 to bytes
        fixed_content = content.encode('latin-1').decode('utf-8')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Could not fix {filepath}: {e}")

fix_file('index.html')
fix_file('gracias.html')
fix_file('politica.html')
