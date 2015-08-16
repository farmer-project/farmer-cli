package command

import (
	"github.com/codegangsta/cli"
	"github.com/farmer-project/farmer-cli/api"
)

func DomainRemoveCmd() cli.Command {
	return cli.Command{
		Name:        "domain-remove",
		Usage:       "<boxname> --domain=DOMANI_ADDRESS",
		Description: "Add a new domain to specific box.",
		Flags: []cli.Flag{
			cli.StringFlag{
				Name:  "domain, d",
				Usage: "Domain URL",
			},
		},
		Action: removeDomainAction,
	}
}

func removeDomainAction(context *cli.Context) {
	if !context.Args().Present() {
		println("You must specify a 'name' for the box you want to assign domain to.\nSee 'farmer domain_remove --help' for more info.")
		return
	}

	if context.String("domain") == "" {
		println("You must specify a 'domain' URL.\nSee 'farmer domain_add --help' for more info.")
		return
	}

	if err := api.Delete("/boxes/"+context.Args().First()+"/domain/"+context.String("domain"), nil); err != nil {
		println(err.Error())
		return
	}

	println("Domain " + context.String("domain") + " removed from " + context.Args().First() + ".")
}
