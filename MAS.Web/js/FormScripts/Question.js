var _id = 0;
var _categoryData;
var _questionTypeData;
var _questionData;
var _conditionData;
var questionOption = [];
var questionOptionDelete = [];
var questionOptionNo = -100;
var questionOptionId = -1;
var questionCondition = [];
var questionConditionDelete = [];
var questionConditionNo = -100;
var questionOptionIdEdit = -1;

$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    pageLoad();
    bindGrid();

    $('#pnlAdvanced').hide();

    $("#btnAdd").click(function () {
        add();
    });

    $("#btnBack").click(function () {
        $("#pnlMain").show();
        $("#pnlAdd").hide();
    });

    $("#btnSave").click(function () {
        save();
    });

    $("#btnApply").click(function () {
        apply();
    });

    $("#btnReset").click(function () {
        reset();
    });

    $('#cbIsAdvanced').on('change', function () {
        showHideAdvancePanel();
    });

    $("#btnAddOption").click(function () {
        addOption();
    });

    $("#btnAddCondition").click(function () {
        addCondition();
    });

    $("#ddlQuestion").change(function () {
        onQuestionChange()
    });

    $("#ddlCondition").change(function () {
        onConditionChange()
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
    var v1 = $.ajax({
        url: '\Service.aspx?rq=CategoryGetDropDownList',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            _categoryData = sr.Data;

            var tmpl;
            _categoryData.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });

            $("#ddlFilterCategory").empty();
            $("#ddlFilterCategory").append(tmpl);
            $("#ddlFilterCategory").val(-1).select2();

            $("#ddlCategory").empty();
            $("#ddlCategory").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlCategory").val(-1).select2();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });

    obj =
    {
        isActive: null,
        defaultKey: -1,
        defaultValue: '---All---'
    };
    var v2 = $.ajax({
        url: '\Service.aspx?rq=QuestionTypeGetDropDownList',
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

            $("#ddlFilterQuestionType").empty();
            $("#ddlFilterQuestionType").append(tmpl);
            $("#ddlFilterQuestionType").val(-1).select2();

            $("#ddlQuestionType").empty();
            $("#ddlQuestionType").append(tmpl.replace("---All---", "---Select---"));
            $("#ddlQuestionType").val(-1).select2();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });

    obj =
    {
        isActive: null,
        defaultKey: -1,
        defaultValue: '---Select---'
    };
    var v3 = $.ajax({
        url: '\Service.aspx?rq=QuestionGetAll2',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            _questionData = sr.Data;
            
            var tmpl = getDefaultValueForDropDown('Select');
            _questionData.forEach(function (a) {
                tmpl += '<option value="' + a.QuestionID + '">' + a.Name + '</option>';
            });

            $("#ddlQuestion").empty();
            $("#ddlQuestion").append(tmpl);
            $("#ddlQuestion").val(-1).select2();

            bindCondition();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });

    var v4 = $.ajax({
        url: '\Service.aspx?rq=ConditionGetAll',
        type: 'POST',
        dataType: "json",
    }).done(function (sr) {
        _conditionData = sr;
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function bindGrid() {
    var url = "\Service.aspx?rq=QuestionGetAll";
    var cid = $("#ddlFilterCategory").val() == undefined ? '-1' : $('#ddlFilterCategory').val();
    var qtid = $('#ddlQuestionTypeID').val() == undefined ? '-1' : $('#ddlQuestionTypeID').val();
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ categoryID: cid, questionTypeID: qtid }),
        colNames: ['QuestionID', 'CategoryID', 'Category', 'QuestionTypeID', 'Question Type', 'Name', 'Required', 'Active'],
        colModel: [
            { name: 'QuestionID', index: 'QuestionID', key: true, search: true, align: 'center', hidden: true },
            { name: 'CategoryID', index: 'CategoryID', hidden: true },
            { name: 'Category', index: 'Category', search: true, hidden: true },
            { name: 'QuestionTypeID', index: 'QuestionTypeID', hidden: true },
            { name: 'QuestionType', index: 'QuestionType', search: true },
            { name: 'Name', index: 'Name', search: true },
            { name: 'IsRequired', index: 'IsRequired', search: true, align: 'center' },
            { name: 'IsActive', index: 'IsActive', search: true, align: 'center' },
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Question',
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
                        $('#formAction').text("Edit Question");
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        edit(rowData);
                    },
                    'Delete': function (trigger) {
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        remove(rowData.QuestionID);
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

function apply() {
    bindGrid();
}

function reset() {
    $("#ddlFilterCategory").val(-1).select2();
    $("#ddlFilterQuestionType").val(-1).select2();
    bindGrid();
}

function add() {
    $('#formAction').text("Add Question");
    $('#formValues').clearForm();
    $("#pnlMain").hide();
    $("#pnlAdd").show();
    $("#formAction").text('Add Question');
    $('#btnAddOptionText').text('Add');
    showHideTab();
    questionOption = [];
    questionOptionDelete = [];
    questionOptionNo = -100;
    questionCondition = [];
    questionConditionDelete = [];
    questionConditionNo = -100;
    _id = 0;
    $('#optionContainer').empty();
    $('#conditionContainer').empty();

    $("#ddlCategory").val(-1).select2();
    $("#ddlQuestionType").val(-1).select2();

    $("#cbIsNotApplicableOption").prop("checked", false);
    $("#cbIsDontKnowOption").prop("checked", false);
    $("#cbIsAdvanced").prop("checked", false);
}

function edit(data) {
    $('#formValues').clearForm();
    $("#pnlMain").hide();
    $("#pnlAdd").show();
    $("#formAction").text('Edit Question');
    $('#btnAddOptionText').text('Add');
    showHideTab();
    questionOption = [];
    questionOptionDelete = [];
    questionOptionNo = -100;
    questionCondition = [];
    questionConditionDelete = [];
    questionConditionNo = -100;
    _id = data.QuestionID;
    $('#optionContainer').empty();
    $('#conditionContainer').empty();

    obj =
    {
        QuestionID: _id
    };

    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=QuestionGetByID',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(data)
    }).done(function (sr) {
        if (sr.HasError == false) {
            var data = sr.Data;
            $('#ddlCategory').val(data.CategoryID).select2();
            $('#ddlQuestionType').val(data.QuestionTypeID).select2();
            $('#txtName').val(data.Name);
            $('#txtHint').val(data.Hint);
            $('#txtLength').val(data.Length);
            $("#cbIsRequired").prop("checked", data.IsRequired);
            $("#cbIsActive").prop("checked", data.IsActive);
            $("#cbIsNotApplicableOption").prop("checked", data.IsNotApplicableOption);
            $("#cbIsDontKnowOption").prop("checked", data.IsDontKnowOption);
            $("#cbIsAdvanced").prop("checked", data.IsAdvanced);
            questionOption = data.QuestionOptions;
            $("#optionTmpl").tmpl(data.QuestionOptions).appendTo("#optionContainer");
            $("#conditionTmpl").tmpl(data.QuestionConditions).appendTo("#conditionContainer");
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function remove(id) {
    obj =
    {
        QuestionID: id
    };

    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=QuestionDelete',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            bindGrid();
            $("#btnBack").trigger('click');
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

function save() {
    isError = false;
    questionOption = [];
    questionCondition = [];

    var data = {
        QuestionID: _id,
        CategoryID: 1,
        QuestionTypeID: $('#ddlQuestionType').val(),
        IsRequired: $("#cbIsRequired").is(":checked"),
        Name: $('#txtName').val().trim(),
        Hint: $('#txtHint').val().trim(),
        Length: $('#txtLength').val().trim(),
        IsActive: $("#cbIsActive").is(":checked"),
        IsNotApplicableOption: $("#cbIsNotApplicableOption").is(":checked"),
        IsDontKnowOption: $("#cbIsDontKnowOption").is(":checked"),
        IsAdvanced: $("#cbIsAdvanced").is(":checked"),
        Comments: $('#txtComments').val().trim()
    };

    if (data.Length == '')
        data.Length = '0';

    if (data.QuestionTypeID == null || data.QuestionTypeID == -1) {
        toastr["error"]("Please select question type.");
        isError = true;
    }
    if (data.Name == '') {
        toastr["error"]("Please enter name.");
        isError = true;
    }
    if ($('#cbIsAdvanced').is(":checked")) {
        if (data.Comments.trim() == '') {
            toastr["error"]("Please enter comments.");
            isError = true;
        }
    }

    //Options
    switch (parseInt(data.QuestionTypeID)) {
        case QUESTIONTYPES.DROPDOWN:
        case QUESTIONTYPES.RADIO_BUTTON:
        case QUESTIONTYPES.MULTI_CHECKBOX:
            var option = $("#optionContainer").find(".cls-QuestionOptionID");

            if (option.length == 0) {
                toastr["error"]("Please add atleast one option.");
                isError = true;
            }
            for (var i = 0; i < option.length; i++) {
                questionOption.push({
                    QuestionOptionID: parseInt($(option[i]).parents('tr').find(".cls-QuestionOptionID").text()),
                    Option: $(option[i]).parents('tr').find(".cls-Option").text(),
                    IsDelete: $(option[i]).parents('tr').find(".cls-OptionIsDelete").text(),
                    IsActive: true
                });
            }
            for (var i = 0; i < questionOptionDelete.length; i++) {
                questionOption.push({
                    QuestionOptionID: questionOptionDelete[i].QuestionOptionID,
                    Option: questionOptionDelete[i].Option,
                    IsDelete: questionOptionDelete[i].IsDelete
                });
            }
            break;
        case QUESTIONTYPES.TEXTBOX:
        case QUESTIONTYPES.MULTI_TEXTBOX:
            if (data.Length == '' || data.Length == '0' || data.Length.length == 0) {
                toastr["error"]("Please enter length.");
                isError = true;
            }
            break;
    }
    data.QuestionOptions = questionOption;

    //Conditions
    var condition = $("#conditionContainer").find(".cls-QuestionConditionID");

    for (var i = 0; i < condition.length; i++) {
        questionCondition.push({
            QuestionConditionID: parseInt($(condition[i]).parents('tr').find(".cls-QuestionConditionID").text()),
            ConditionQuestionID: $(condition[i]).parents('tr').find(".cls-ConditionQuestionID").text(),
            ConditionID: $(condition[i]).parents('tr').find(".cls-ConditionID").text(),
            ConditionKey: $(condition[i]).parents('tr').find(".cls-ConditionKey").text() == "" ? null : $(condition[i]).parents('tr').find(".cls-ConditionKey").text(),
            ConditionValue: $(condition[i]).parents('tr').find(".cls-ConditionValue").text(),
            IsDelete: $(condition[i]).parents('tr').find(".cls-ConditionIsDelete").text(),
            IsActive: true
        });
    }
    for (var i = 0; i < questionConditionDelete.length; i++) {
        questionCondition.push({
            QuestionConditionID: questionConditionDelete[i].QuestionConditionID,
            IsDelete: questionConditionDelete[i].IsDelete
        });
    }
    data.QuestionConditions = questionCondition;

    if (!isError) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=QuestionInsertOrUpdate',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(data)
        }).done(function (sr) {
            if (sr.HasError == false) {
                bindGrid();
                $("#btnBack").trigger('click');
                if (data.ID == 0)
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

function addOption() {
    if ($('#txtOption').val() == "") {
        toastr["error"]('Please enter option.');
        return;
    }
    if (questionOptionIdEdit == -1) {
        var qo = { QuestionOptionID: questionOptionNo, Option: $('#txtOption').val(), IsDelete: false };
        $("#optionTmpl").tmpl(qo).appendTo("#optionContainer");
        questionOptionNo++;
    }
    else {
        $('.cls-text-Option' + questionOptionIdEdit).text($('#txtOption').val());
    }
    
    $('#txtOption').val('');
    questionOptionIdEdit = -1;
    $('#btnAddOptionText').text('Add');
}

function editOption(questionOptionID) {
    var option = $("#optionContainer").find(".cls-QuestionOptionID");
    for (var i = 0; i < option.length; i++) {
        if (parseInt($(option[i]).parents('tr').find(".cls-QuestionOptionID").text()) == questionOptionID) {
            $('#txtOption').val($(option[i]).parents('tr').find(".cls-Option").text());
            questionOptionIdEdit = questionOptionID;
            $('#btnAddOptionText').text('Edit');
        }
    }
}

function deleteOption(questionOptionID) {
    $('#optionRow' + questionOptionID).remove();
    if (questionOptionID > 0) {
        questionOptionDelete.push({ QuestionOptionID: questionOptionID, Option: "", IsDelete: true });
    }
}

function addCondition() {
    var cond = {
        QuestionConditionID: questionConditionNo,
        ConditionQuestionID: $('#ddlQuestion').val(),
        Question: $('#ddlQuestion option:selected').text(),
        ConditionID: $('#ddlCondition').val(),
        Condition: $('#ddlCondition option:selected').text(),
        IsDelete: false
    };

    switch (parseInt(cond.ConditionID)) {
        case CONDITIONS.NUMBER_WASANSWERED:
        case CONDITIONS.NUMBER_WASNOTANSWERED:
        case CONDITIONS.DROPDOWN_WASANSWERED:
        case CONDITIONS.DROPDOWN_WASNOTANSWERED:
        case CONDITIONS.RADIOBUTTON_WASANSWERED:
        case CONDITIONS.RADIOBUTTON_WASNOTANSWERED:
        case CONDITIONS.CHECKBOX_ISCHECKED:
        case CONDITIONS.CHECKBOX_ISNOTCHECKED:
        case CONDITIONS.MULTICHECKBOX_WASANSWERED:
        case CONDITIONS.MULTICHECKBOX_WASNOTANSWERED:
        case CONDITIONS.DATE_WASANSWERED:
        case CONDITIONS.DATE_WASNOTANSWERED:
        case CONDITIONS.TEXTBOX_WASANSWERED:
        case CONDITIONS.TEXTBOX_WASNOTANSWERED:
        case CONDITIONS.MULTITEXTBOX_WASANSWERED:
        case CONDITIONS.MULTITEXTBOX_WASNOTANSWERED:
        case CONDITIONS.IMAGE_WASANSWERED:
        case CONDITIONS.IMAGE_WASNOTANSWERED:
        case CONDITIONS.LOCATION_WASANSWERED:
        case CONDITIONS.LOCATION_WASNOTANSWERED:
            cond.ConditionKey = null;
            cond.ConditionValue = '';
            break;
        case CONDITIONS.DROPDOWN_IS:
        case CONDITIONS.DROPDOWN_ISNT:
        case CONDITIONS.DROPDOWN_ISONEOF:
        case CONDITIONS.DROPDOWN_ISNTONEOF:
        case CONDITIONS.RADIOBUTTON_IS:
        case CONDITIONS.RADIOBUTTON_ISNT:
        case CONDITIONS.RADIOBUTTON_ISONEOF:
        case CONDITIONS.RADIOBUTTON_ISNTONEOF:
        case CONDITIONS.TEXTBOX_IS:
        case CONDITIONS.TEXTBOX_ISNT:
        case CONDITIONS.TEXTBOX_ISONEOF:
        case CONDITIONS.TEXTBOX_ISNTONEOF:
        case CONDITIONS.MULTICHECKBOX_INCLUDES:
        case CONDITIONS.MULTICHECKBOX_DOESNOTINCLUDE:
        case CONDITIONS.MULTICHECKBOX_ISONEOF:
        case CONDITIONS.MULTICHECKBOX_ISNTONEOF:
            cond.ConditionKey = $('#ddlQuestionOption').val();
            cond.ConditionValue = $('#ddlQuestionOption option:selected').text()
            break;
        default:
            cond.ConditionKey = null;
            cond.ConditionValue = $('#txtCriteria').val()
            break;
    }

    $("#conditionTmpl").tmpl(cond).appendTo("#conditionContainer");
    questionConditionNo++;
    $('#ddlQuestion').val(-1).select2();
    insertDefaultRow("#ddlCondition", "Select");
    $('#txtCriteria').val('');
    insertDefaultRow("#ddlQuestionOption", "Select");
    bindCriteria();
}

function deleteCondition(questionConditionID) {
    $('#conditionRow' + questionConditionID).remove();
    if (questionConditionID > 0) {
        questionConditionDelete.push({ QuestionConditionID: questionConditionID, IsDelete: true });
    }
}

function onQuestionChange() {
    bindCondition();
}

function onConditionChange() {
    bindCriteria();
}

function showHideAdvancePanel() {
    if ($('#cbIsAdvanced').is(":checked")) {
        $('#pnlAdvanced').show();
    }
    else {
        $('#pnlAdvanced').hide();
    }
}

function showHideTab() {
    var classAdd = "active";
    $('.cls-tab').removeClass(classAdd);
    $('#tab-Basic-li, #tab-Basic').addClass(classAdd);
}

function bindCondition() {
    if ($("#ddlQuestion").val() == null || $("#ddlQuestion").val() == "-1") {
        insertDefaultRow("#ddlCondition", "Select");
        return;
    }

    var qData = Enumerable.From(_questionData);

    var questionTypeID = qData
        .Where(function (item) { return item.QuestionID == $("#ddlQuestion").val(); })
        .Select(function (item) { return item.QuestionTypeID; })
        .ToArray();

    var cData = Enumerable.From(_conditionData);
    var condition = cData
        .Where(function (item) { return item.QuestionTypeID == questionTypeID; })
        .ToArray();

    var tmpl = getDefaultValueForDropDown("Select");
    condition.forEach(function (a) {
        tmpl += '<option value="' + a.ConditionID + '">' + a.Name + '</option>';
    });

    $("#ddlCondition").empty();
    $("#ddlCondition").append(tmpl);
    $("#ddlCondition").val(-1).select2();

    bindCriteria();
}

function bindCriteria() {
    var conditionID = parseInt($("#ddlCondition").val());

    switch (conditionID) {
        case CONDITIONS.DEFAULT:
            $("#txtCriteria").val('');
            insertDefaultRow("#ddlQuestionOption", "Select");
            $("#pnlCriteria").hide();
            $("#pnlQuestionOption").hide();
        case CONDITIONS.NUMBER_WASANSWERED:
        case CONDITIONS.NUMBER_WASNOTANSWERED:
        case CONDITIONS.DROPDOWN_WASANSWERED:
        case CONDITIONS.DROPDOWN_WASNOTANSWERED:
        case CONDITIONS.RADIOBUTTON_WASANSWERED:
        case CONDITIONS.RADIOBUTTON_WASNOTANSWERED:
        case CONDITIONS.CHECKBOX_ISCHECKED:
        case CONDITIONS.CHECKBOX_ISNOTCHECKED:
        case CONDITIONS.MULTICHECKBOX_WASANSWERED:
        case CONDITIONS.MULTICHECKBOX_WASNOTANSWERED:
        case CONDITIONS.DATE_WASANSWERED:
        case CONDITIONS.DATE_WASNOTANSWERED:
        case CONDITIONS.TEXTBOX_WASANSWERED:
        case CONDITIONS.TEXTBOX_WASNOTANSWERED:
        case CONDITIONS.MULTITEXTBOX_WASANSWERED:
        case CONDITIONS.MULTITEXTBOX_WASNOTANSWERED:
        case CONDITIONS.IMAGE_WASANSWERED:
        case CONDITIONS.IMAGE_WASNOTANSWERED:
        case CONDITIONS.LOCATION_WASANSWERED:
        case CONDITIONS.LOCATION_WASNOTANSWERED:
            $("#txtCriteria").val('');
            $("#pnlCriteria").hide();
            $("#pnlQuestionOption").hide();
            break;
        case CONDITIONS.DROPDOWN_IS:
        case CONDITIONS.DROPDOWN_ISNT:
        case CONDITIONS.DROPDOWN_ISONEOF:
        case CONDITIONS.DROPDOWN_ISNTONEOF:
        case CONDITIONS.RADIOBUTTON_IS:
        case CONDITIONS.RADIOBUTTON_ISNT:
        case CONDITIONS.RADIOBUTTON_ISONEOF:
        case CONDITIONS.RADIOBUTTON_ISNTONEOF:
        case CONDITIONS.TEXTBOX_IS:
        case CONDITIONS.TEXTBOX_ISNT:
        case CONDITIONS.TEXTBOX_ISONEOF:
        case CONDITIONS.TEXTBOX_ISNTONEOF:
        case CONDITIONS.MULTICHECKBOX_INCLUDES:
        case CONDITIONS.MULTICHECKBOX_DOESNOTINCLUDE:
        case CONDITIONS.MULTICHECKBOX_ISONEOF:
        case CONDITIONS.MULTICHECKBOX_ISNTONEOF:
            $("#pnlCriteria").hide();
            $("#pnlQuestionOption").show();
            bindQuestionOption();
            break;
        default:
            $("#txtCriteria").val('');
            insertDefaultRow("#ddlQuestionOption", "Select");
            $("#pnlCriteria").show();
            $("#pnlQuestionOption").hide();
            break;
    }
}

function bindQuestionOption() {
    if ($("#ddlQuestion").val() == null || $("#ddlQuestion").val() == "-1") {
        insertDefaultRow("#ddlQuestionOption", "Select");
        return;
    }

    obj =
    {
        isActive: null,
        defaultKey: -1,
        defaultValue: '---Select---',
        questionID: $("#ddlQuestion").val() == undefined ? '-1' : $('#ddlQuestion').val()
    };
    var v1 = $.ajax({
        url: '\Service.aspx?rq=QuestionOptionGetDropDownList',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            var tmpl;
            sr.Data.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });

            $("#ddlQuestionOption").empty();
            $("#ddlQuestionOption").append(tmpl);
            $("#ddlQuestionOption").val(-1).select2();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

//select REPLACE(UPPER(qt.Name), ' ', '') + '_' + (REPLACE(REPLACE(UPPER(c.Name), ' ', ''), '''', '')) + ': ' + CONVERT(VARCHAR, c.ConditionID) + ','
//from Conditions c
//left join QuestionTypes qt on qt.QuestionTypeID = c.QuestionTypeID
//order by c.ConditionID
const CONDITIONS = {
    DEFAULT: -1,
    NUMBER_WASANSWERED: 1,
    NUMBER_WASNOTANSWERED: 2,
    NUMBER_ISEQUALTO: 3,
    NUMBER_ISNOTEQUALTO: 4,
    NUMBER_ISGREATERTHAN: 5,
    NUMBER_ISLESSTHAN: 6,
    DROPDOWN_WASANSWERED: 7,
    DROPDOWN_WASNOTANSWERED: 8,
    DROPDOWN_IS: 9,
    DROPDOWN_ISNT: 10,
    DROPDOWN_ISONEOF: 11,
    DROPDOWN_ISNTONEOF: 12,
    RADIOBUTTON_WASANSWERED: 13,
    RADIOBUTTON_WASNOTANSWERED: 14,
    RADIOBUTTON_IS: 15,
    RADIOBUTTON_ISNT: 16,
    RADIOBUTTON_ISONEOF: 17,
    RADIOBUTTON_ISNTONEOF: 18,
    CHECKBOX_ISCHECKED: 19,
    CHECKBOX_ISNOTCHECKED: 20,
    MULTICHECKBOX_WASANSWERED: 21,
    MULTICHECKBOX_WASNOTANSWERED: 22,
    MULTICHECKBOX_INCLUDES: 23,
    MULTICHECKBOX_DOESNOTINCLUDE: 24,
    MULTICHECKBOX_ISONEOF: 25,
    MULTICHECKBOX_ISNTONEOF: 26,
    DATE_WASANSWERED: 27,
    DATE_WASNOTANSWERED: 28,
    DATE_ISBEFORE: 29,
    DATE_ISAFTER: 30,
    TEXTBOX_WASANSWERED: 31,
    TEXTBOX_WASNOTANSWERED: 32,
    TEXTBOX_CONTAINSTEXT: 33,
    TEXTBOX_DOESNOTCONTAINTEXT: 34,
    MULTITEXTBOX_WASANSWERED: 35,
    MULTITEXTBOX_WASNOTANSWERED: 36,
    MULTITEXTBOX_CONTAINSTEXT: 37,
    MULTITEXTBOX_DOESNOTCONTAINTEXT: 38,
    IMAGE_WASANSWERED: 39,
    IMAGE_WASNOTANSWERED: 40,
    IMAGES_WASANSWERED: 41,
    IMAGES_WASNOTANSWERED: 42,
    LOCATION_WASANSWERED: 43,
    LOCATION_WASNOTANSWERED: 44,
}
