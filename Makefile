up:
	npm version patch --no-git-tag-version; \
	git status; \
	git add .; \
	VERSION=$$(node -p "require('./package.json').version") \
	read -p "Mensagem do release: " m; \
	git commit -m "release: v$$VERSION - $$m"; \
	npm publish --access public