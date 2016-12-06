# decorum.py
from functools import wraps
from functools import lru_cache

import urllib.error
import urllib.request

def another_function(func):
    """
    A function that accepts another function
    """

    def wrapper():
        """
        A wrapping function
        """
        val = "The result of %s is %s" % (func(),
                                          eval(func())
                                          )
        return val
    return wrapper


@another_function
def a_function():
    """A pretty useless function"""
    return "2+2"



@lru_cache(maxsize=24)
def get_webpage(module):
    webpage = "https://docs.python.org/3/library/{}.thml".format(module)
    try:
        with urllib.request.urlopen(webpage) as request:
            return request.read()
    except urllib.error.HTTPError:
        return None


if __name__ == "__main__":
    print(a_function.__name__)
    print(a_function.__doc__)
    print(a_function())

    modules = ['os', 'sys']
    for module in modules:
        page = get_webpage(module)
        if page:
            print("{} module page found".format(module))

