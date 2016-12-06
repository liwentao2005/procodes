# arg_demo.py

import argparse
import os

from collections import ChainMap

import sqlite3

from contextlib import contextmanager
from contextlib import suppress

import urllib.error
import urllib.request

from functools import lru_cache

@lru_cache(maxsize=24)
def get_webpage(module):
    """
    Gets the specified Python module web page
    """
    webpage = "https://docs.python.org/3/library/{}.html".format(module)
    try:
        with urllib.request.urlopen(webpage) as request:
            return request.read()
    except urllib.error.HTTPError:
        return None

def main():
    """"""
    app_defaults = {'username':'admin', 'password':'admin'}


    parser = argparse.ArgumentParser(
            description="A simple argument parser",
            epilog="This is where you might put examle usage"
    )

    group = parser.add_mutually_exclusive_group()
    group.add_argument('-x', '--execute', action="store",
                        help='Help text for option X')
    group.add_argument('-y', help='Help text for option Y', default=False)

    parser.add_argument('-z', help='Help text for option Z', type=int)

    parser.add_argument('-u', '--username')
    parser.add_argument('-p', '--password')
    args = parser.parse_args()

    command_line_args = {key:value for key, value
                         in vars(args).items() if value}

    chain = ChainMap(command_line_args, os.environ, app_defaults)
    print(chain['username'])

class DataConn:
    """"""

    def __init__(self, db_name):
        """Constructor"""
        self.db_name = db_name

    def __enter__(self):
        """
        Open the database connection
        """
        self.conn = sqlite3.connect(self.db_name)
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        Close the connection
        """
        self.conn.close()
        if exc_val:
            raise

@contextmanager
def file_open(path):
    """
    decorate our file_open function with contextmanager from contextlib
    """
    try:
        f_obj = open(path, 'w')
        yield f_obj
    except OSError:
        print("we had an error!")
    finally:
        print('Closing file')
        f_obj.close()

@contextmanager
def closing(path):
    """
    """
    try:
        yield path.read()
    finally:
        print('Closing file')
        path.close()


if __name__ == '__main__':
    main()
    os.environ['username'] = 'test'
    main()

    db = './test.db'
    with DataConn(db) as conn:
        cursor = conn.cursor()
    
    with file_open('./test.db') as fobj:
        fobj.write('Testing context managers')

#    with closing(urlopen('http://www.baidu.com')) as webpage:
#        for line in webpage:
#            print(line)
#            pass

    with suppress(FileNotFoundError):
        with open('notFoundFile.txt') as fobj:
            for line in fobj:
                print(line)

    modules = ['functools', 'collections', 'os', 'sys']
    for module in modules:
        page = get_webpage(module)
        if page:
#            print(page)
            print("{} module page found".format(module))
