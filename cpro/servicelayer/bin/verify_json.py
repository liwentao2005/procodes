#!/usr/bin/env python
import sys
import json


def check(filename):
    with open(filename, 'r') as filehandle:
        try:
            json.load(filehandle)
        except ValueError as err:
            print 'Failed to decode:', filename
            print str(err)


if __name__ == '__main__':
    check(sys.argv[1])
