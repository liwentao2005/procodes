#include <stdio.h>
#include <ucontext.h>
#include <unistd.h>

int main(int argc, const char *argv[]) {
    ucontext_t context;

    getcontext(&context);
    puts("hello coroutine");
    sleep(1);
    setcontext(&context);
    return 0;
}
