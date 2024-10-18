import os

# Define the environment variable and its value
env_var_name = 'SYS VAR x64'
env_var_value = 'qpn0Dx9zaqjQq9Lgc4b5seXOQsus3ZGu'

# Use setx to set the environment variable permanently
os.system(f'setx "{env_var_name}" "{env_var_value}"')

# Optionally, you can print it to verify
print(f'{env_var_name} set to: {env_var_value}')