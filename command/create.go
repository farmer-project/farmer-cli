package command

import (
	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer-cli/hub"
	"github.com/farmer-project/farmer-cli/api/request"
)

func CreateCmd() cli.Command {
	return cli.Command{
		Name:        "create",
		Usage:       "<boxname> --repo=REPOSITORY_URL [--pathspec=BRANCH]",
		Description: "Create a new box with given name and clone code from provided git repository.",
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "repo, r",
				Usage: "Git repository URL to clone on box",
			},
			cli.StringFlag{
				Name:  "pathspec, p",
				Value: "master",
				Usage: "Branch specifier used as the Git path when cloning the code, e.g. master, tags/v2.3",
			},
		},
		Action: createAction,
	}
}

func createAction(context *cli.Context) {
	if !context.Args().Present() {
		println("You must specify a 'name' for the box you want to create.\nSee 'farmer create --help' for more info.")
		return
	}

	if context.String("repo") == "" {
		println("You must specify a 'repo' (Git repository Url) to clone code on the box.\nSee 'farmer create --help' for more info.")
		return
	}

	if context.String("pathspec") == "" {
		println("Warning: Box will clone 'master' branch of the provided repository.")
		return
	}

	stream := hub.Stream{}
	request := request.CreateRequest{
		Name:     context.Args().First(),
		RepoUrl:  context.String("repo"),
		Pathspec: context.String("pathspec"),
	}

	if err := api.Post("/boxes", &request, &stream); err != nil {
		println(err.Error())
		return
	}

	if err := stream.Consume(); err != nil {
		println("Could not consume the stream from Farmer server.")
		return
	}
}
