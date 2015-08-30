package response

type Box struct {
	Name string `json:"name"`

	RepoUrl  string `json:"repo_url"`
	Pathspec string `json:"pathspec"`

	ContainerID   string `json:"container_id"`
	State         string `json:"state"`
	Hostname      string `json:"hostname"`
	CgroupParent  string `json:"cgroupParent"`
	CodeDirectory string `json:"code_directory"`

	RevisionNumber int `json:"revision"`

	FarmerConfig
	Domains []Domain `json:"domains"`
}

type FarmerConfig struct {
	Image string   `json:"image"`
	Home  string   `json:"home"`
	Ports []string `json:"ports"`
}

type Domain struct {
	Url  string `json:"url"`
	Port string `json:"port"`
}
