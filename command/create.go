package command

import (
	"fmt"
	"net/http"
	"os"

	"github.com/farmer-project/farmer-cli/config"
	"github.com/farmer-project/farmer-cli/station"

	"github.com/codegangsta/cli"
	"github.com/jmcvetta/napping"
)

func CreateCmd() cli.Command {
	return cli.Command{
		Name:        "create",
		Usage:       "create <Hostname>",
		Description: "Create a new Docker container with <Hostname>",
		Flags:       AppFlags,
		Action:      create,
	}
}

type request struct {
	Name     string `json:"name"`
	RepoUrl  string `json:"repo_url"`
	PathSpec string `json:"pathspec"`
}

func create(context *cli.Context) {
	if !context.Args().Present() {
		fmt.Println("Do you forget to set Hostname for farmer?")
		return
	}

	req := request{
		Name:     context.Args().First(),
		RepoUrl:  context.String("repository"),
		PathSpec: context.String("pathspec"),
	}

	stream := station.Stream{}

	s := napping.Session{}
	h := &http.Header{}
	h.Set("Content-Type", CONTENT_TYPE)
	s.Header = h
	url := os.Getenv(config.SERVER_URL) + "/boxes"
	resp, err := s.Post(url, &req, &stream, nil)

	if err != nil {
		return
	}
	fmt.Println(stream)
	if resp.Status() == 201 {
		if err := stream.Consume(); err != nil {
			fmt.Println("Stream Consume Error", err)
		}
	}
}
