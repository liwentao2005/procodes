package main

import (
	"github.com/devfeel/dotweb"
)

func main() {
	dotapp := dotweb.New()
	dotapp.HttpServer.GET("/hello", func(ctx dotweb.Context) error {
		_, err := ctx.WriteString("hello golang!")
		return err
	})
	dotapp.StartServer(8080)
}
