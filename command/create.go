package command

import (
	"fmt"
	"os"

	"github.com/ahmadrabie/farmer-cli/config"
	"github.com/codegangsta/cli"
	"github.com/jmcvetta/napping"
	"github.com/ahmadrabie/farmer-cli/station"
)

func CreateCmd() cli.Command {
	return cli.Command{
		Name:        "create",
		Usage:       "create <Hostname>",
		Description: "Create a new Docker container with <Hostname>",
		Flags: AppFlags,
		Action: create,
	}
}

type request struct {
	Hostname   string `json:"name"`
	Repository string `json:"repo"`
	Pathspec   string `json:"pathspec"`
}

func create(context *cli.Context) {
	if !context.Args().Present() {
		fmt.Println("Do you forget to set Hostname for farmer?")
		return
	}

	req := request{
		Hostname:   context.Args().First(),
		Repository: context.String("repository"),
		Pathspec:   context.String("pathspec"),
	}

	var stream station.Stream

	s := napping.Session{}
	url := os.Getenv(config.SERVER_URL) + "/boxes"
	resp, err := s.Post(url, &req, &stream, nil)

	if err != nil {
		return
	}

	if resp.Status() == 201 {
		if err := stream.Consume(); err != nil {
			fmt.Println("Stream Consume Error", err)
		}
	}
}
