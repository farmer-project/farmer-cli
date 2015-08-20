package command

import (
	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer-cli/hub"
	"github.com/farmer-project/farmer/api/request"
)

func DeployCmd() cli.Command {
	return cli.Command{
		Name:        "deploy",
		Usage:       "<boxname> [--pathspec=BRANCH]",
		Description: "Updates a box's code from provided Git branch specifier. Note code will be pulled from repository Url you've provided when creating the box.",
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "pathspec, p",
				Usage: "Branch specifier used as the Git path when cloning the code, e.g. master, tags/v2.3",
			},
		},
		Action: deployAction,
	}
}

func deployAction(context *cli.Context) {
	if !context.Args().Present() {
		println("You must specify a 'name' for the box you want to create.\nSee 'farmer create --help' for more info.")
		return
	}

	stream := hub.Stream{}
	request := request.DeployRequest{
		Pathspec: context.String("pathspec"),
	}

	if err := api.Put("/boxes/"+context.Args().First(), &request, &stream); err != nil {
		println(err.Error())
		return
	}

	if err := stream.Consume(); err != nil {
		println("Could not consume the stream from Farmer server.")
		return
	}
}
