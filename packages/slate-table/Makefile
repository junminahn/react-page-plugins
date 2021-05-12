SHELL := /usr/bin/env bash

.PHONY: publish
publish:
	yarn build
	npm publish --access public
	yarn sync-version
