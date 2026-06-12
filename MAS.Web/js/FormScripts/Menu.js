//$(document).ready(function () {
function getApplicationMenu() {
    var menu = localStorage.getItem("menu" + $("#ddlcompany").val());
    if (null == menu) {
        $.ajax({
            url: '\Service.aspx?rq=getMenu&companyID=' + $("#ddlcompany").val(),
            type: 'GET',
            dataType: "json",
        }).done(function (sr) {
            if (sr.HasError == false) {
                var menu = sr.Data;
                var item = JSON.parse('{"Id":-1,"Name":"Search Result","Url":"null","Description":"","ParentId":null,"ItemOrder":1,"CssClass":"fa fa-search","ImageUrl":null}');
                menu = [item, ...menu];
                var searchableItems = Enumerable.From(menu).Where(function (mi) {
                    return mi.Url != "null" && mi.Url != "NULL";
                }).Select(function (mi, i) {
                    var y = Object.assign({}, mi);
                    y.ParentId = -1;
                    y.Id = (mi.Id + 2) * -1;
                    return y;
                }).ToArray();
                searchableItems.forEach(function (itm) {
                    menu.push(itm);
                });
                localStorage.setItem("menu" + $("#ddlcompany").val(), JSON.stringify(menu));
                generateMenu();
                setNavigationAndMenuState();
            } else {
                toastr["error"](sr.ErrorMessage);
            }
        }).fail(function () {
            toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
        });
    } else {
        generateMenu();
        setNavigationAndMenuState();
    }
    }
//});

function generateMenu() {
    var md = $("#side-menu");
    var mo = JSON.parse(localStorage.getItem("menu" + $("#ddlcompany").val()));
    var ca = '<span class="fa arrow"></span>';
    var p1 = "";
    var fa = "fa fa-th-large";

    //level 0
    for (var i = 0; i < mo.length; i++) {
        if (null == mo[i]["ParentId"]) {
            var href = mo[i]["Url"];
            var id = mo[i]["Id"];
            if ("NULL" == href || null == href) {
                href = 'href="#"';
            } else {
                href = 'href="' + href + '"';
            }
            p1 += '<li id="' + id + '">';
            p1 += "<a " + href + ">";
            if ("NULL" != mo[i]["CssClass"] && null != mo[i]["CssClass"]) {
                fa = mo[i]["CssClass"];
            }

            if (fa.indexOf("icon") != -1)
                p1 += '<img alt="image" class=' + fa + '>';
            else
                p1 += '<i class="' + fa + '"></i>';

            p1 += '<span class="nav-label">' + mo[i]["Name"] + "</span>"
            p1 += "</a>";
            p1 += "</li>"
        }
    }
    p1 += "";

    md.append(p1);

    //level 1
    var idlst = [];
    $("#side-menu").children("li").each(function () {
        if ($(this).attr("id") != undefined) {
            idlst.push($(this).attr("id"));
        }
    });

    p1 = "";
    for (var j = 0; j < idlst.length; j++) {
        var fid = idlst[j];
        var ce = Enumerable.From(mo).Where(function (e) { return parseInt(e.ParentId) == parseInt(fid) }).ToArray();
        if (0 < ce.length) {
            p1 = "<ul class='nav nav-second-level'>";
            for (var i = 0; i < ce.length; i++) {
                var href = ce[i].Url;
                var id = ce[i].Id;
                if ("NULL" == href || null == href) {
                    href = 'href="#"';
                } else {
                    href = 'href="' + href + '"';
                }
                p1 += '<li id="' + id + '">';
                p1 += "<a " + href + ">";
                if ("NULL" != ce[i]["CssClass"] && null != ce[i]["CssClass"]) {
                    fa = ce[i]["CssClass"];
                }

                if (fa.indexOf("icon") != -1)
                    p1 += '<img alt="image" class=' + fa + '>';
                else
                    p1 += '<i class="' + fa + '"></i>';

                p1 += ce[i].Name;
                p1 += "</a>";
                p1 += "</li>"
            }
            p1 += "</ul>";

            var tmp = $("#divMenu #" + fid);
            tmp.find("a").append(ca); tmp.append(p1);
        }
    }

    //level 2
    var idlst = [];
    $("#side-menu").children("li").children("ul").children("li").each(function () {
        idlst.push($(this).attr("id"));
    });

    p1 = "";
    for (var j = 0; j < idlst.length; j++) {
        var fid = idlst[j];
        var ce = Enumerable.From(mo).Where(function (e) { return parseInt(e.ParentId) == parseInt(fid) }).ToArray();
        if (0 < ce.length) {
            p1 = "<ul class='nav nav-third-level'>";
            for (var i = 0; i < ce.length; i++) {
                var href = ce[i].Url;
                var id = ce[i].Id;
                if ("NULL" == href || null == href) {
                    href = 'href="#"';
                } else {
                    href = 'href="' + href + '"';
                }
                p1 += '<li id="' + id + '">';
                p1 += "<a " + href + ">";
                if ("NULL" != ce[i]["CssClass"] && null != ce[i]["CssClass"]) {
                    fa = ce[i]["CssClass"];
                }

                if (fa.indexOf(".") != -1)
                    p1 += '<img alt="image" class=' + fa + '>';
                else
                    p1 += '<i class="' + fa + '"></i>';

                p1 += ce[i].Name;
                p1 += "</a>";
                p1 += "</li>"
            }
            p1 += "</ul>";

            var tmp = $("#side-menu #" + fid);
            tmp.find("a").append(ca); tmp.append(p1);
        }
    }

    $("#divMenu li[id='-1']").hide();
    $("#divMenu").metisMenu();
    setTimeout(function () {
        try {
            if ($('#clsNavDiv .active').position().top > 500) {
                document.getElementById($('#clsNavDiv .active').attr('id')).scrollIntoView();
                $('#clsNavDiv .slimScrollBar').css('top', $('#clsNavDiv .active').position().top);
            }
        } catch (e) {
            console.log('Menu.js -> menu item not found');
            console.log(e);
        }

    }, 1000);
}

function filterMenu(e) {
    var txt = $("#txtSearchMenu").val().trim().toLowerCase();
    if (txt != "") {
        $("#divMenu li[id='-1']").addClass("active").show().find('ul').addClass('in');
        $("#divMenu li[id!='-1'][class!='nav-header']").hide();
        $("#divMenu li[id='-1'] li").each(function (index, mi) {
            if ($(mi).find('a').text().trim().toLowerCase().indexOf(txt) != -1) {
                $(mi).show();
            }
        });
    } else {
        $("#divMenu li[id='-1']").hide();
        $("#divMenu li[id!='-1'][class!='nav-header']").show();
    }
    //var input, filter, ul, li, a, i;
    //input = document.getElementById("txtSearchMenu");
    //filter = input.value.toUpperCase();
    //div = document.getElementById("divMenu");
    //a = div.getElementsByTagName("a");
    //for (i = 0; i < a.length; i++) {
    //    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
    //        a[i].style.display = "";
    //    } else {
    //        a[i].style.display = "none";
    //    }
    //}
}

function setNavigationAndMenuState() {
    var pageName = window.location.pathname.split('/').pop().trim();
    if (pageName != "") {
        var navigationItems = [];
        var menu = JSON.parse(localStorage.getItem("menu" + $("#ddlcompany").val()));
        var obj = Enumerable.From(menu).Where(function (mi) {
            return mi.Url == null ? 0 : (mi.Url.substring(mi.Url.lastIndexOf('/') + 1) == pageName && mi.Id > 0);
        }).SingleOrDefault();
        if (obj != null) {
            while (obj.ParentId != null) {
                navigationItems.push({ name: obj.Name, url: obj.Url });
                $("#" + obj.Id).parent("ul").addClass('in');
                obj = Enumerable.From(menu).Where(function (mi) {
                    return mi.Id == obj.ParentId;
                }).Single();
            }
            navigationItems.push({ name: obj.Name, url: obj.Url });
            $("#" + obj.Id).addClass('active');

            var html = "";
            for (var i = navigationItems.length - 1; i >= 0; i--) {
                var url = navigationItems[i].url == "NULL" ? "" : navigationItems[i].url;
                html += '<li id="menuParent"><a href=' + url + '>' + navigationItems[i].name + '</a></li>';
            }
            $("#menuNavigation .breadcrumb").html(html);
        }
    }
}