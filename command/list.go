package command

import (
	"os"

	"github.com/ahmadrabie/farmer-cli/config"
	"github.com/codegangsta/cli"
	"github.com/jmcvetta/napping"
	"github.com/olekukonko/tablewriter"
)

func ListCmd() cli.Command {
	return cli.Command{
		Name:        "list",
		Usage:       "list All",
		Description: "list all boxes",
		Flags: AppFlags,
		Action: list,
	}
}

func list(context *cli.Context) {
	req := []struct{
		Name string
		Repository string
		Pathspec string
		ContainerId string
	}
	s := napping.Session{}
	url := os.Getenv(config.SERVER_URL) + "/boxes"
	resp, err := s.Get(url, &req, nil, nil)

	if err != nil {
		return
	}


	if resp.Status() == 200 {

		data := [][]string{}
		for _, value := range &req {
			data = append(data,[]string{value.Name, value.Repository, value.Pathspec, value.ContainerId})
		}
		table := tablewriter.NewWriter(os.Stdout)
		table.SetHeader([]string{"Name", "Repository", "Pathspec", "ContainerId"})
		table.SetBorder(true)
		table.AppendBulk(data)
		table.Render()
	}
}
