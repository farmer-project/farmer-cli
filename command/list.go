package command

import (
	"os"
	"gopkg.in/codegangsta/cli.v1"
	"github.com/olekukonko/tablewriter"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer-cli/api/response"
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
			item.State,
			item.RepoUrl,
			item.Pathspec,
			item.UpdateAt,
		})
	}

	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{
		"Name",
		"State",
		"Repository",
		"Pathspec",
		"Update At",
	})
	table.SetBorder(true)
	table.AppendBulk(data)
	table.Render()
}
