package command

import (
	"fmt"
	"os"

	"github.com/ahmadrabie/farmer-cli/config"
	"github.com/codegangsta/cli"
	"github.com/jmcvetta/napping"
	"github.com/ahmadrabie/farmer-cli/station"
)

func DeployCmd() cli.Command {
	return cli.Command{
		Name:        "deploy",
		Usage:       "deploy <Hostname>",
		Description: "deploy new changes to <Hostname>",
		Flags: AppFlags,
		Action: deploy,
	}
}

func deploy(context *cli.Context) {
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
	url := os.Getenv(config.SERVER_URL) + "/boxes/"+req.Hostname
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
