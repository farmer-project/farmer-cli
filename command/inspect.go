package command

import (
	"os"
	"strings"
	"gopkg.in/codegangsta/cli.v1"
	"github.com/olekukonko/tablewriter"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer-cli/api/response"
)

func InspectCmd() cli.Command {
	return cli.Command{
		Name:        "inspect",
		Usage:       "<boxname>",
		Description: "Displays box's details such as repository Url, current branch specifier, state, etc.",
		Action:      inspectAction,
	}
}

func inspectAction(context *cli.Context) {
	if !context.Args().Present() {
		println("You must specify a 'name' for the box you want to create.\nSee 'farmer create --help' for more info.")
		return
	}

	box := &response.Box{}
	if err := api.Get("/boxes/"+context.Args().First(), nil, box); err != nil {
		println(err.Error())
		return
	}

	generateBoxTable(box)
}

func generateBoxTable(box *response.Box) {
	data := [][]string{}
	data = append(data, []string{
		box.Name,
		box.State,
		box.UpdateAt,
		box.Revision,
		box.RepoUrl,
		box.Pathspec,
		box.Home,
		strings.Join(box.Ports, ","),
		domainsToString(box.Domains),
	})

	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{
		"Name",
		"State",
		"UpdateAt",
		"Revision",
		"Repository",
		"Pathspec",
		"Home",
		"Ports",
		"Domains",
	})
	table.SetBorder(true)
	table.AppendBulk(data)
	table.Render()
}

func domainsToString(domains []response.Domain) string {
	var output string
	for _, domain := range domains {
		output += domain.Url + "->" + domain.Port + ", "
	}

	return output
}
