import os

# Define the environment variable and its value
env_var_name = 'SYS_VAR_KEY'
env_var_value = ''

# Use setx to set the environment variable permanently
# os.system(f'setx {env_var_name} "{env_var_value}"')

# Optionally, you can print it to verify
# print(f'{env_var_name} set to: {env_var_value}')
# print(os.getenv(''))