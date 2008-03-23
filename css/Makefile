# Create SSL enabled css files

ssl : compressed ssl-dir compressed\/ssl\/default.css compressed\/ssl\/extra.css compressed\/ssl\/main.css

ssl-dir :
	if test ! -d compressed/ssl; then mkdir compressed/ssl; fi

compressed\/ssl\/default.css : compressed\/default.css
	sed 's/http:\/\//https:\/\//' compressed/default.css > compressed/ssl/default.css

compressed\/ssl\/extra.css : compressed\/extra.css
	sed 's/http:\/\//https:\/\//' compressed/extra.css > compressed/ssl/extra.css

compressed\/ssl\/main.css : compressed\/main.css
	sed 's/http:\/\//https:\/\//' compressed/main.css > compressed/ssl/main.css

# Compression

CSS_TIDY = csstidy
CSS_TIDY_OPTIONS = template=highest

compressed : compressed-dir compressed\/default.css compressed\/main.css compressed\/extra.css compressed\/print.css compressed\/datepicker.css compressed\/uni-form.css compressed\/uni-form-generic.css

compressed-dir :
	if test ! -d compressed; then mkdir compressed; fi

compressed\/default.css : default.css
	$(CSS_TIDY) default.css $(CSS_TIDY_OPTIONS) compressed/default.css

compressed\/main.css : main.css
	$(CSS_TIDY) main.css $(CSS_TIDY_OPTIONS) compressed/main.css

compressed\/extra.css : extra.css
	$(CSS_TIDY) extra.css $(CSS_TIDY_OPTIONS) compressed/extra.css

compressed\/print.css : print.css
	$(CSS_TIDY) print.css $(CSS_TIDY_OPTIONS) compressed/print.css

compressed\/datepicker.css : datepicker.css
	$(CSS_TIDY) datepicker.css $(CSS_TIDY_OPTIONS) compressed/datepicker.css

compressed\/uni-form.css : uni-form.css
	$(CSS_TIDY) uni-form.css $(CSS_TIDY_OPTIONS) compressed/uni-form.css

compressed\/uni-form-generic.css : uni-form-generic.css
	$(CSS_TIDY) uni-form-generic.css $(CSS_TIDY_OPTIONS) compressed/uni-form-generic.css

# general 
clean :
	if test -d compressed; then rm -R compressed; fi
