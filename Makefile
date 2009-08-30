# Convert css files so they can be served 
# over ssl from https://selvbetjening.anime-kita.dk/static
selvbetjening : populate compress

create-folder :
	@if ! test -d selvbetjening; then mkdir selvbetjening; fi

populate : create-folder
	cp -R images selvbetjening
	cp -R css selvbetjening
	cp -R js selvbetjening
	cp favicon.ico selvbetjening

CSS=selvbetjening/css/
CSSC=selvbetjening/css/compressed/

CSS_TIDY=csstidy
CSS_TIDY_OPTIONS=template=highest

COMPRESSED=$(CSSC)default.css $(CSSC)main.css $(CSSC)extra.css $(CSSC)print.css $(CSSC)datepicker.css $(CSSC)uni-form.css $(CSSC)uni-form-generic.css

UNCOMPRESSED=$(CSS)default.css $(CSS)main.css $(CSS)extra.css $(CSS)print.css $(CSS)datepicker.css $(CSS)uni-form.css $(CSS)uni-form-generic.css

FILES=default.css main.css extra.css print.css datepicker.css uni-form.css uni-form-generic.css

CURURL=http://static.anime-kita.dk/v2.1/
TARGETURL=https://selvbetjening.anime-kita.dk/static/

compress : compressed-dir $(FILES)

compressed-dir :
	if test ! -d $(CSS)compressed; then mkdir $(CSS)compressed; fi

$(FILES) : 
	$(CSS_TIDY) $(CSS)$@ $(CSS_TIDY_OPTIONS) $(CSSC)$@
	sed -i 's|$(CURURL)|$(TARGETURL)|' $(CSSC)$@

clean :
	@if test -d selvbetjening; then rm -R selvbetjening; fi
