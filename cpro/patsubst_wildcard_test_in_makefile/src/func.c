#include "func.h"

int add(int a, int b) {
    return a+b;
}

int sub(int a, int b) {
    return a-b;
}

int mul(int a, int b) {
    return a*b;
}

int div2(int a, int b) {
    if (b != 0){
        return a/b;
    } else {
        printf("error!\n");
        return 1;
    }
}
