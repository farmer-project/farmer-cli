package command

import (
	"fmt"
	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/api"
)

func DestroyCmd() cli.Command {
	return cli.Command{
		Name:        "destroy",
		Usage:       "<boxname>",
		Description: "Completely removes a box's code and destroys its container. Warning! Irreversible action.",
		Action:      destroyAction,
	}
}

func destroyAction(context *cli.Context) {
	if !context.Args().Present() {
		panic("You must specify a 'name' for the box you want to create.\nSee 'farmer create --help' for more info.")
	}

	name := context.Args().First()

	api.Delete("/boxes/"+name, nil)
	fmt.Printf("Box '%s' is destroyed successfully.", name)
}
