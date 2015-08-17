package main

import (
	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/command"
	"os"
)

func createApp() *cli.App {
	app := cli.NewApp()
	app.Name = "farmer-cli"
	app.Version = "0.1"
	app.Usage = "Client for open-source PaaS project Farmer"

	return app
}

func main() {
	app := createApp()

	app.Commands = []cli.Command{
		command.CreateCmd(),
		command.DeployCmd(),
		command.ListCmd(),
		command.InspectCmd(),
		command.DestroyCmd(),
		command.ConfigureCmd(),
		command.DomainAddCmd(),
		command.DomainRemoveCmd(),
	}

	app.Run(os.Args)
}
