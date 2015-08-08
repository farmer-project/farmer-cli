package command

import (
	"net/http"
	"os"

	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/config"
	"github.com/jmcvetta/napping"
	"github.com/olekukonko/tablewriter"
)

func ListCmd() cli.Command {
	return cli.Command{
		Name:        "list",
		Usage:       "list boxes",
		Description: "list all boxes and display box info",
		Flags:       AppFlags,
		Action:      list,
	}
}

func list(context *cli.Context) {
	reqArr := []*box{}
	s := napping.Session{}
	h := &http.Header{}
	h.Set("Content-Type", CONTENT_TYPE)
	s.Header = h
	url := os.Getenv(config.SERVER_URL) + "/boxes"
	resp, err := s.Get(url, nil, &reqArr, nil)
	if err != nil {
		return
	}

	if resp.Status() == 200 {

		data := [][]string{}
		for _, item := range reqArr {
			data = append(data, []string{
				item.Name,
				item.RepoUrl,
				item.PathSpec,
				item.Image,
				item.Status,
				item.CreatedAt,
				item.UpdatedAt,
			})
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
