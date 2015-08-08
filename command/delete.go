package command

import (
	"fmt"
	"os"

	"github.com/ahmadrabie/farmer-cli/config"
	"github.com/codegangsta/cli"
	"github.com/jmcvetta/napping"
	"github.com/ahmadrabie/farmer-cli/station"
)

func DeleteCmd() cli.Command {
	return cli.Command{
		Name:        "delete",
		Usage:       "delete <Hostname>",
		Description: "delete box <Hostname> and it's associated entities",
		Flags: AppFlags,
		Action: delete,
	}
}

func delete(context *cli.Context) {
	if !context.Args().Present() {
		fmt.Println("Do you forget to set Hostname for farmer?")
		return
	}
	var stream station.Stream

	s := napping.Session{}
	hostname :=   context.Args().First()
	url := os.Getenv(config.SERVER_URL) + "/boxes" + hostname
	resp, err := s.Delete(url, &stream, nil)

	if err != nil {
		return
	}

	if resp.Status() == 200 {
		if err := stream.Consume(); err != nil {
			fmt.Println("Stream Consume Error", err)
		}
	}
}
