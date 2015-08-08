package main

import (
	"fmt"
	"os"

	"github.com/farmer-project/farmer-cli/command"
	"github.com/farmer-project/farmer-cli/config"

	"github.com/codegangsta/cli"
)

func main() {
	err := config.LoadConfig(&config.FarmerConfig{})
	fmt.Println(err)

	app := command.CreateApp()

	app.Commands = []cli.Command{
		command.CreateCmd(),
		command.DeployCmd(),
		command.RemoveCmd(),
		command.ListCmd(),
		command.InspectCmd(),
	}

	app.Run(os.Args)
}
