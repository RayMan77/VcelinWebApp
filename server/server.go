package main

import (
	"github.com/gin-gonic/gin"
	"vcelin/server/api"
	_ "vcelin/server/db"
	"gopkg.in/gin-contrib/cors.v1"
	"time"
)

func main() {
	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:true,
		AllowMethods:     []string{"PUT", "POST","GET","DELETE"},
		AllowHeaders:     []string{"token","cache-control" ,"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge: 12 * time.Hour,
	}))

	api.InitKeys()
	//db.InitDb()

	authorized := router.Group("/vcelin")
	authorized.Use(api.AuthRequired())
	{
		authorized.POST("/api/users", api.CreateUser)
		authorized.PUT("/api/users/:id", api.UpdateUser)
		authorized.DELETE("/api/users/:id", api.DeleteUser)

		authorized.GET("/api/users", api.GetUsers)
		authorized.GET("/api/users/:id", api.GetUser)

		authorized.POST("/api/posts", api.CreatePost)
		authorized.PUT("/api/posts/:id", api.UpdatePost)
		authorized.DELETE("/api/posts/:id", api.DeletePost)

		authorized.GET("/api/posts/:id", api.FetchSinglePost)
		authorized.GET("/api/posts", api.FetchAllPosts)
		authorized.GET("/api/postspage/:id", api.FetchPostsOnPage)



		authorized.POST("/api/comments", api.CreateComment)
		authorized.PUT("/api/comments/:id", api.UpdateComment)
		authorized.DELETE("/api/comments/:id", api.DeleteComment)

		authorized.GET("/api/comments/:id", api.FetchSingleComment)
		authorized.GET("/api/comments", api.FetchAllComments)
		authorized.GET("/api/post/:id/comments", api.FetchCommentsForPost)
		authorized.GET("/api/commentspage/:id", api.FetchCommentsOnPage)

	}

	v1 := router.Group("/vcelin")
	{
		v1.POST("/api/login", api.Login)
		v1.POST("/api/register", api.Register)
	}
	router.Run(":5513")
}



