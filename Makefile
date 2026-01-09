up:
	git status
	@read -p "Mensagem do release: " m; \
	git add .; \
	npm version patch --no-git-tag-version; \
	VERSION=$$(node -p "require('./package.json').version"); \
	git commit -m "release: v$$VERSION - $$m"; \
	npm publish --access public