# Farmer Client
Command-line program to manage a [Farmer server](https://github.com/farmer-project/farmer) instance.

## Installation
You need to run `go get` to build and run `farmer-cli`:
```sh
go get github.com/farmer-project/farmer-cli
```

## Important Note
Make sure you have an already running [Farmer server](https://github.com/farmer-project/farmer) read its README.md, because before you can create your boxes you need to [**know about `.farmer.yml`**](https://github.com/farmer-project/farmer/blob/master/docs/farmer.yml.md) file

## Usage
First you need to configure your client. (You will need your `Farmer server API URL` after you've had a successful [farmer server installation](https://github.com/farmer-project/farmer#quick-installation).)
```sh
farmer-cli configure
```

### Create a Box
To create a box you need to specify a unique `name` and a `repository url` along with a git `pathspec` which can be a specific *branch* or *tag*.

Some examples are:
```sh
farmer-cli create alice_app --repository=https://github.com/foo/app.git --pathspec=tags/v0.2
farmer-cli create bob_app -r https://github.com/foo/app.git -p master
farmer-cli create carol_app --repository=https://github.com/foo/app.git # Uses "master" branch by default.
```

### Assign a Domain to a Box
Any box can have as many domains as you like using domain command like below:
```sh
farmer-cli domain-add alice_app --domain=alice-app.com --port=8080
farmer-cli domain-add bob_app --domain=bob-app.com # port 80 by default.

farmer-cli domain-remove alice_app --domain=alice-app.com
```

### Deploy on a Box
Deploying on a box means you want to upgrade that box's source code to simply fetch new changes of the branch that this box is created upon. You provide a new `pathspec` (git branch or a git tag) and farmer fetches the new code and runs the `deploy` script if it is defined in [.farmer.yml](https://github.com/farmer-project/farmer/blob/master/docs/farmer.yml.md)
```sh
farmer-cli deploy alice_app --pathspec=tags/v3.4
farmer-cli deploy bob_app --pathspec=feature/my-new-feature
```

### Destroy a Box
Completely removes a box and its cloned code, database and user created content if any.
```sh
farmer-cli destroy carol_app
```

### List of all Boxes
Lists all created boxes along with their state if they're running or not.
```sh
farmer-cli list
```
