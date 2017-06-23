package main

import (
	"log"
)

type User struct {
	Name  string
	Email string
}

type Notifier interface {
	Notify() error
}

func (u *User) Notify() error {
	log.Printf("User: Sending User Email to: %s<%s>\n",
		u.Name,
		u.Email)
	return nil
}

func SendNotification(notify Notifier) error {
	return notify.Notify()
}

func main() {
	user := User{
		Name:  "wentao",
		Email: "wentao@126.com",
	}

	SendNotification(&user)
}
