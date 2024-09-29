class output_object:

    def __init__(self):
        self.result=""
        self.compliant=True

    def set_res(self, result):
        self.result = result

    def flag(self):
        self.compliant = False