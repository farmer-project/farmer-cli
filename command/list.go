package command

import (
	"os"
	"encoding/json"

	"gopkg.in/codegangsta/cli.v1"
	"github.com/olekukonko/tablewriter"

	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer-cli/api/response"
)

func ListCmd() cli.Command {
	return cli.Command{
		Name:        "list",
		Usage:       "[--type=TYPE]",
		Description: "List all created boxes.",
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "type, t",
				Usage: "Output type table or json(default=table).",
			},
		},
		Action:      listAction,
	}
}

func listAction(context *cli.Context) {
	boxes := []*response.Box{}
	if err := api.Get("/boxes", nil, &boxes); err != nil {
		println(err.Error())
		return
	}

	if context.String("type") == "json" {
		json, _ := json.MarshalIndent(boxes, "", "    ")
		println(string(json))
	} else {
		generateBoxesTable(boxes)
	}
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
		"Updated At",
	})
	table.SetBorder(true)
	table.AppendBulk(data)
	table.Render()
}
