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

func RemoveCmd() cli.Command {
	return cli.Command{
		Name:        "remove",
		Usage:       "remove <Hostname>",
		Description: "delete box <Hostname> and it's associated entities",
		Flags:       AppFlags,
		Action:      remove,
	}
}

func remove(context *cli.Context) {
	if !context.Args().Present() {
		fmt.Println("Do you forget to set Hostname for farmer?")
		return
	}
	var stream station.Stream

	s := napping.Session{}
	h := &http.Header{}
	h.Set("Content-Type", CONTENT_TYPE)
	s.Header = h
	name := context.Args().First()
	url := os.Getenv(config.SERVER_URL) + "/boxes" + name
	resp, err := s.Delete(url, &stream, nil)

	if err != nil {
		return
	}
	if resp.Status() == 200 {
		fmt.Printf("%s removed successfully", name)
	}
}
