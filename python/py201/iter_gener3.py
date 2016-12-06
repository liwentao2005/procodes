class MyIterator:

    def __init__(self, letters):
        """
        Constructor
        """
        self.letters = letters
        self.position = 0

    def __iter__(self):
        """
        Return itself as an iterator
        """
        return self

    def __next__(self):
        """
        Return the next letter in the sequence or
        raise StopIteration
        """
        if self.position >= len(self.letters):
            raise StopIteration
        letter = self.letters[self.position]
        self.position += 1
        return letter


class Doubler:
    """
    An infinite iterator
    """

    def __init__(self):
        """
        Constructor
        """
        self.number = 0

    def __iter__(self):
        """
        Return itself as an iterator
        """
        return self

    def __next__(self):
        """
        Doubler the number and return it
        """
        self.number += 1
        return self.number * self.number


def Doubler_generator():
    number = 2
    while True:
        yield number
        number *= number


if __name__ == '__main__':
    i = MyIterator('abcde')
    for item in i:
        print(item)

    doubler = Doubler()
    count = 0

    for number in doubler:
        print(number)
        if count > 5:
            break
        count += 1

    double0 = Doubler_generator()
    print(next(double0))
    print(next(double0))
    print(next(double0))

