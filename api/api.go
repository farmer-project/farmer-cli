package api

import (
	"errors"
	"github.com/farmer-project/farmer-cli/config"
	"github.com/jmcvetta/napping"
	"net/http"
)

func Get(path string, params *napping.Params, result interface{}) error {
	resp, err := newSession().Get(config.Get("ServerUrl")+path, params, &result, nil)
	return checkResponseError(resp, err)
}

func Delete(path string, result interface{}) error {
	resp, err := newSession().Delete(config.Get("ServerUrl")+path, &result, nil)
	return checkResponseError(resp, err)
}

func Post(path string, payload, result interface{}) error {
	resp, err := newSession().Post(config.Get("ServerUrl")+path, &payload, &result, nil)
	return checkResponseError(resp, err)
}

func Put(path string, payload, result interface{}) error {
	resp, err := newSession().Put(config.Get("ServerUrl")+path, &payload, &result, nil)
	return checkResponseError(resp, err)
}

func checkResponseError(resp *napping.Response, err error) error {
	if err != nil {
		return errors.New("Could not send request to Farmer server. (" + err.Error() + ")")
	}

	if resp.Status() != 201 && resp.Status() != 200 && resp.Status() != 204 {
		return errors.New("Unexpected response from Farmer server. (" + resp.RawText() + ")")
	}

	return nil
}

func newSession() *napping.Session {
	session := &napping.Session{}

	header := &http.Header{}
	header.Set("Content-Type", "application/json")
	session.Header = header

	return session
}
