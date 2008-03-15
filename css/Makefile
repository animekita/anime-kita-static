# Create SSL enabled css files

ssl : ssl-dir ssl\/default.css ssl\/extra.css ssl\/main.css

ssl-dir :
	if test ! -d ssl; then mkdir ssl; fi

ssl\/default.css : default.css
	sed 's/http:\/\//https:\/\//' default.css > ssl/default.css

ssl\/extra.css : extra.css
	sed 's/http:\/\//https:\/\//' extra.css > ssl/extra.css

ssl\/main.css : main.css
	sed 's/http:\/\//https:\/\//' main.css > ssl/main.css
