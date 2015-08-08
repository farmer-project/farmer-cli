package command

import (
	"fmt"
	"net/http"
	"os"

	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/config"
	"github.com/farmer-project/farmer-cli/station"
	"github.com/jmcvetta/napping"
)

func DeployCmd() cli.Command {
	return cli.Command{
		Name:        "deploy",
		Usage:       "deploy <Hostname>",
		Description: "deploy new changes to <Hostname>",
		Flags:       AppFlags,
		Action:      deploy,
	}
}

func deploy(context *cli.Context) {
	if !context.Args().Present() {
		fmt.Println("Do you forget to set Hostname for farmer?")
		return
	}

	req := request{
		Name:     context.Args().First(),
		RepoUrl:  context.String("repository"),
		PathSpec: context.String("pathspec"),
	}

	var stream station.Stream

	s := napping.Session{}
	h := &http.Header{}
	h.Set("Content-Type", CONTENT_TYPE)
	s.Header = h
	url := os.Getenv(config.SERVER_URL) + "/boxes/" + req.Name
	resp, err := s.Put(url, &req, &stream, nil)

	if err != nil {
		return
	}

	if resp.Status() == 200 {
		if err := stream.Consume(); err != nil {
			fmt.Println("Stream Consume Error", err)
		}
	}
}
