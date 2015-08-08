package config

import (
	"fmt"
	"os"

	"github.com/BurntSushi/toml"
	"github.com/mitchellh/go-homedir"
)

const (
	SERVER_URL = "FARMER_CLIENT_SERVER_URL"
	USERNAME   = "FARMER_CLIENT_USERNAME"
	PASSWORD   = "FARMER_CLIENT_PASSWORD"

	get_server_message   = "Farmer Server URL:"
	get_username_message = "Farmer username:"
	get_password_message = "Farmer password:"

	config_name = ".farmer.cfg"
)

type FarmerConfig struct {
	Server   string
	Username string
	Password string

	configFile string
}

func LoadConfig(c *FarmerConfig) error {
	HomePath, err := homedir.Dir()
	if err != nil {
		return err
	}

	c.configFile = HomePath + "/" + config_name
	if fileExists := check(c.configFile); !fileExists {
		Reset(c)
	}

	if _, err := toml.DecodeFile(c.configFile, &c); err != nil {
		return err
	}

	return configToEnv(c)
}

func Reset(c *FarmerConfig) error {
	fmt.Println(get_server_message)
	fmt.Scanln(&c.Server)

	fmt.Println(get_username_message)
	fmt.Scanln(&c.Username)

	fmt.Println(get_password_message)
	fmt.Scanln(&c.Password)

	if fileExists := check(c.configFile); fileExists {
		if err := os.Remove(c.configFile); err != nil {
			return err
		}
	}

	return set(c)
}

func configToEnv(c *FarmerConfig) error {
	if err := os.Setenv(SERVER_URL, c.Server); err != nil {
		return err
	}

	if err := os.Setenv(USERNAME, c.Username); err != nil {
		return err
	}

	if err := os.Setenv(PASSWORD, c.Password); err != nil {
		return err
	}

	return nil
}

func check(configFile string) bool {
	if _, err := os.Stat(configFile); err == nil {
		return true
	}

	return false
}

func set(c *FarmerConfig) error {
	fo, err := os.Create(c.configFile)

	defer fo.Close()

	if err != nil {
		return err
	}
	e := toml.NewEncoder(fo)
	fmt.Println(e)
	return e.Encode(&c)
}
