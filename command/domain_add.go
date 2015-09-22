package command

import (
	"gopkg.in/codegangsta/cli.v1"
	"github.com/farmer-project/farmer-cli/api"
	"github.com/farmer-project/farmer/api/request"
)

func DomainAddCmd() cli.Command {
	return cli.Command{
		Name:        "domain-add",
		Usage:       "<boxname> --domain=DOMAIN_ADDRESS [--port=PORT_NUMBER]",
		Description: "Add a new domain to specific box.",
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "domain, d",
				Usage: "Domain URL",
			},
			cli.StringFlag{
				Name:  "port",
				Value: "80",
				Usage: "Port number",
			},
		},
		Action: addDomainAction,
	}
}

func addDomainAction(context *cli.Context) {
	if !context.Args().Present() {
		println("You must specify a 'name' for the box you want to assign domain to.\nSee 'farmer domain_add --help' for more info.")
		return
	}

	if context.String("domain") == "" {
		println("You must specify a 'domain' URL.\nSee 'farmer domain_add --help' for more info.")
		return
	}

	request := request.Domain{
		Url:  context.String("domain"),
		Port: context.String("port"),
	}

	if err := api.Post("/boxes/"+context.Args().First()+"/domain", &request, nil); err != nil {
		println(err.Error())
		return
	}

	println("Domain " + context.String("domain") + " assigned to port " + context.String("port") + " of box " + context.Args().First() + ".")
}
