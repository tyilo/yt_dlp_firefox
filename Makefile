INSTALL_DIR ?= $(HOME)/.mozilla
TOR_INSTALL_DIR ?= $(HOME)/.local/share/torbrowser/tbb/x86_64/tor-browser/Browser/TorBrowser/Data/Browser/.mozilla

build: install
	@cd popup && npm install && npm run build
	@npx web-ext build

dev: install
	tmux new-session 'git ls-files | entr npm run build' ';' \
		 split-window 'npx web-ext run'

define move_helper
	$(eval $@_NMH_PARENT_DIR = $(1))
	mkdir -p $($@_NMH_PARENT_DIR)/native-messaging-hosts
    	for f in helper/*; do \
    		sed "s#@HOME@#$($@_NMH_PARENT_DIR)#" $$PWD/$$f > $($@_NMH_PARENT_DIR)/native-messaging-hosts/$$(basename $$f) ; \
    		chmod u+x $($@_NMH_PARENT_DIR)/native-messaging-hosts/yt_dlp_firefox ; \
    	done
endef

define remove_helper
	$(eval $@_NMH_PARENT_DIR = $(1))
	cd helper; for f in *; do \
    	rm -f $($@_NMH_PARENT_DIR)/native-messaging-hosts/$$f ; \
    done
endef

install:
	@$(call move_helper,$(INSTALL_DIR))

install-tor:
	@$(call move_helper, $(TOR_INSTALL_DIR))
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
	@$(call remove_helper,$(INSTALL_DIR))

uninstall-tor:
	@$(call remove_helper,$(TOR_INSTALL_DIR))

.PHONY: build dev install install-tor uninstall
