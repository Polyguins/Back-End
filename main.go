package main

import (
	chat "github.com/polyguins/backend/server/chat"
	video "github.com/polyguins/backend/server/video"
	"log"
	"net/http"
)

func main() {
	video.AllRooms.Init()
	hub := chat.NewHub()
	go hub.Run()

	http.HandleFunc("/create", video.CreateRoomRequestHandler)
	http.HandleFunc("/join", video.JoinRoomRequestHandler)
	http.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {
		chat.ServeWs(hub, w, r)
	})

	log.Println("Server started on Port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
