function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function translate(lang, langpath, scope) {
    if (lang == "en") { return true; }
    var parentholder = "";
    if (scope) {
        parentholder = scope;
    }    
    $.get(langpath + lang + ".json", function (data) {        
        //if (IsJsonString(data)) {
        //if (1==1) {
            var pagename = window.location.pathname.split("/").pop();
            //var dataobject = $.parseJSON(data);
            dataobject = data;
            var notranslation = "";

            $(".tlangnav").each(function () {
                var id = "";
                if (typeof $(this).attr("tlang") !== 'undefined' && $(this).attr("tlang") !== false) {
                    id = $(this).attr("tlang");
                } else {
                    id = $(this).html().trim();
                }
                if (id != "") {
                    if (dataobject.hasOwnProperty(id)) {
                        $(this).html(dataobject[id]);
                        if (id) { id = id.replace(/"/g, '\\"'); }
                    } else {
                        if (id) { id = id.replace(/"/g, '\\"'); }
                        notranslation += '"' + id + '":"",\n';
                    }
                }
            });

            if (dataobject.hasOwnProperty(pagename)) {
                dataobject = dataobject[pagename];
            }
            
            $(parentholder + " .table .dataTables_empty," + parentholder + " .table th,"+ parentholder + " .tlang," + parentholder + " label," + parentholder + " .btn," + parentholder + " .form-control[type=text]").each(function () {
                var id = "";
                if (typeof $(this).attr("tlang") !== 'undefined' && $(this).attr("tlang") !== false) {
                    id = $(this).attr("tlang");
                } else {
                    if ($(this).is("input")) {                        
                        //id = $(this).attr("placeholder").trim();
                        id = $(this).attr("placeholder");
                        if (id) { id = id.trim();}
                    } else {
                        id = $(this).html().trim();
                    }
                }
                if (id != "") {                    
                    if (dataobject.hasOwnProperty(id)) {
                        if ($(this).is("input")) {
                            $(this).attr("placeholder", dataobject[id]);
                        } else {
                            $(this).html(dataobject[id]);
                        }
                        if (id) { id = id.replace(/"/g, '\\"');}
                    } else {
                        if (id) { id = id.replace(/"/g, '\\"'); }
                        notranslation += '"'+ id + '":"",\n';
                        //console.log(id);
                    }
                }
            });
            console.log(notranslation);
       //}
    });
    
}
