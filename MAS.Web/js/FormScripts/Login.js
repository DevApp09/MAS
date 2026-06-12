var isError = false;
var _unExpMsg = "An unexpected error has occured, please try again or contact your administrator.";

$(document).ready(function () {
    $("#btnLogin").click(function () {
        login();
    });
});

function login() {

    isError = false;
    var o = $('form').getFormAsObject();
    o.Login = $('#txtLogin').val().trim();
    o.Password = $('#txtPassword').val().trim();

    if (o.Login == '') {
        toastr["error"]("Please enter username.");
        isError = true;
    }
    if (o.Password == '') {
        toastr["error"]("Please enter password.");
        isError = true;
    }

    if (!isError) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=UserIsValid',
            type: 'POST',
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify(o)
        }).done(function (sr) {
            if (sr.HasError == false) {
                var table = sr.Data;
                if (table == null || table.ID == 0) {
                    toastr["error"]('Invalid username or password.');
                    closeLoadingPopup();
                    return;
                }
                var url = "Default.aspx";
                window.open(url, '_self');
            } else {
                toastr["error"](sr.ErrorMessage);
            }
            closeLoadingPopup();
        }).fail(function () {
            closeLoadingPopup();
            toastr["error"](_unExpMsg);
        });
    }
    else {
        closeLoadingPopup();
    }
}