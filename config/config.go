package config

import (
	"fmt"
	"os"

	"github.com/BurntSushi/toml"
	"github.com/mitchellh/go-homedir"
	"reflect"
	"strings"
)

type FarmerConfig struct {
	ServerUrl string
}

var (
	configPath   string
	farmerConfig FarmerConfig
	reflection   reflect.Value
)

func init() {
	homePath, err := homedir.Dir()
	if err != nil {
		panic(err)
	}
	configPath = homePath + "/.farmer.cfg"

	// Make sure it exists and contains settings
	ensureConfig()

	// Load the config
	if _, err := toml.DecodeFile(configPath, &farmerConfig); err != nil {
		panic(err)
	}

	reflection = reflect.ValueOf(farmerConfig)
}

func Get(name string) string {
	field := reflect.Indirect(reflection).FieldByName(name)
	return string(field.String())
}

func Reconfigure() {
	fo, err := os.Create(configPath)
	defer fo.Close()

	if err != nil {
		panic(err)
	}

	fmt.Print("Farmer API Server URL: ")
	fmt.Scanln(&farmerConfig.ServerUrl)
	farmerConfig.ServerUrl = strings.TrimRight(farmerConfig.ServerUrl, "/")

	err = toml.NewEncoder(fo).Encode(&farmerConfig)
	if err != nil {
		panic(err)
	}

	fmt.Println("New configuration successfully saved on: " + configPath)
}

func ensureConfig() {
	if _, err := os.Stat(configPath); err != nil {
		Reconfigure()
	}
}
