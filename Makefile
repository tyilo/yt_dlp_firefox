INSTALL_DIR ?= $(HOME)/.mozilla
TOR_INSTALL_DIR ?= $(HOME)/.local/share/torbrowser/tbb/x86_64/tor-browser/Browser/TorBrowser/Data/Browser/.mozilla

build: install
	@cd popup && npm install && npm run build
	@web-ext build

dev: install
	tmux new-session 'cd popup; git ls-files | entr npm run build' ';' \
		 split-window 'web-ext run'

define move_helper
	$(eval $@_NMH_PARENT_DIR = $(1))
	mkdir -p $($@_NMH_PARENT_DIR)/native-messaging-hosts
    	for f in helper/*; do \
    		sed "s#@NMH_PARENT_DIR@#$($@_NMH_PARENT_DIR)#" $$PWD/$$f > $($@_NMH_PARENT_DIR)/native-messaging-hosts/$$(basename $$f) ; \
    		chmod u+x $($@_NMH_PARENT_DIR)/native-messaging-hosts/yt_dlp_firefox ; \
    	done
endef

install:
	@$(call move_helper,$(INSTALL_DIR))

install-tor:
	@$(call move_helper, $(TOR_INSTALL_DIR))
	@if ! grep -q "\"--proxy\", \"socks5h://127.0.0.1:9150\"," $(TOR_INSTALL_DIR)/native-messaging-hosts/yt_dlp_firefox; then \
		sed -i "s#\(\"yt-dlp\",\)#\1 \"--proxy\", \"socks5h://127.0.0.1:9150\",#" $(TOR_INSTALL_DIR)/native-messaging-hosts/yt_dlp_firefox ; \
		chmod u+x $(TOR_INSTALL_DIR)/native-messaging-hosts/yt_dlp_firefox ; \
	fi
	$(eval $@_APPARMOR_TOR_PATH = /etc/apparmor.d/torbrowser.Browser.firefox)
	@if [ -f $($@_APPARMOR_TOR_PATH) ] && which apparmor_parser >/dev/null; then \
		$(eval $@_APPARMOR_BYPASSES = \
			"$(TOR_INSTALL_DIR)/native-messaging-hosts/yt_dlp_firefox rix" \
			"$(shell readlink -f $$(which python3)) rix" \
			"$(shell which yt-dlp) rix" \
			"/usr/share/dpkg/\*\* r" \
			"/usr/local/lib/ r" \
			"/etc/apt/apt.conf.d/\*\* r" \
			"/etc/ssl/certs/ca-certificates.crt r") \
		for b in $($@_APPARMOR_BYPASSES); do \
			if ! grep -q "^  $$b,$$" $($@_APPARMOR_TOR_PATH) ; then \
				sudo sed -i "s|\(  #include <local/torbrowser.Browser.firefox>\)|  $$b,\n\1|" $($@_APPARMOR_TOR_PATH) ;  \
			fi; \
		done; \
		sudo apparmor_parser -r $($@_APPARMOR_TOR_PATH) ; \
	fi

uninstall:
	@cd helper; for f in *; do \
		rm -f $(INSTALL_DIR)/native-messaging-hosts/$$f ; \
	done

.PHONY: build dev install install-tor uninstall
