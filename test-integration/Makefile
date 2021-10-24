.PHONY: $(shell grep --no-filename -E '^([a-zA-Z_-]|\/)+:' $(MAKEFILE_LIST) | sed 's/:.*//')
SHELL = /bin/bash

all:

setup:
	rm -rf test
	mkdir -p test

generate-ex00-v1:
	cat templates/ex00.js > test/ex00.js

generate-ex00-v2:
	cat templates/ex00.js | sed 's/u: 3,/u: 5,/' > test/ex00.js

test: export NODE_DISABLE_COLORS = 1
test: setup
	make -s generate-ex00-v1
	diff --ignore-matching-lines='(.*ms)' <(npx mocha)                   logs/log1-no-snapshot.txt
	diff --ignore-matching-lines='(.*ms)' <(UPDATE_SNAPSHOT=1 npx mocha) logs/log2-update-snapshot.txt
	diff --ignore-matching-lines='(.*ms)' <(npx mocha)                   logs/log3-success.txt
	make -s generate-ex00-v2
	diff --ignore-matching-lines='(.*ms)' <(npx mocha)                   logs/log4-diff-snapshot.txt

test-update-logs: export NODE_DISABLE_COLORS = 1
test-update-logs: setup
	make -s generate-ex00-v1
	npx mocha                   > logs/log1-no-snapshot.txt || true
	UPDATE_SNAPSHOT=1 npx mocha > logs/log2-update-snapshot.txt || true
	npx mocha                   > logs/log3-success.txt || true
	make -s generate-ex00-v2
	npx mocha > logs/log4-diff-snapshot.txt || true
