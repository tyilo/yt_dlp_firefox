nmh_user_specific_path:="$$HOME/.mozilla/native-messaging-hosts"
nmh_system_wide_path:="/usr/lib/mozilla/native-messaging-hosts"
local_system_bin_path:="/usr/local/bin"

build: install
	@cd popup && npm install && npm run build
	@web-ext build

dev: install
	tmux new-session 'cd popup; git ls-files | entr npm run build' ';' \
		 split-window 'web-ext run'

install-user-home:
	@mkdir -p $(nmh_user_specific_path)
	@for f in helper/*; do \
		sed "s#@HOME@#$$HOME#" $$PWD/$$f > $(nmh_user_specific_path)/$$(basename $$f) ; \
		chmod u+x $(nmh_user_specific_path)/yt_dlp_firefox ; \
	done

install-system-wide:
	@mkdir -p $(nmh_system_wide_path)
	@sed "s#@HOME@/.mozilla/native-messaging-hosts#$(local_system_bin_path)#" helper/yt_dlp_firefox.json > $(nmh_system_wide_path)/yt_dlp_firefox.json
	@cp helper/yt_dlp_firefox $(local_system_bin_path)/
	@chmod +x $(local_system_bin_path)/yt_dlp_firefox

install:
ifneq ($(shell id -u), 0)
	@echo "Performing installation to user specific home directory, if you like to install it system wide, you need to execute it with superuser rights"
	$(MAKE) install-user-home
else
	@echo "Performing installation system wide, it will be available for all users"
	$(MAKE) install-system-wide
endif

uninstall-user-home:
	@cd helper; for f in *; do \\
		rm -f $(nmh_user_specific_path)/$$f ; \
	done

uninstall-system-wide:
	@cd helper; for f in *; do \
		rm -f $(nmh_system_wide_path)/$$f ; \
	done
	@rm -f $(local_system_bin_path)/yt_dlp_firefox

uninstall:
ifneq ($(shell id -u), 0)
	@echo "Performing uninstallation from user specific home directory, if you like to uninstall it system wide, you need to execute it with superuser rights"
	$(MAKE) uninstall-user-home
else
	@echo "Performing uninstallation system wide"
	$(MAKE) uninstall-system-wide
endif

.PHONY: build dev install uninstall
