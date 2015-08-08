package command

import (
	"github.com/codegangsta/cli"
)

const CONTENT_TYPE = "application/json"

var AppFlags = []cli.Flag{
	cli.StringFlag{
		Name:  "repository, r",
		Usage: "Git repository URL to deploy on farmer",
	},
	cli.StringFlag{
		Name:  "pathspec, p",
		Value: "master",
		Usage: "Pattern used to limit paths in Git commands, e.g. tags/v2.3",
	},
}

type box struct {
	Name      string `json:"name"`
	RepoUrl   string `json:"repo_url"`
	PathSpec  string `json:"pathspec"`
	Image     string `json:"image"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

func CreateApp() *cli.App {
	app := cli.NewApp()
	app.Name = "farmer-cli"
	app.Version = "0.1"
	app.Usage = "Deployment system for developers"
	app.EnableBashCompletion = true
	app.Flags = AppFlags
	return app
}
