$.fn.extend({
    getFormAsObject: function () {
        var o = {};
        $.grep(this.find('input[name!=""]').toArray(), function (e, i) {
            var attr = $(e).data('ignore');
            if (attr != undefined) {
                return false;
            } else if ($(e).attr('name') == undefined) {
                return false;
            } else if ($(e).attr('name').includes('__')) {
                return false;
            } else if ($(e).attr('type') == 'button') {
                return false;
            }
            return true;
        }).forEach(function (e) {
            var t = $(e).attr('type').toLocaleLowerCase().trim();
            var setVal = $(e).val().trim();
            if ($(e).val().toLocaleLowerCase().trim() == 'null') {
                setVal = null;
            }
            if (t == 'text' || t == 'hidden') {
                o[$(e).attr('name')] = setVal;
            } else if (t == 'checkbox') {
                o[$(e).attr('name')] = $(e).is(":checked");
            } else if (t == 'number') {
                o[$(e).attr('name')] = setVal;
            }
        });
        return o;
    },
    clearForm: function () {
        var o = {};
        $.grep(this.find('input[name!=""]').toArray(), function (e, i) {
            var attr = $(e).data('ignore');
            if (attr != undefined) {
                return false;
            } else if ($(e).attr('name') == undefined) {
                return false;
            } else if ($(e).attr('name').includes('__')) {
                return false;
            } else if ($(e).attr('type') == 'button') {
                return false;
            }
            return true;
        }).forEach(function (e) {
            var t = $(e).attr('type').toLocaleLowerCase().trim();
            var setVal = '';
            if ($(e).data('default') != undefined) {
                setVal = $(e).data('default');
            }
            if (t == 'text' || t == 'hidden' || t == 'number') {
                $(e).val(setVal);
            } else if (t == 'checkbox') {
                $(e).prop("checked", true);
            } else if (t == 'checkbox') {
                $(e).prop("checked", true);
            }
        });
        return o;
    },
});