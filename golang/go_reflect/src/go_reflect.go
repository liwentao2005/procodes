package main

import (
	"fmt"
	"reflect"
)

type sss struct {
	aaa string
	bbb int
}

func main() {
	// fmt.Printf("hello go!\n")
	s := &sss{"test", 111}
	fmt.Printf("%s\n", reflect.ValueOf(s).Type())
	fmt.Printf("%s\n", reflect.ValueOf(s).String())
	fmt.Printf("%s\n", reflect.ValueOf(s).Kind())
}
