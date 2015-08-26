package command

import (
	"os"

	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer-cli/api/response"
	"github.com/olekukonko/tablewriter"
)

func ListCmd() cli.Command {
	return cli.Command{
		Name:        "list",
		Description: "List all created boxes.",
		Action:      listAction,
	}
}

func listAction(context *cli.Context) {
	boxes := []*response.Box{}
	if err := api.Get("/boxes", nil, &boxes); err != nil {
		println(err.Error())
		return
	}

	generateBoxesTable(boxes)
}

func generateBoxesTable(boxes []*response.Box) {
	data := [][]string{}

	for _, item := range boxes {
		data = append(data, []string{
			item.Name,
			item.RepoUrl,
			item.Pathspec,
			item.Image,
			item.State,
		})
	}

	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{
		"Name",
		"Repository",
		"Pathspec",
		"Image",
		"State",
	})
	table.SetBorder(true)
	table.AppendBulk(data)
	table.Render()
}
