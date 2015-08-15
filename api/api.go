package api

import (
	"github.com/farmer-project/farmer-cli/config"
	"github.com/jmcvetta/napping"
	"net/http"
)

func Get(path string, params *napping.Params, result interface{}) *napping.Response {
	resp, err := newSession().Get(config.Get("ServerUrl")+path, params, &result, nil)
	checkResponseError(resp, err)

	return resp
}

func Delete(path string, result interface{}) *napping.Response {
	resp, err := newSession().Delete(config.Get("ServerUrl")+path, &result, nil)
	checkResponseError(resp, err)

	return resp
}

func Post(path string, payload, result interface{}) *napping.Response {
	resp, err := newSession().Post(config.Get("ServerUrl")+path, &payload, &result, nil)
	checkResponseError(resp, err)

	return resp
}

func Put(path string, payload, result interface{}) *napping.Response {
	resp, err := newSession().Put(config.Get("ServerUrl")+path, &payload, &result, nil)
	checkResponseError(resp, err)

	return resp
}

func checkResponseError(resp *napping.Response, err error) {
	if err != nil {
		panic("Could not send request to Farmer server. (" + err.Error() + ")")
	}

	if resp.Status() != 201 && resp.Status() != 200 {
		panic("Unexpected response from Farmer server. (" + resp.Error.(string) + ")")
	}
}

func newSession() *napping.Session {
	session := &napping.Session{}

	header := &http.Header{}
	header.Set("Content-Type", "application/json")
	session.Header = header

	return session
}
