var _id = 0;
var uploader;
var orgFileName = "";
var newFileName = "";
var _download = -1;

$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    showLoadingPopup();
    pageLoad();
    bindjqGrid();
    $('.datePicker').datepicker({
        format: "mm/dd/yyyy",
        autoclose: true
    });

    $("#addNewBtn").click(function () {
        $('#formAction').text('Add Knowledge');
        $('#formValues').clearForm();
        $("#pnlMain").hide();
        $("#pnlAdd").show();
        $("#ddlKnowledgeType").val(-1).select2();
        _id = 0;
    });

    $("#btnSave").click(function () {
        save();
    });

    $("#btnBack").click(function () {
        $("#pnlMain").show();
        $("#pnlAdd").hide();
    });

    uploader = new Uploader();
    uploader.Init();
    document.Uploader = uploader;

    $('#fsUpload').off('click').click(function () {
        $(document).trigger('FileSystemMenu:OnUploadPopup', [this]);
    });
});

function pageLoad() {
    showLoadingPopup();

    obj =
    {
        isActive: null,
        defaultKey: -1,
        defaultValue: '---All---'
    };
    var v2 = $.ajax({
        url: '\Service.aspx?rq=KnowledgeTypeGetDropDownList',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            _questionTypeData = sr.Data;

            var tmpl;
            _questionTypeData.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });

            $("#ddlFilterKnowledgeType").empty();
            $("#ddlFilterKnowledgeType").append(tmpl);
            $("#ddlFilterKnowledgeType").val(-1).select2();

            $("#ddlKnowledgeType").empty();
            $("#ddlKnowledgeType").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlKnowledgeType").val(-1).select2();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function bindjqGrid() {
    var url = "\Service.aspx?rq=KnowledgeGetAll";
    var qtid = $('#ddlKnowledgeType').val() == undefined ? '-1' : $('#ddlKnowledgeType').val();
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ KnowledgeTypeID: qtid }),
        colNames: ['ID', 'KnowledgeTypeID', 'Knowledge Type', 'Date', 'Title', 'Description', 'File Name', 'InternalFileName'],
        colModel: [
            { name: 'KnowledgeID', index: 'KnowledgeID', key: true, search: true, align: 'center', hidden: true },
            { name: 'KnowledgeTypeID', index: 'KnowledgeTypeID', search: true, hidden: true },
            { name: 'KnowledgeType', index: 'KnowledgeType', search: true },
            { name: 'Date', index: 'Date', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'Title', index: 'Title', search: true },
            { name: 'Description', index: 'Description', search: true },
            { name: 'FileName', index: 'FileName', search: true, hidden: true },
            { name: 'InternalFileName', index: 'InternalFileName', search: true, hidden: true },
        ],

        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Knowledge',
        pager: '#gridpager',
        rowList: [5, 20, 50, 100, 200, 500],
        height: '320px',
        autowidth: true,
        altRows: true,
        altclass: 'myAltRowClass',
        ignoreCase: true,
        loadComplete: function () {
            $("tr.jqgrow", this).contextMenu('GridContextMenu', {
                bindings: {
                    'Edit': function (trigger) {
                        $('#formAction').text("Edit Knowledge");
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        edit(rowData);
                    },
                    'Delete': function (trigger) {
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        remove(rowData.KnowledgeID);
                    },
                    'Download': function (trigger) {
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        downloadFile(rowData);
                    },
                },
                onContextMenu: function (event) {
                    return true;
                }
            });
            var width = $('#ParentDiv').width();
            $('#grid').setGridWidth(width);
        }
    });
    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: 'cn' });
    $("#grid").jqGrid('setGridParam', { url: url, datatype: "json", page: 1 }).trigger("reloadGrid");
}

function save() {
    isError = false;

    var o = {};
    o.KnowledgeID = _id;
    o.KnowledgeTypeID = $("#ddlKnowledgeType").val();
    o.Date = $('#txtDate').val().trim();
    o.Title = $('#txtTitle').val().trim();
    o.Description = $('#txtDescription').val().trim();
    o.FileName = orgFileName;
    o.InternalFileName = newFileName;

    if (o.KnowledgeTypeID == '-1') {
        toastr["error"]("Please enter knowledge type.");
        isError = true;
    }

    if (o.Date == '') {
        toastr["error"]("Please select date.");
        isError = true;
    }

    if (o.Title == '') {
        toastr["error"]("Please enter title.");
        isError = true;
    }

    if (o.Description == '') {
        toastr["error"]("Please enter description.");
        isError = true;
    }

    //if (o.FileName == "" || o.InternalFileName == "") {
    //    toastr["error"]("Please upload file.");
    //    isError = true;
    //}

    if (!isError) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=KnowledgeInsertOrUpdate',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(o)
        }).done(function (sr) {
            if (sr.HasError == false) {
                bindjqGrid();
                $("#btnBack").trigger('click');
                if (o.ID == 0)
                    toastr["success"]('Record has been saved successfully.');
                else
                    toastr["success"]('Record has been updated successfully.');
            } else {
                toastr["error"](sr.ErrorMessage);
            }
            closeLoadingPopup();
        }).fail(function () {
            closeLoadingPopup();
            toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
        });
    }
}

function edit(data) {
    $('#formValues').clearForm();
    $("#pnlMain").hide();
    $("#pnlAdd").show();

    _id = data.KnowledgeID;
    $('#ddlKnowledgeType').val(data.KnowledgeTypeID).select2();
    $('#txtDate').val(GetDate(data.Date));
    $('#txtTitle').val(data.Title);
    $('#txtDescription').val(data.Description);
    orgFileName = data.FileName
    newFileName = data.InternalFileName;
}

function remove(id) {
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=KnowledgeDelete',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ ID: id })
    }).done(function (sr) {
        if (sr.HasError == false) {
            bindjqGrid();
            toastr["success"]('Record has been deleted successfully.');
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function downloadFile(rowData) {
    if (rowData.InternalFileName == "") {

        toastr["error"]('file is not uploaded against this record.');
    }
    else {
        window.location.href = "./FileTransmissionEndPoint.aspx?req=fileDownload&fileName=" + rowData.InternalFileName;
    }
}

function GetDate(jsonDate) {
    if (jsonDate != null)
        return new moment(jsonDate).format('MM/DD/YYYY');

    return "";
}

$(document).ajaxStop(function () {
    closeLoadingPopup();
});

//[UPLOADER]
function Uploader() {
    var self = this;
    self.dropzone;
    self.settings = {}

    self.Init = function init(settings) {
        $.extend(self.settings, settings);
        Setup();
        $(document).on('FileSystemMenu:OnUploadPopup', onUploadPopup);
    }

    function onUploadPopup(e, s, d) {
        var st = self.settings;
        if (self.dropzone) {
            self.dropzone.destroy();
        }

        var url_ = st.uploadFileUrl;
        url_ = url_ + "?req=fileUploadPDF";

        self.dropzone = new Dropzone(st.fileUpload, {
            url: url_,
            //acceptedFiles: 'image/*',
            success: function (file, response) {
                response = JSON.parse(response);
                if (!response.HasError) {
                    $(file.previewElement).find(".dz-error-mark").empty();
                    var file = response.Data;
                    file = file.split(':::');
                    orgFileName = file[0];
                    newFileName = file[1];
                    $('#closeImageUploader').trigger('click');
                } else {
                    $(file.previewElement).find(".dz-success-mark").empty();
                    $('#closeImageUploader').trigger('click');
                    toastr["error"](response.ErrorMessage);
                }
            },
            error: function (file, response) {
                $(file.previewElement).find(".dz-success-mark").empty();
                $('#closeImageUploader').trigger('click');
            }
        });
        self.dropzone.on('sending', function (file, xhr, formData) {
            //sformData.append('parentId', _id);
        });
        $(st.uploadPopup).modal({
            backdrop: 'static',
            keyboard: false
        });
        $(st.uploadPopup).off('hidden.bs.modal').on('hidden.bs.modal', function () {
            if (self.dropzone.getUploadingFiles().length != 0 || self.dropzone.getQueuedFiles().length != 0) {
                if (confirm('Are you sure you want to cancel uploading?')) {
                    self.dropzone.removeAllFiles(true);
                } else {
                    $(st.uploadPopup).modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }
            }

            //$(document).trigger('Uploader:ContentUpdated', [this]);
        });
    }

    function Setup() {
        var st = self.settings;
        st.fileUpload = '#dropzoneForm';
        st.uploadFileUrl = '\FileTransmissionEndPoint.aspx';
        st.uploadPopup = '#myModal5';
        st.uploaderTemplate = '#dropZoneTemplate'
    }
}
//[UPLOADER]

// Add responsive to jqGrid
$(window).bind('resize', function () {
    var width = $('#ParentDiv').width();
    $('#grid').setGridWidth(width);
});
