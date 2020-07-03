module.exports = {
    setupEuRoutes: function (euRoutes) {
        euRoutes.set("edinburgh-londen-1", new route("edinburgh", "londen", 1, "black", 4, 0));
        euRoutes.set("edinburgh-londen-2", new route("edinburgh", "londen", 2, "brown", 4, 0));
        euRoutes.set("amsterdam-londen-1", new route("amsterdam", "londen", 1, "any", 2, 2));
        euRoutes.set("amsterdam-essen-1", new route("amsterdam", "essen", 1, "yellow", 3, 0));
        euRoutes.set("amsterdam-brussels-1", new route("amsterdam", "brussels", 1, "black", 1, 0));
        euRoutes.set("dieppe-londen-1", new route("dieppe", "londen", 1, "any", 2, 1));
        euRoutes.set("dieppe-londen-2", new route("dieppe", "londen", 2, "any", 2, 1));
        euRoutes.set("brussels-dieppe-1", new route("brussels", "dieppe", 1, "green", 2, 0));
        euRoutes.set("brest-dieppe-1", new route("brest", "dieppe", 1, "brown", 2, 0));
        euRoutes.set("brest-paris-1", new route("brest", "paris", 1, "black", 3, 0));
        euRoutes.set("dieppe-paris-1", new route("dieppe", "paris", 1, "purple", 1, 0));
        euRoutes.set("brussels-paris-1", new route("brussels", "paris", 1, "yellow", 2, 0));
        euRoutes.set("brussels-paris-2", new route("brussels", "paris", 2, "red", 2, 0));
        euRoutes.set("brussels-frankfurt-1", new route("brussels", "frankfurt", 1, "blue", 2, 0));
        euRoutes.set(
            "amsterdam-frankfurt-1",
            new route("amsterdam", "frankfurt", 1, "white", 2, 0)
        );
        euRoutes.set("essen-frankfurt-1", new route("essen", "frankfurt", 1, "green", 2, 0));
        euRoutes.set("frankfurt-paris-1", new route("frankfurt", "paris", 1, "white", 3, 0));
        euRoutes.set("frankfurt-paris-2", new route("frankfurt", "paris", 2, "brown", 3, 0));
        euRoutes.set("essen-kopenhagen-1", new route("essen", "kopenhagen", 1, "any", 3, 1));
        euRoutes.set("essen-kopenhagen-2", new route("essen", "kopenhagen", 2, "any", 3, 1));
        euRoutes.set("berlin-essen-1", new route("berlin", "essen", 1, "blue", 2, 0));
        euRoutes.set("berlin-frankfurt-1", new route("berlin", "frankfurt", 1, "black", 3, 0));
        euRoutes.set("berlin-frankfurt-2", new route("berlin", "frankfurt", 2, "red", 3, 0));
        euRoutes.set("brest-pamplona-1", new route("brest", "pamplona", 1, "purple", 4, 0));
        euRoutes.set("pamplona-paris-1", new route("pamplona", "paris", 1, "blue", 4, 0));
        euRoutes.set("pamplona-paris-2", new route("pamplona", "paris", 2, "green", 4, 0));
        euRoutes.set("madrid-pamplona-1", new route("madrid", "pamplona", 1, "black", 3, 0));
        euRoutes.set("madrid-pamplona-2", new route("madrid", "pamplona", 2, "white", 3, 0));
        euRoutes.set("lissabon-madrid-1", new route("lissabon", "madrid", 1, "purple", 3, 0));
        euRoutes.set("cadiz-madrid-1", new route("cadiz", "madrid", 1, "brown", 3, 0));
        euRoutes.set("cadiz-lissabon-1", new route("cadiz", "lissabon", 1, "blue", 2, 0));
        euRoutes.set("barcelona-madrid-1", new route("barcelona", "madrid", 1, "yellow", 2, 0));
        euRoutes.set("barcelona-pamplona-1", new route("barcelona", "pamplona", 1, "any", 2, 0));
        euRoutes.set("barcelona-marseille-1", new route("barcelona", "marseille", 1, "any", 4, 0));
        euRoutes.set("marseille-pamplona-1", new route("marseille", "pamplona", 1, "red", 4, 0));
        euRoutes.set("marseille-paris-1", new route("marseille", "paris", 1, "any", 4, 0));
        euRoutes.set("marseille-zurich-1", new route("marseille", "zurich", 1, "purple", 2, 0));
        euRoutes.set("paris-zurich-1", new route("paris", "zurich", 1, "any", 3, 0));
        euRoutes.set("frankfurt-munchen-1", new route("frankfurt", "munchen", 1, "purple", 2, 0));
        euRoutes.set("munchen-zurich-1", new route("munchen", "zurich", 1, "yellow", 2, 0));
        euRoutes.set(
            "kopenhagen-stockholm-1",
            new route("kopenhagen", "stockholm", 1, "yellow", 3, 0)
        );
        euRoutes.set(
            "kopenhagen-stockholm-2",
            new route("kopenhagen", "stockholm", 2, "white", 3, 0)
        );
        euRoutes.set("munchen-venice-1", new route("munchen", "venice", 1, "blue", 2, 0));
        euRoutes.set("venice-zurich-1", new route("venice", "zurich", 1, "green", 2, 0));
        euRoutes.set("marseille-rome-1", new route("marseille", "rome", 1, "any", 4, 0));
        euRoutes.set("palermo-rome-1", new route("palermo", "rome", 1, "any", 4, 1));
        euRoutes.set("brindisi-palermo-1", new route("brindisi", "palermo", 1, "any", 3, 1));
        euRoutes.set("brindisi-rome-1", new route("brindisi", "rome", 1, "white", 2, 0));
        euRoutes.set("rome-venice-1", new route("rome", "venice", 1, "black", 2, 0));
        euRoutes.set("venice-zagreb-1", new route("venice", "zagreb", 1, "any", 2, 0));
        euRoutes.set("sarajevo-zagreb-1", new route("sarajevo", "zagreb", 1, "red", 3, 0));
        euRoutes.set("munchen-wein-1", new route("munchen", "wein", 1, "brown", 3, 0));
        euRoutes.set("wein-zagreb-1", new route("wein", "zagreb", 1, "any", 2, 0));
        euRoutes.set("berlin-wein-1", new route("berlin", "wein", 1, "green", 3, 0));
        euRoutes.set("berlin-danzig-1", new route("berlin", "danzig", 1, "any", 4, 0));
        euRoutes.set("berlin-warsaw-1", new route("berlin", "warsaw", 1, "purple", 4, 0));
        euRoutes.set("berlin-warsaw-2", new route("berlin", "warsaw", 2, "yellow", 4, 0));
        euRoutes.set("danzig-warsaw-1", new route("danzig", "warsaw", 1, "any", 2, 0));
        euRoutes.set("warsaw-wein-1", new route("warsaw", "wein", 1, "blue", 4, 0));
        euRoutes.set("budapest-wein-1", new route("budapest", "wein", 1, "red", 1, 0));
        euRoutes.set("budapest-wein-2", new route("budapest", "wein", 2, "white", 1, 0));
        euRoutes.set("budapest-zagreb-1", new route("budapest", "zagreb", 1, "brown", 2, 0));
        euRoutes.set("budapest-sarajevo-1", new route("budapest", "sarajevo", 1, "purple", 3, 0));
        euRoutes.set("athina-sarajevo-1", new route("athina", "sarajevo", 1, "green", 4, 0));
        euRoutes.set("athina-brindisi-1", new route("athina", "brindisi", 1, "any", 4, 1));
        euRoutes.set("palermo-smyrna-1", new route("palermo", "smyrna", 1, "any", 6, 2));
        euRoutes.set("athina-smyrna-1", new route("athina", "smyrna", 1, "any", 2, 1));
        euRoutes.set("athina-sofia-1", new route("athina", "sofia", 1, "purple", 3, 0));
        euRoutes.set("sarajevo-sofia-1", new route("sarajevo", "sofia", 1, "any", 2, 0));
        euRoutes.set("petrograd-stockholm-1", new route("petrograd", "stockholm", 1, "any", 8, 0));
        euRoutes.set("petrograd-riga-1", new route("petrograd", "riga", 1, "any", 4, 0));
        euRoutes.set("danzig-riga-1", new route("danzig", "riga", 1, "black", 3, 0));
        euRoutes.set("riga-wilno-1", new route("riga", "wilno", 1, "green", 4, 0));
        euRoutes.set("warsaw-wilno-1", new route("warsaw", "wilno", 1, "red", 3, 0));
        euRoutes.set("kyiv-warsaw-1", new route("kyiv", "warsaw", 1, "any", 4, 0));
        euRoutes.set("budapest-kyiv-1", new route("budapest", "kyiv", 1, "any", 6, 0));
        euRoutes.set("kyiv-wilno-1", new route("kyiv", "wilno", 1, "any", 2, 0));
        euRoutes.set("petrograd-wilno-1", new route("petrograd", "wilno", 1, "blue", 4, 0));
        euRoutes.set("smolensk-wilno-1", new route("smolensk", "wilno", 1, "yellow", 3, 0));
        euRoutes.set("bucuresti-budapest-1", new route("bucuresti", "budapest", 1, "any", 4, 0));
        euRoutes.set("bucuresti-sofia-1", new route("bucuresti", "sofia", 1, "any", 2, 0));
        euRoutes.set(
            "constantinople-sofia-1",
            new route("constantinople", "sofia", 1, "blue", 3, 0)
        );
        euRoutes.set(
            "constantinople-smyrna-1",
            new route("constantinople", "smyrna", 1, "any", 2, 0)
        );
        euRoutes.set(
            "bucuresti-constantinople-1",
            new route("bucuresti", "constantinople", 1, "yellow", 3, 0)
        );
        euRoutes.set("angora-smyrna-1", new route("angora", "smyrna", 1, "brown", 3, 0));
        euRoutes.set(
            "angora-constantinople-1",
            new route("angora", "constantinople", 1, "any", 2, 0)
        );
        euRoutes.set(
            "constantinople-sevastopol-1",
            new route("constantinople", "sevastopol", 1, "any", 4, 2)
        );
        euRoutes.set(
            "bucuresti-sevastopol-1",
            new route("bucuresti", "sevastopol", 1, "white", 4, 0)
        );
        euRoutes.set("bucuresti-kyiv-1", new route("bucuresti", "kyiv", 1, "any", 4, 0));
        euRoutes.set("kyiv-smolensk-1", new route("kyiv", "smolensk", 1, "red", 3, 0));
        euRoutes.set("moskva-smolensk-1", new route("moskva", "smolensk", 1, "brown", 2, 0));
        euRoutes.set("moskva-petrograd-1", new route("moskva", "petrograd", 1, "white", 4, 0));
        euRoutes.set("kharkov-moskva-1", new route("kharkov", "moskva", 1, "any", 4, 0));
        euRoutes.set("kharkov-kyiv-1", new route("kharkov", "kyiv", 1, "any", 4, 0));
        euRoutes.set("kharkov-rostov-1", new route("kharkov", "rostov", 1, "green", 2, 0));
        euRoutes.set("rostov-sevastopol-1", new route("rostov", "sevastopol", 1, "any", 4, 0));
        euRoutes.set("rostov-sochi-1", new route("rostov", "sochi", 1, "any", 2, 0));
        euRoutes.set("sevastopol-sochi-1", new route("sevastopol", "sochi", 1, "any", 2, 1));
        euRoutes.set("erzurum-sevastopol-1", new route("erzurum", "sevastopol", 1, "any", 4, 2));
        euRoutes.set("erzurum-sochi-1", new route("erzurum", "sochi", 1, "red", 3, 0));
        euRoutes.set("angora-erzurum-1", new route("angora", "erzurum", 1, "black", 3, 0));
    },
    setupUsRoutes: function(usRoutes) {
        usRoutes.set("atlanta-neworleans-2", new route("atlanta", "neworleans", 2, "brown", 4, 0));
        usRoutes.set(
            "atlanta-neworleans-1",
            new route("atlanta", "neworleans", 1, "yellow", 4, 0)
        );
        usRoutes.set("miami-neworleans-1", new route("miami", "neworleans", 1, "red", 6, 0));
        usRoutes.set("charleston-miami-1", new route("charleston", "miami", 1, "purple", 4, 0));
        usRoutes.set("atlanta-charleston-1", new route("atlanta", "charleston", 1, "any", 2, 0));
        usRoutes.set("charleston-raleigh-1", new route("charleston", "raleigh", 1, "any", 2, 0));
        usRoutes.set("atlanta-miami-1", new route("atlanta", "miami", 1, "blue", 5, 0));
        usRoutes.set("atlanta-raleigh-2", new route("atlanta", "raleigh", 2, "any", 2, 0));
        usRoutes.set("atlanta-raleigh-1", new route("atlanta", "raleigh", 1, "any", 2, 0));
        usRoutes.set("atlanta-nashville-1", new route("atlanta", "nashville", 1, "any", 1, 0));
        usRoutes.set(
            "littlerock-neworleans-1",
            new route("littlerock", "neworleans", 1, "green", 3, 0)
        );
        usRoutes.set("houston-neworleans-1", new route("houston", "neworleans", 1, "any", 2, 0));
        usRoutes.set("elpaso-houston-1", new route("elpaso", "houston", 1, "green", 6, 0));
        usRoutes.set("dallas-houston-2", new route("dallas", "houston", 2, "any", 1, 0));
        usRoutes.set("dallas-houston-1", new route("dallas", "houston", 1, "any", 1, 0));
        usRoutes.set(
            "littlerock-nashville-1",
            new route("littlerock", "nashville", 1, "white", 3, 0)
        );
        usRoutes.set(
            "littlerock-saintlouis-1",
            new route("littlerock", "saintlouis", 1, "any", 2, 0)
        );
        usRoutes.set("dallas-oklahomacity-1", new route("dallas", "oklahomacity", 1, "any", 2, 0));
        usRoutes.set("dallas-oklahomacity-2", new route("dallas", "oklahomacity", 2, "any", 2, 0));
        usRoutes.set("dallas-littlerock-1", new route("dallas", "littlerock", 1, "any", 2, 0));
        usRoutes.set(
            "littlerock-oklahomacity-1",
            new route("littlerock", "oklahomacity", 1, "any", 2, 0)
        );
        usRoutes.set(
            "kansascity-oklahomacity-1",
            new route("kansascity", "oklahomacity", 1, "any", 2, 0)
        );
        usRoutes.set(
            "kansascity-oklahomacity-2",
            new route("kansascity", "oklahomacity", 2, "any", 2, 0)
        );
        usRoutes.set(
            "elpaso-oklahomacity-1",
            new route("elpaso", "oklahomacity", 1, "yellow", 5, 0)
        );
        usRoutes.set("dallas-elpaso-1", new route("dallas", "elpaso", 1, "red", 4, 0));
        usRoutes.set("elpaso-phoenix-1", new route("elpaso", "phoenix", 1, "any", 3, 0));
        usRoutes.set("elpaso-losangeles-1", new route("elpaso", "losangeles", 1, "black", 6, 0));
        usRoutes.set("elpaso-santafe-1", new route("elpaso", "santafe", 1, "any", 2, 0));
        usRoutes.set("denver-oklahomacity-1", new route("denver", "oklahomacity", 1, "red", 4, 0));
        usRoutes.set(
            "oklahomacity-santafe-1",
            new route("oklahomacity", "santafe", 1, "blue", 3, 0)
        );
        usRoutes.set("denver-santafe-1", new route("denver", "santafe", 1, "any", 2, 0));
        usRoutes.set("phoenix-santafe-1", new route("phoenix", "santafe", 1, "any", 3, 0));
        usRoutes.set("phoenix-losangeles-1", new route("phoenix", "losangeles", 1, "any", 3, 0));
        usRoutes.set(
            "losangeles-sanfrancisco-1",
            new route("losangeles", "sanfrancisco", 1, "yellow", 3, 0)
        );
        usRoutes.set(
            "losangeles-sanfrancisco-2",
            new route("losangeles", "sanfrancisco", 2, "purple", 3, 0)
        );
        usRoutes.set("denver-phoenix-1", new route("denver", "phoenix", 1, "white", 5, 0));
        usRoutes.set(
            "lasvegas-saltlakecity-1",
            new route("lasvegas", "saltlakecity", 1, "brown", 3, 0)
        );
        usRoutes.set("lasvegas-losangeles-1", new route("lasvegas", "losangeles", 1, "any", 2, 0));
        usRoutes.set("nashville-raleigh-1", new route("nashville", "raleigh", 1, "black", 3, 0));
        usRoutes.set(
            "nashville-saintlouis-1",
            new route("nashville", "saintlouis", 1, "any", 2, 0)
        );
        usRoutes.set("raleigh-washington-1", new route("raleigh", "washington", 1, "any", 2, 0));
        usRoutes.set("raleigh-washington-2", new route("raleigh", "washington", 2, "any", 2, 0));
        usRoutes.set(
            "nashville-pittsburgh-1",
            new route("nashville", "pittsburgh", 1, "yellow", 4, 0)
        );
        usRoutes.set("denver-kansascity-2", new route("denver", "kansascity", 2, "brown", 4, 0));
        usRoutes.set(
            "saltlakecity-sanfrancisco-2",
            new route("saltlakecity", "sanfrancisco", 2, "white", 5, 0)
        );
        usRoutes.set("denver-kansascity-1", new route("denver", "kansascity", 1, "black", 4, 0));
        usRoutes.set(
            "kansascity-saintlouis-2",
            new route("kansascity", "saintlouis", 2, "purple", 2, 0)
        );
        usRoutes.set("kansascity-omaha-1", new route("kansascity", "omaha", 1, "any", 1, 0));
        usRoutes.set("kansascity-omaha-2", new route("kansascity", "omaha", 2, "any", 1, 0));
        usRoutes.set("pittsburgh-raleigh-1", new route("pittsburgh", "raleigh", 1, "any", 2, 0));
        usRoutes.set(
            "kansascity-saintlouis-1",
            new route("kansascity", "saintlouis", 1, "blue", 2, 0)
        );
        usRoutes.set("chicago-saintlouis-1", new route("chicago", "saintlouis", 1, "green", 2, 0));
        usRoutes.set("chicago-saintlouis-2", new route("chicago", "saintlouis", 2, "white", 2, 0));
        usRoutes.set(
            "pittsburgh-saintlouis-1",
            new route("pittsburgh", "saintlouis", 1, "green", 5, 0)
        );
        usRoutes.set(
            "pittsburgh-washington-1",
            new route("pittsburgh", "washington", 1, "any", 2, 0)
        );
        usRoutes.set("newyork-washington-1", new route("newyork", "washington", 1, "brown", 2, 0));
        usRoutes.set("newyork-washington-2", new route("newyork", "washington", 2, "black", 2, 0));
        usRoutes.set(
            "portland-sanfrancisco-2",
            new route("portland", "sanfrancisco", 2, "purple", 5, 0)
        );
        usRoutes.set(
            "denver-saltlakecity-2",
            new route("denver", "saltlakecity", 2, "yellow", 3, 0)
        );
        usRoutes.set(
            "saltlakecity-sanfrancisco-1",
            new route("saltlakecity", "sanfrancisco", 1, "brown", 5, 0)
        );
        usRoutes.set("denver-saltlakecity-1", new route("denver", "saltlakecity", 1, "red", 3, 0));
        usRoutes.set("denver-omaha-1", new route("denver", "omaha", 1, "purple", 4, 0));
        usRoutes.set("chicago-omaha-1", new route("chicago", "omaha", 1, "blue", 4, 0));
        usRoutes.set("chicago-pittsburgh-2", new route("chicago", "pittsburgh", 2, "black", 3, 0));
        usRoutes.set("newyork-pittsburgh-2", new route("newyork", "pittsburgh", 2, "green", 2, 0));
        usRoutes.set("newyork-pittsburgh-1", new route("newyork", "pittsburgh", 1, "white", 2, 0));
        usRoutes.set("chicago-pittsburgh-1", new route("chicago", "pittsburgh", 1, "brown", 3, 0));
        usRoutes.set("chicago-toronto-1", new route("chicago", "toronto", 1, "white", 4, 0));
        usRoutes.set("chicago-duluth-1", new route("chicago", "duluth", 1, "red", 3, 0));
        usRoutes.set("duluth-omaha-1", new route("duluth", "omaha", 1, "any", 2, 0));
        usRoutes.set("duluth-omaha-2", new route("duluth", "omaha", 2, "any", 2, 0));
        usRoutes.set("helena-omaha-1", new route("helena", "omaha", 1, "red", 5, 0));
        usRoutes.set("denver-helena-1", new route("denver", "helena", 1, "green", 4, 0));
        usRoutes.set(
            "helena-saltlakecity-1",
            new route("helena", "saltlakecity", 1, "purple", 3, 0)
        );
        usRoutes.set(
            "portland-saltlakecity-1",
            new route("portland", "saltlakecity", 1, "blue", 6, 0)
        );
        usRoutes.set(
            "portland-sanfrancisco-1",
            new route("portland", "sanfrancisco", 1, "green", 5, 0)
        );
        usRoutes.set("pittsburgh-toronto-1", new route("pittsburgh", "toronto", 1, "any", 2, 0));
        usRoutes.set("portland-seattle-2", new route("portland", "seattle", 2, "any", 1, 0));
        usRoutes.set("portland-seattle-1", new route("portland", "seattle", 1, "any", 1, 0));
        usRoutes.set("helena-seattle-1", new route("helena", "seattle", 1, "yellow", 6, 0));
        usRoutes.set("duluth-helena-1", new route("duluth", "helena", 1, "brown", 6, 0));
        usRoutes.set("duluth-toronto-1", new route("duluth", "toronto", 1, "purple", 6, 0));
        usRoutes.set("boston-newyork-2", new route("boston", "newyork", 2, "red", 2, 0));
        usRoutes.set("boston-newyork-1", new route("boston", "newyork", 1, "yellow", 2, 0));
        usRoutes.set("montreal-newyork-1", new route("montreal", "newyork", 1, "blue", 3, 0));
        usRoutes.set("seattle-vancouver-1", new route("seattle", "vancouver", 1, "any", 1, 0));
        usRoutes.set("seattle-vancouver-2", new route("seattle", "vancouver", 2, "any", 1, 0));
        usRoutes.set("calgary-seattle-1", new route("calgary", "seattle", 1, "any", 4, 0));
        usRoutes.set("calgary-helena-1", new route("calgary", "helena", 1, "any", 4, 0));
        usRoutes.set("helena-winnipeg-1", new route("helena", "winnipeg", 1, "blue", 4, 0));
        usRoutes.set("duluth-winnipeg-1", new route("duluth", "winnipeg", 1, "black", 4, 0));
        usRoutes.set("duluth-saultstmarie-1", new route("duluth", "saultstmarie", 1, "any", 3, 0));
        usRoutes.set(
            "saultstmarie-toronto-1",
            new route("saultstmarie", "toronto", 1, "any", 2, 0)
        );
        usRoutes.set("boston-montreal-2", new route("boston", "montreal", 2, "any", 2, 0));
        usRoutes.set("toronto-montreal-1", new route("toronto", "montreal", 1, "any", 3, 0));
        usRoutes.set("boston-montreal-1", new route("boston", "montreal", 1, "any", 2, 0));
        usRoutes.set(
            "montreal-saultstmarie-1",
            new route("montreal", "saultstmarie", 1, "black", 5, 0)
        );
        usRoutes.set(
            "saultstmarie-winnipeg-1",
            new route("saultstmarie", "winnipeg", 1, "any", 6, 0)
        );
        usRoutes.set("calgary-winnipeg-1", new route("calgary", "winnipeg", 1, "white", 6, 0));
        usRoutes.set("calgary-vancouver-1", new route("calgary", "vancouver", 1, "any", 3, 0));
    },
    setupEuDestinations: function(euDesti, longeuDesti) {
        euDesti.set("amsterdam-pamplona", new destination("eu", "amsterdam", "pamplona", 7));
        euDesti.set("amsterdam-wilno", new destination("eu", "amsterdam", "wilno", 12));
        euDesti.set("angora-kharkov", new destination("eu", "angora", "kharkov", 10));
        euDesti.set("athina-angora", new destination("eu", "athina", "angora", 5));
        euDesti.set("athina-wilno", new destination("eu", "athina", "wilno", 11));
        euDesti.set("barcelona-brussels", new destination("eu", "barcelona", "brussels", 8));
        euDesti.set("barcelona-munchen", new destination("eu", "barcelona", "munchen", 8));
        euDesti.set("berlin-bucuresti", new destination("eu", "berlin", "bucuresti", 8));
        euDesti.set("berlin-moskva", new destination("eu", "berlin", "moskva", 12));
        euDesti.set("berlin-rome", new destination("eu", "berlin", "rome", 9));
        euDesti.set("brest-marseille", new destination("eu", "brest", "marseille", 7));
        longeuDesti.set("brest-petrograd", new destination("eu", "brest", "petrograd", 20));
        euDesti.set("brest-venice", new destination("eu", "brest", "venice", 8));
        euDesti.set("brussels-danzig", new destination("eu", "brussels", "danzig", 9));
        euDesti.set("budapest-sofia", new destination("eu", "budapest", "sofia", 5));
        longeuDesti.set("cadiz-stockholm", new destination("eu", "cadiz", "stockholm", 21));
        longeuDesti.set("edinburgh-athina", new destination("eu", "edinburgh", "athina", 21));
        euDesti.set("edinburgh-paris", new destination("eu", "edinburgh", "paris", 7));
        euDesti.set("essen-kyiv", new destination("eu", "essen", "kyiv", 10));
        euDesti.set("frankfurt-kopenhagen", new destination("eu", "frankfurt", "kopenhagen", 5));
        euDesti.set("frankfurt-smolensk", new destination("eu", "frankfurt", "smolensk", 13));
        longeuDesti.set("kopenhagen-erzurum", new destination("eu", "kopenhagen", "erzurum", 21));
        euDesti.set("kyiv-petrograd", new destination("eu", "kyiv", "petrograd", 6));
        euDesti.set("kyiv-sochi", new destination("eu", "kyiv", "sochi", 8));
        longeuDesti.set("lissabon-danzig", new destination("eu", "lissabon", "danzig", 20));
        euDesti.set("londen-berlin", new destination("eu", "londen", "berlin", 7));
        euDesti.set("londen-wein", new destination("eu", "londen", "wein", 10));
        euDesti.set("madrid-dieppe", new destination("eu", "madrid", "dieppe", 8));
        euDesti.set("madrid-zurich", new destination("eu", "madrid", "zurich", 8));
        euDesti.set("marseille-essen", new destination("eu", "marseille", "essen", 8));
        euDesti.set(
            "palermo-constantinople",
            new destination("eu", "palermo", "constantinople", 8)
        );
        longeuDesti.set("palermo-moskva", new destination("eu", "palermo", "moskva", 20));
        euDesti.set("paris-wein", new destination("eu", "paris", "wein", 8));
        euDesti.set("paris-zagreb", new destination("eu", "paris", "zagreb", 7));
        euDesti.set("riga-bucuresti", new destination("eu", "riga", "bucuresti", 10));
        euDesti.set("rome-smyrna", new destination("eu", "rome", "smyrna", 8));
        euDesti.set("rostov-erzurum", new destination("eu", "rostov", "erzurum", 5));
        euDesti.set("sarajevo-sevastopol", new destination("eu", "sarajevo", "sevastopol", 8));
        euDesti.set("smolensk-rostov", new destination("eu", "smolensk", "rostov", 8));
        euDesti.set("sofia-smyrna", new destination("eu", "sofia", "smyrna", 5));
        euDesti.set("stockholm-wein", new destination("eu", "stockholm", "wein", 11));
        euDesti.set(
            "venice-constantinople",
            new destination("eu", "venice", "constantinople", 10)
        );
        euDesti.set("warsaw-smolensk", new destination("eu", "warsaw", "smolensk", 6));
        euDesti.set("zagreb-brindisi", new destination("eu", "zagreb", "brindisi", 6));
        euDesti.set("zurich-brindisi", new destination("eu", "zurich", "brindisi", 6));
        euDesti.set("zurich-budapest", new destination("eu", "zurich", "budapest", 6));
    },
    setupUsDestinations: function(usDesti, longusDesti) {
        usDesti.set("boston-miami", new destination("us", "boston", "miami", 12));
        usDesti.set("calgary-phoenix", new destination("us", "calgary", "phoenix", 13));
        usDesti.set("calgary-saltlakecity", new destination("us", "calgary", "saltlakecity", 7));
        usDesti.set("chicago-neworleans", new destination("us", "chicago", "neworleans", 7));
        usDesti.set("chicago-santafe", new destination("us", "chicago", "santafe", 9));
        usDesti.set("dallas-newyork", new destination("us", "dallas", "newyork", 11));
        usDesti.set("denver-elpaso", new destination("us", "denver", "elpaso", 4));
        usDesti.set("denver-pittsburgh", new destination("us", "denver", "pittsburgh", 11));
        usDesti.set("duluth-elpaso", new destination("us", "duluth", "elpaso", 10));
        usDesti.set("duluth-houston", new destination("us", "duluth", "houston", 8));
        usDesti.set("helena-losangeles", new destination("us", "helena", "losangeles", 8));
        usDesti.set("kansascity-houston", new destination("us", "kansascity", "houston", 5));
        usDesti.set("losangeles-chicago", new destination("us", "losangeles", "chicago", 16));
        longusDesti.set("losangeles-miami", new destination("us", "losangeles", "miami", 20));
        longusDesti.set("losangeles-newyork", new destination("us", "losangeles", "newyork", 21));
        usDesti.set("montreal-atlanta", new destination("us", "montreal", "atlanta", 9));
        usDesti.set("montreal-neworleans", new destination("us", "montreal", "neworleans", 13));
        usDesti.set("newyork-atlanta", new destination("us", "newyork", "atlanta", 6));
        usDesti.set("portland-nashville", new destination("us", "portland", "nashville", 17));
        usDesti.set("portland-phoenix", new destination("us", "portland", "phoenix", 11));
        usDesti.set("sanfrancisco-atlanta", new destination("us", "sanfrancisco", "atlanta", 17));
        usDesti.set(
            "saultstmarie-nashville",
            new destination("us", "saultstmarie", "nashville", 8)
        );
        usDesti.set(
            "saultstmarie-oklahomacity",
            new destination("us", "saultstmarie", "oklahomacity", 9)
        );
        usDesti.set("seattle-losangeles", new destination("us", "seattle", "losangeles", 9));
        longusDesti.set("seattle-newyork", new destination("us", "seattle", "newyork", 22));
        usDesti.set("toronto-miami", new destination("us", "toronto", "miami", 10));
        longusDesti.set("vancouver-montreal", new destination("us", "vancouver", "montreal", 20));
        usDesti.set("vancouver-santafe", new destination("us", "vancouver", "santafe", 13));
        usDesti.set("winnipeg-houston", new destination("us", "winnipeg", "houston", 12));
        usDesti.set("winnipeg-littlerock", new destination("us", "winnipeg", "littlerock", 11));
    }
}