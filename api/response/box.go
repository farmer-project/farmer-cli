package response

type Box struct {
	Name     string          `json:"name"`
	State    string          `json:"state"`
	RepoUrl  string          `json:"repo_url"`
	Pathspec string          `json:"pathspec"`
	Image    string          `json:"image"`
	Home     string          `json:"home"`
	Ports    []string        `json:"ports"`
	Domains  []Domain `json:"domains"`
	Revision int          `json:"revision"`
	UpdateAt string          `json:"update_at"`
}

type Domain struct {
	Url   string `json:"url"`
	Port  string `json:"port"`
}