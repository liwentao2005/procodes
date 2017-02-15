all: server client
server: server.o main.o
	g++ $^ -o $@ -lsctp

server.o: server.cpp
	g++ -c $< -o $@

main.o: main.cpp
	g++ -c $< -o $@

client: client.cpp
	g++ $< -o $@ -lsctp

.PHONY: clean
clean:
	rm -rf server client *.o
