#simple makefile

objs := $(patsubst %.c, %.o, $(wildcard ./src/*.c))

main: $(objs)
	cc -o $@ $(objs)

.PHONY: clean
clean:
	rm -rf obj main ./src/*.o
