import os

# Set the path you want to check
target_path = os.path.join(os.path.dirname(__file__), 'Zonos', 'Zonos', 'zonos')

print(f"Checking contents of: {target_path}")

# Check if the folder exists
if os.path.exists(target_path):
    print("\n📂 Contents:")
    for root, dirs, files in os.walk(target_path):
        for name in dirs:
            print(f"[DIR]  {os.path.join(root, name)}")
        for name in files:
            print(f"[FILE] {os.path.join(root, name)}")
else:
    print(f"❌ Folder does NOT exist: {target_path}")
