package main

import (
	"github.com/devfeel/dotweb"
)

func main() {
	dotapp := dotweb.New()
	dotapp.HttpServer.GET("/hello/:name", func(ctx dotweb.Context) error {
		_, err := ctx.WriteString("hello " + ctx.GetRouterName("name"))
		return err
	})

	dotapp.HttpServer.GET("/news/:category/:newsid", func(ctx dotweb.Context) error {
		category := ctx.GetRouterName("category")
		newsid := ctx.GetRouterName("newsid")
		_, err := ctx.WriteString("news info: category=" + category + " newsid=" + newsid)
		return err
	})
	dotapp.StartServer(8080)
}
