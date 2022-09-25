build: install
	@cd popup && npm install && npm run build
	@web-ext build

dev: install
	tmux new-session 'cd popup; git ls-files | entr npm run build' ';' \
		 split-window 'web-ext run'

install:
	@for f in helper/*; do \
		sed "s#@HOME@#$$HOME#" $$PWD/$$f > ~/.mozilla/native-messaging-hosts/$$(basename $$f) ; \
	done

uninstall:
	@cd helper; for f in *; do \
		rm -f ~/.mozilla/native-messaging-hosts/$$f ; \
	done

.PHONY: build dev install uninstall
