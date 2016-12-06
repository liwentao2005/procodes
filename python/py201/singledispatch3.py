# python3 venv3
from functools import singledispatch
from decimal import Decimal


@singledispatch
def add(a, b):
    raise NotImplementedError('Unsupported type')


@add.register(int)
def _(a, b):
    print("First argunet is of type ", type(a))
    print(a + b)


@add.register(str)
def _(a, b):
    print("First argunet is of type ", type(a))
    print(a + b)


@add.register(list)
def _(a, b):
    print("First argunet is of type ", type(a))
    print(a + b)


@add.register(float)
@add.register(Decimal)
def _(a, b):
    print("First argunet is of type ", type(a))
    print(a + b)


if __name__ == '__main__':
    add(1, 2)
    add('python', 'Programming')
    add([1, 2, 3], [5, 6, 7])
    add(1.23, 5.5)
    add(Decimal(100.5), Decimal(5.587))
    print(add.registry.keys())
