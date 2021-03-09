build: install
	@cd popup && npm install && npm run build
	@web-ext build

dev: install
	tmux new-session 'cd popup; git ls-files | entr npm run build' ';' \
		 split-window 'web-ext run'

install:
	@for f in helper/*; do \
		cp $$PWD/$$f ~/.mozilla/native-messaging-hosts/ ; \
	done

uninstall:
	@cd helper; for f in *; do \
		rm -f ~/.mozilla/native-messaging-hosts/$$f ; \
	done
