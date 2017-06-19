package main

import (
    "os"
    "fmt"
    "bufio"
    "math"
    "time"
)

type Point struct{X, Y float64}

type Path []Point

func (p Point)Distance(q Point) float64 {
    return math.Hypot(q.X-p.X, q.Y-p.Y)
}

func (path Path)  Distance() float64 {
    sum := 0.0
    for i := range path {
        if i > 0 {
            sum += path[i-1].Distance(path[i])
        }
    }
    return sum
}

func main() {
    counts := make(map[string]int)
    files  := os.Args[1:]
    if len(files) == 0 {
        countLines(os.Stdout, counts)
    } else {
        for _, arg := range files {
            f, err := os.Open(arg)
            if err != nil {
                fmt.Fprintf(os.Stderr, "dup2: %v\n", err)
                continue
            }
            countLines(f, counts)
            f.Close()
        }
    }
    for line, n := range counts {
        if n > 1 {
            fmt.Printf("%d\t%s\n", n, line)
        }
    }

    f := squares()
    fmt.Println(f())
    fmt.Println(f())
    fmt.Println(f())
    fmt.Println(f())
    fmt.Println(f())

    // test path
    perim := Path{
        {1, 1},
        {5, 1},
        {5, 4},
        {1, 1},
    }

    fmt.Println(perim.Distance())

    // goroutine test
    go spinner(100 * time.Millisecond)
    const n = 45
    fibN := fib(n)
    fmt.Printf("\rFibonacci(%d) = %d\n", n, fibN)
}

func countLines(f *os.File, counts map[string]int) {
    input := bufio.NewScanner(f)
    for input.Scan() {
        counts[input.Text()]++
    }
}

func squares() func() int {
    var x int
    return func() int {
        x++
        return x * x
    }
}

func spinner(delay time.Duration) {
    for {
        for _, r := range `-\|/` {
            fmt.Printf("\r%c%c", r, r)
            time.Sleep(delay)
        }
    }
}

func fib(x int) int {
    if x < 2 {
        return x
    }
    return fib(x-1) + fib(x-2)
}
