package command

import (
	"github.com/codegangsta/cli"
)

var AppFlags = []cli.Flag{
	cli.StringFlag{
		Name:  "repository, repo",
		Usage: "Git repository URL to deploy on farmer",
	},
	cli.StringFlag{
		Name:  "pathspec, psp",
		Value: "master",
		Usage: "Pattern used to limit paths in Git commands, e.g. tags/v2.3",
	},
}
func CreateApp() *cli.App {
	app := cli.NewApp()
	app.Name = "farmer-cli"
	app.Version = "0.1"
	app.Usage = "Deployment system for developers"
	app.Flags = AppFlags
	return app
}


