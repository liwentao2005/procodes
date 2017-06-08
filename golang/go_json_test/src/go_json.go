package main

import (
    "os"
    "fmt"
    "encoding/json"
)

type ColorGroup struct {
    ID      int
    Name    string
    Colors  []string
}

func main() {
    fmt.Println("hello go!")

    group := ColorGroup{
        ID:     1,
        Name:   "Reds",
        Colors: []string{"Crimson", "Red", "Ruby"},
    }

    b, err := json.Marshal(group)
    if err != nil {
        fmt.Println("error:", err)
    }
    os.Stdout.Write(b)
    fmt.Printf("\n")

    var colorg ColorGroup
    err = json.Unmarshal(b, &colorg)
    if err != nil {
        fmt.Println("error:", err)
    }
    fmt.Printf("%+v\n", colorg)
}
