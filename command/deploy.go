package command

import (
	"gopkg.in/codegangsta/cli.v1"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer-cli/api/request"
	"github.com/farmer-project/farmer-cli/hub"
)

func DeployCmd() cli.Command {
	return cli.Command{
		Name:        "deploy",
		Usage:       "<boxname> [--repo=REPOSITORY_URL] [--pathspec=BRANCH]",
		Description: "Updates a box's code from provided Git branch specifier. Note code will be pulled from repository Url you've provided when creating the box.",
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "repo, r",
				Usage: "Git repository URL to clone on box",
			},
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
		RepoUrl:  context.String("repo"),
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
