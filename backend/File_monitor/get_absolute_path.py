import logging
import os
import sys

class path_fetcher:

    def path_to_monitor(self):
        res = os.path.abspath('./backend/Receiver')
        print(res)
        return res
    
if __name__ == '__main__':
    this_ = path_fetcher()
    # if (len(sys.argv) <= 0):
    #     logging.error("Please provide the path and file extension")
    #     sys.exit(1)

    # if sys.argv[0] == 'receiver':
    this_.path_to_monitor()
