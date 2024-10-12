import os

# Set the environment variable
# os.environ['GND_ENCRYPTION_KEY'] = 'IWIllreplacethislaterIWIllreplac'

# Optionally, you can print it to verify
print(f"ENCRYPTION_KEY set to: {os.getenv('GND_ENCRYPTION_KEY')}")