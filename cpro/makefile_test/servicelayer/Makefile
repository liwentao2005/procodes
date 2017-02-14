all:
	@echo "Makefile in servicelayer"
	tar -czvf servicelayer.tar.gz ./servicelayer.py

.PHONY: clean
clean:
	rm -rf servicelayer.tar.gz

.PHONY: check
check:
	@find . -name "*.json" -print0 | xargs -0 ./bin/verify_json.py
