package command

import (
	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/config"
)

func ConfigureCmd() cli.Command {
	return cli.Command{
		Name:        "configure",
		Description: "(Re)configure Farmer server settings",
		Action:      configureAction,
	}
}

func configureAction(context *cli.Context) {
	config.Reconfigure()
}
