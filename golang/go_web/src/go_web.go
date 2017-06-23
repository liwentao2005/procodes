package main

import (
	"bufio"
	"fmt"
	"image"
	"image/color"
	"image/gif"
	"io"
	"log"
	"math"
	"math/rand"
	"net/http"
	"os"
	"strings"
)

var palette = []color.Color{color.White, color.Black}

const (
	whiteIndex = 0
	blackIndex = 1
)

func main() {
	http.HandleFunc("/", handleIndex)
	http.HandleFunc("/gif", handleGif)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleGif(w http.ResponseWriter, r *http.Request) {
	//fmt.Fprintf(w, "URL.Path = %q\n", r.URL.Path)
	lissajous(w)
}

func lissajous(out io.Writer) {
	const (
		cycles  = 5
		res     = 0.001
		size    = 100
		nframes = 64
		delay   = 8
	)
	freq := rand.Float64() * 3.0
	anim := gif.GIF{LoopCount: nframes}
	phase := 0.0
	for i := 0; i < nframes; i++ {
		rect := image.Rect(0, 0, 2*size+1, 2*size+1)
		img := image.NewPaletted(rect, palette)
		for t := 0.0; t < cycles*2*math.Pi; t += res {
			x := math.Sin(t)
			y := math.Sin(t*freq + phase)
			img.SetColorIndex(size+int(x*size+0.5), size+int(y*size+0.5),
				blackIndex)
		}
		phase += 0.1
		anim.Delay = append(anim.Delay, delay)
		anim.Image = append(anim.Image, img)
	}
	gif.EncodeAll(out, &anim)
}

// handle 2
func handleIndex(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	if strings.Contains(path[1:], "") {
		fmt.Fprintf(w, getHtmlFile("index.html"))
	} else {
		if strings.Contains(path[1:], ".html") {
			w.Header().Set("content-type", "text/html")
			fmt.Fprintf(w, getHtmlFile(path[1:]))
		}
		if strings.Contains(path[1:], ".css") {
			w.Header().Set("content-type", "text/css")
			fmt.Fprintf(w, getHtmlFile(path[1:]))
		}
		if strings.Contains(path[1:], ".js") {
			w.Header().Set("content-type", "text/javascript")
			fmt.Fprintf(w, getHtmlFile(path[1:]))
		}
		if strings.Contains(path[1:], "") {
			fmt.Print(strings.Contains(path[1:], ""))
		}
	}
}

func getHtmlFile(path string) (fileHtml string) {
	file, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	rd := bufio.NewReader(file)
	for {
		line, err := rd.ReadString('\n')

		if err != nil || io.EOF == err {
			break
		}
		fileHtml += line
	}
	return fileHtml
}
