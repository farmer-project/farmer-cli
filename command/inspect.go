package command

import (
	"fmt"
	"net/http"
	"os"

	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/config"
	"github.com/jmcvetta/napping"
	"github.com/olekukonko/tablewriter"
)

func InspectCmd() cli.Command {
	return cli.Command{
		Name:        "inspect",
		Usage:       "inspect box data <Hostname>",
		Description: "inspect deatail data of box <Hostname>",
		Flags:       AppFlags,
		Action:      inspect,
	}
}

func inspect(context *cli.Context) {
	if !context.Args().Present() {
		fmt.Println("Do you forget to set Hostname for farmer?")
		return
	}

	req := box{}
	name := context.Args().First()
	s := napping.Session{}
	h := &http.Header{}
	h.Set("Content-Type", CONTENT_TYPE)
	s.Header = h
	url := os.Getenv(config.SERVER_URL) + "/boxes/" + name
	resp, err := s.Get(url, nil, &req, nil)

	if err != nil {
		return
	}

	if resp.Status() == 200 {
		data := [][]string{
			[]string{
				req.Name,
				req.RepoUrl,
				req.PathSpec,
				req.Image,
				req.Status,
				req.CreatedAt,
				req.UpdatedAt,
			},
		}
		table := tablewriter.NewWriter(os.Stdout)
		table.SetHeader([]string{
			"Name",
			"Repository",
			"Pathspec",
			"Image",
			"Status",
			"createdAt",
			"UpdatedAt",
		})
		table.SetBorder(true)
		table.AppendBulk(data)
		table.Render()
	}
}
