package main

import (
	"os"

	"github.com/codegangsta/cli"
	"github.com/ahmadrabie/farmer-cli/command"
	"github.com/ahmadrabie/farmer-cli/config"
	"fmt"
)

func main() {
	err := config.LoadConfig(&config.FarmerConfig{})
	fmt.Println(err)

	app := command.CreateApp()

	app.Commands = []cli.Command{
		command.CreateCmd(),
		command.DeployCmd(),
		command.DeleteCmd(),
		command.ListCmd(),
	}

	app.Run(os.Args)
}
