import subprocess

var_name = 'GND_ENCRYPTION_KEY'
var_value = 'IWIllreplacethislaterIWIllreplac'

# Set system-wide environment variable (requires admin rights)
subprocess.run(['setx', '/M', var_name, var_value], shell=True)

print(f"System environment variable '{var_name}' set to '{var_value}'.")
