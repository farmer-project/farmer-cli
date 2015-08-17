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
		println("You must specify a 'name' for the box you want to create.\nSee 'farmer create --help' for more info.")
		return
	}

	name := context.Args().First()

	if err := api.Delete("/boxes/"+name, nil); err != nil {
		println(err.Error())
		return
	}

	fmt.Printf("Box '%s' is destroyed successfully. \n", name)
}
