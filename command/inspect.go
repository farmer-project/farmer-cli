package command

import (
	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer/farmer"
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
		panic("You must specify a 'name' for the box you want to create.\nSee 'farmer create --help' for more info.")
	}

	box := &farmer.Box{}
	api.Get("/boxes/"+context.Args().First(), nil, box)

	generateBoxesTable(
		[]*farmer.Box{
			box,
		},
	)
}
