var _id = 0;
////var _categoryData;
////var _questionTypeData;
////var questionOption = [];
////var questionOptionDelete = [];
////var questionOptionNo = -100;
////var questionOptionId = -1;
////var questionCondition = [];
////var questionConditionDelete = [];
////var questionConditionNo = -100;
var questionTypes = {
    Number: 1,
    Dropdown: 2,
    Radio_Button: 3,
    Checkbox: 4,
    Multi_Checkbox: 5,
    Date: 6,
    Textbox: 7,
    Multi_Textbox: 8,
    Image: 9,
    Images: 10,
    Location: 11,
    Matrix: 12,
};

const questionTypeFormat = [
    { ID: 1, QuestionTypeID: 7, Format: "URL" },
    { ID: 2, QuestionTypeID: 7, Format: "Email" },
    { ID: 3, QuestionTypeID: 7, Format: "Multiline" },
    { ID: 4, QuestionTypeID: 7, Format: "Singleline" },
    { ID: 5, QuestionTypeID: 6, Format: "YYYY" },
    { ID: 6, QuestionTypeID: 6, Format: "YYYY-MM" },
    { ID: 7, QuestionTypeID: 6, Format: "YYYY-MM-DD" },
    { ID: 8, QuestionTypeID: 6, Format: "YYYY-MM-DD hh:mm" },
    { ID: 9, QuestionTypeID: 6, Format: "YYYY-MM-DD hh:mm:ss" },
    { ID: 10, QuestionTypeID: 6, Format: "YYYY/MM" },
    { ID: 11, QuestionTypeID: 6, Format: "YYYY/MM/DD hh:mm" },
    { ID: 12, QuestionTypeID: 6, Format: "YYYY/MM/DD hh:mm:ss" },
    { ID: 13, QuestionTypeID: 6, Format: "MM-DD-YYYY" },
    { ID: 14, QuestionTypeID: 6, Format: "MM-DD-YYYY hh:mm" },
    { ID: 15, QuestionTypeID: 6, Format: "MM-DD-YYYY hh:mm:ss" },
    { ID: 16, QuestionTypeID: 6, Format: "MM-YYYY" },
    { ID: 17, QuestionTypeID: 6, Format: "MM/DD/YYYY" },
    { ID: 18, QuestionTypeID: 6, Format: "MM/DD/YYYY hh:mm" },
    { ID: 19, QuestionTypeID: 6, Format: "MM/DD/YYYY hh:mm:ss" },
    { ID: 20, QuestionTypeID: 6, Format: "MM/YYYY" },
    { ID: 21, QuestionTypeID: 6, Format: "DD-MM-YYYY" },
    { ID: 22, QuestionTypeID: 6, Format: "DD-MM-YYYY hh:mm" },
    { ID: 23, QuestionTypeID: 6, Format: "DD-MM-YYYY hh:mm:ss" },
    { ID: 24, QuestionTypeID: 6, Format: "DD/MM/YYYY" },
    { ID: 25, QuestionTypeID: 6, Format: "DD/MM/YYYY hh:mm" },
    { ID: 26, QuestionTypeID: 6, Format: "DD/MM/YYYY hh:mm:ss" },
    { ID: 27, QuestionTypeID: 12, Format: "Whole Number" },
    { ID: 28, QuestionTypeID: 12, Format: "Decimal Number" },
    { ID: 29, QuestionTypeID: 1, Format: "Whole Number" },
    { ID: 30, QuestionTypeID: 1, Format: "Decimal Number" }
];


var questionID = -999;
var questionArr = [];
var questionDeleteArr = [];
var questionIDCurrent = 0;
var questionOptionID = -999;
var questionOptionArr = [];
var questionOptionDeleteArr = [];
var questionOptionIDCurrent = 0;
var questionConditionID = -999;
var questionConditionArr = [];
var questionConditionDeleteArr = [];
var questionConditionIDCurrent = 0;
var conditionArr = [];
var sectionID = -999;
var sectionArr = [];
var sectionDeleteArr = [];
var surveyAssigneeId = 0;
var sruveyViewData = [];

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var categoryId = getParameterByName('c');

//Initialization
$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    pageLoad();
    bindGrid();

    $("#btnApply").click(function () {
        bindGrid();
    });

    $("#btnReset").click(function () {
        reset();
    });

    $("#btnAdd").click(function () {
        add();
        $("#divDeploy").hide();

    });

    $("#btnBack").click(function () {
        $("#pnlMain").show();
        $("#pnlAdd").hide();
    });

    $("#btnSave").click(function () {
        save();
    });
    ///temp
    $("#btnSaveAndClose").click(function () {
        tempEdit();
    });
    ///temp
    $("#btnAddQuestion").click(function () {
        if (getActiveSectionPanelId() == 0) {
            toastr["error"]("Please add a section first or select/uncollapse section.");
            return;
        }
        addQuestion(questionID);
    });

    $("#btnQuestionModal").click(function () {
        $("#pnlQuestionModal").modal("show");
    });

    $("#btnAddOption").click(function () {
        addOption();
    });

    $("#btnUpdateOption").click(function () {
        updateOption();
    });

    $("#btnAddCondition").click(function () {
        addCondition();
    });

    $("#btnUpdateCondition").click(function () {
        updateCondition();
    });

    $("#btnAddSection").click(function () {
        $("#sectionNameTb").val('');
        $("#pnlSectionNameModal").modal("show");
    });

    $("#saveSectionNameBtn").click(function () {
        addSection(sectionID);
    });

    $(".toggle-btn").click(function () {
        $(".toggle-btn").removeClass("active-btn btn-success").addClass("inactive-btn"); // Reset all buttons
        $(this).removeClass("inactive-btn").addClass("active-btn btn-success"); // Highlight clicked button
        $(".clsTabs").hide();
    });

    $("#btnDeploy").click(function () {
        $("#divDeploy").show();
        $("#formAction").html('Deploy');
        $("#btnSave").show();
        $("#ddlDeployRole").select2();
        $("#ddlDeployUser").select2();
        loadDeployGrid(_id);
    });

    $("#btnDesign").click(function () {
        $("#divDesign").show();
        $("#formAction").html('Design');
        $("#btnSave").show();
    });

    $("#btnResponses").click(function () {
        $("#divResponses").show();
        $("#formAction").html('Responses');
        $("#btnSave").hide();
        console.log(_id);
        setTimeout(() => { console.log(_id); editResponses(_id); }, 1000);
    });

    //Deploy
    $('.datePicker').datepicker({
        format: "mm/dd/yyyy",
        autoclose: true
    });

    initDeploy();

    $("#ddlDeployRole").change(function () {
        var roleVal = $(this).val();
        var userTmpl = '<option value="-1">--- Select ---</option>';
        if (roleVal != -1 && _questionTypeData) {
            var dbRoleId = (roleVal == 1) ? 1 : (roleVal == 2 ? 3 : 4);
            var filtered = _questionTypeData.filter((u) => { return u.RoleId == dbRoleId });
            filtered.forEach(function (u) {
                userTmpl += '<option value="' + u.UserID + '">' + u.UserName + '</option>';
            });
        }
        $("#ddlDeployUser").html(userTmpl).select2();
    });

    $("#btnSaveDeploySingle").click(function () {
        var roleVal = $("#ddlDeployRole").val();
        var userVal = $("#ddlDeployUser").val();
        if (roleVal == -1) {
            toastr["error"]("Please select role.");
            return;
        }
        if (userVal == -1 || userVal == null) {
            toastr["error"]("Please select user.");
            return;
        }
        
        var dbRoleId = (roleVal == 1) ? 1 : (roleVal == 2 ? 3 : 4);
        var o = {
            SurveyID: _id,
            UserID: userVal,
            RoleID: dbRoleId
        };

        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=DeploySurveySaveSingle',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(o)
        }).done(function (sr) {
            if (sr.HasError == false) {
                toastr["success"]('Record has been saved successfully.');
                $("#ddlDeployRole").val("-1").trigger("change");
                loadDeployGrid(_id);
            } else {
                toastr["error"](sr.ErrorMessage);
            }
            closeLoadingPopup();
        }).fail(function () {
            closeLoadingPopup();
            toastr["error"]('An unexpected error has occurred.');
        });
    });

    $("#btnBack2").click(function () {
        $("#pnlMain2").hide();
        $("#pnlAdd").show();
    });
    
    $("#btnBack3").click(function () {
        $("#pnlMain3").hide();
        $("#pnlAdd").show();
    });

    $("#btnSave2").click(function () {
        saveViewSurvey();
    });
    $("#btnExport").click(function () {
        window.location.href = "./FileTransmissionEndPoint.aspx?rq=ExportResponse&SurveyId=" + _id;
    });
    $("#btnImportTemplate").click(function () {
        window.location.href = "./FileTransmissionEndPoint.aspx?rq=ImportResponseTemplate&SurveyId=" + _id;
    });

    $('#responseUpload').off('click').click(function () {
        $(document).trigger('FileSystemMenu:OnUploadPopup', [this]);
    });

    $('#openUploadModal').click(function () {
        $('#fileInput').val('');
        $('#uploadStatusSuccess').text('');
        $('#uploadStatusSuccess').hide();
        $('#uploadStatusError').text('');
        $('#uploadStatusError').hide();
        $('#downloadFile').hide();
        $('#fileUploadModal').modal('show');
    });

    $('#submitUploadForm').click(function (event) {
        event.preventDefault();
        $('#uploadStatusSuccess').hide();
        $('#uploadStatusError').hide();
        var formData = new FormData($('#fileUploadForm')[0]);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'FileTransmissionEndPoint.aspx?rq=ImportResponse&SurveyId=' + _id, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === 'success') {
                    $('#uploadStatusSuccess').show();
                    $('#uploadStatusSuccess').text('File uploaded successfully!');
                    $('#downloadFile').hide();
                } else {
                    $('#uploadStatusError').show();
                    $('#uploadStatusError').text('Error uploading file: ' + response.message);
                    $('#downloadFile').attr('href', response.fileUrl);
                    $('#downloadFile').show();
                }
            } else {
                $('#uploadStatusError').show();
                $('#uploadStatusError').text('Failed to upload file.');
            }
        };

        xhr.onerror = function () {
            $('#uploadStatusError').show();
            $('#uploadStatusError').text('Error uploading file.');
        };

        xhr.send(formData);
    });

    $('#ddlQuestion').on('change', function () {
        bindCondition();
    });

    $("#btnReport").click(function () {
        window.open('/SurveyReport.aspx?sid=' + _id, '_blank');
    });    
});

function showLoadingPopup() {

}

function closeLoadingPopup() {

}

function resetValues() {
    _id = 0;
    questionID = -999;
    questionArr = [];
    questionIDCurrent = 0;
    questionOptionID = -999;
    questionOptionArr = [];
    questionOptionIDCurrent = 0;
    questionOptionDeleteArr = [];
    questionConditionID = -999;
    questionConditionArr = [];
    questionConditionIDCurrent = 0;
    questionConditionDeleteArr = [];
    sectionArr = [];
    sectionID = -999;
    questionDeleteArr = [];
    surveyAssigneeId = 0;
}



//Survey
function pageLoad() {
    showLoadingPopup();

    var tmpl;
    tmpl += '<option value="-1">---Select---</option>';
    tmpl += '<option value="1">Category-1</option>';
    tmpl += '<option value="2">Category-2</option>';
    tmpl += '<option value="3">Category-3</option>';

    $("#ddlCategory").empty();
    $("#ddlCategory").append(tmpl);
    $("#ddlCategory").val(-1);

    fillConditionList();

    ////tmpl = '';
    ////tmpl += '<option value="-1">---Select---</option>';
    ////tmpl += '<option value="1">Number</option>';
    ////tmpl += '<option value="2">Dropdown</option>';
    ////tmpl += '<option value="3">Radio Button</option>';
    ////tmpl += '<option value="4">Checkbox</option>';
    ////tmpl += '<option value="5">Multi Checkbox</option>';
    ////tmpl += '<option value="6">Date</option>';
    ////tmpl += '<option value="7">Textbox</option>';
    ////tmpl += '<option value="8">Multi Textbox</option>';
    ////tmpl += '<option value="9">Image</option>';
    ////tmpl += '<option value="10">Images</option>';
    ////tmpl += '<option value="11">Location</option>';
    ////tmpl += '<option value="12">Matrix</option>';

    ////$(".cls-QuestionType").empty();
    ////$(".cls-QuestionType").append(tmpl);
    ////$(".cls-QuestionType").val(-1);
}

function reset() {
    $("#ddlFilterCategory").val(-1).select2();
    $("#ddlFilterQuestionType").val(-1).select2();
    bindGrid();
}

function bindGrid() {
    var url = "\Service.aspx?rq=SurveyGetAll&c=" + categoryId;
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        colNames: ['SurveyID', 'Name', 'Description', 'Active'],
        colModel: [
            { name: 'SurveyID', index: 'SurveyID', key: true, search: true, align: 'center', hidden: true },
            { name: 'Name', index: 'Name', search: true },
            { name: 'Description', index: 'Description', search: true },
            { name: 'IsActive', index: 'IsActive', search: true, align: 'center' },
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Survey',
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
                        $('#formAction').text("Design");
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        _id = rowData.SurveyID;
                        console.log("_id" + _id);
                        edit(rowData.SurveyID);
                    },
                    'Delete': function (trigger) {
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id);
                        remove(rowData.SurveyID);
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

function switchDeployAndResponseButton() {
    if (_id == 0) {
        $("#btnDeploy,#btnResponses").hide();
    } else {
        $("#btnDeploy,#btnResponses").show();
    }
}
function add() {
    ////$('#formValues').clearForm();
    $("#pnlMain").hide();
    $("#pnlAdd").show();
    $('#sectionContainer').empty();
    $('#txtName').val('');
    $('#txtDescription').val('');
    $("#divResponses").hide();
    $("#formAction").html('Design');
    $("#divDesign").show();
    resetValues();
    switchDeployAndResponseButton();
}

function saveDesign() {
    isError = false;

    sectionArr.forEach(function (s) {
        var question = questionArr.filter(q => q[0] == s);
        if (question.length == 0) {
            toastr["error"]("Section can not be empty. Kindly add question or remove empty section(s)");
            isError = true;;
        }
    });
    if (isError) {
        return;
    }

    var data = {
        Name: $('#txtName').val().trim(),
        Description: $('#txtDescription').val().trim(),
    };
    data.SurveyID = _id;
    data.IsActive = true;
    data.CategoryID = categoryId;

    if (data.Name == '') {
        toastr["error"]("Please enter name.");
        isError = true;
    }

    if (data.Description == '') {
        toastr["error"]("Please enter description.");
        isError = true;
    }

    questionCount = questionArr.length;
    if (questionCount > 0) {
        //Questions
        var questions = [];

        var html = '';
        $('#pnlErrorMessage').empty();

        var doContinue = false;
        for (var i = 0; i < questionArr.length; i++) {

            questionDeleteArr.forEach((qd) => {
                if (qd.QuestionID == questionArr[i][1]) {
                    doContinue = true;
                }
            });

            if (doContinue === true) {
                continue;
            }


            html = '';
            var question = {};
            question.QuestionID = questionArr[i][1];
            question.QuestionTypeID = $('#ddlQuestionType_' + questionArr[i][1]).val();
            question.FormatID = $('#ddlQuestionTypeFormat_' + questionArr[i][1]).val();
            question.IsRequired = $('#cbQuestionIsRequired_' + questionArr[i][1]).is(":checked");
            question.Name = $('#txtQuestionName_' + questionArr[i][1]).val();
            question.Unit = $('#txtQuestionUnit_' + questionArr[i][1]).val();
            question.Hint = $('#txtQuestionHint_' + questionArr[i][1]).val();
            question.Length = $('#txtQuestionLength_' + questionArr[i][1]).val();
            if (question.Length != undefined) {
                if (question.Length.trim() == '') {
                    question.Length = 0;
                }
            }

            question.IsNotApplicableOption = $('#cbQuestionIsNotApplicableOption_' + questionArr[i][1]).is(":checked");
            question.IsDontKnowOption = $('#cbQuestionIsDontKnowOption_' + questionArr[i][1]).is(":checked");
            question.IsAdvanced = $('#cbQuestionIsAdvanced_' + questionArr[i][1]).is(":checked");
            question.DoRecordGPS = $('#cbQuestionRecordGPS_' + questionArr[i][1]).is(":checked");
            question.Comments = $('#txtQuestionComments_' + questionArr[i][1]).val();
            question.IsActive = $('#cbQuestionIsActive_' + questionArr[i][1]).is(":checked");
            question.sectionID = questionArr[i][0];
            question.sectionName = $('#sectionTitleText_' + questionArr[i][0]).html();

            var csv = '';

            var requiredFormat = [13];
            if (requiredFormat.includes(parseInt(question.QuestionTypeID))) {
                var hasCDddlError = false;
                $("#cddlThead_" + questionArr[i][1]).children('tr').each(function (ri, re) {
                    $(re).children('td').each(function (ci, ce) {
                        if (!$(ce).hasClass("cddlIgnore")) {
                            if ($(ce).find(".cddlName").val().trim() == '') {
                                hasCDddlError = true;
                            }
                            csv = csv + $(ce).find(".cddlName").val() + ',';
                        }

                    })
                    if (csv.length > 0) {
                        csv = csv.slice(0, -1);
                        csv = csv + ';';
                    }
                });



                $("#cddlTbody_" + questionArr[i][1]).children('tr').each(function (ri, re) {
                    $(re).children('td').each(function (ci, ce) {
                        if (!$(ce).hasClass("cddlIgnore")) {
                            if ($(ce).find(".cddlValue").val().trim() == '') {
                                hasCDddlError = true;
                            }
                            csv = csv + $(ce).find(".cddlValue").val() + ',';
                        }
                    })
                    if (csv.length > 0) {
                        csv = csv.slice(0, -1);
                        csv = csv + ';';
                    }
                });

                question.CascadeDropDownMarkup = csv;
            }



            if (hasCDddlError) {
                html += "<li>Kindly fill all cascade drop down names and values.</li>";
                isError = true;
            }

            if (question.QuestionTypeID == null || question.QuestionTypeID == -1) {
                html += "<li>Please select question type.</li>";
                isError = true;
            }
            if (question.Name == '') {
                html += "<li>Please enter question name.</li>";
                isError = true;
            }

            var requiredFormat = [1, 6, 7, 12];
            if (requiredFormat.includes(parseInt(question.QuestionTypeID))) {
                if (['', '-1'].includes(question.FormatID)) {
                    html += "<li>Please select question type format.</li>";
                    isError = true;
                }
            }

            if (question.QuestionTypeID == 12) {
                if (question.Unit == '') {
                    html += "<li>Please enter unit.</li>";
                    isError = true;
                }
            }

            if (!(parseInt(question.QuestionTypeID) >= 2 && parseInt(question.QuestionTypeID) <= 5)) {
                questionOptionArr = questionOptionArr.filter(item => item.QuestionID !== question.QuestionID);
            }

            if (isError) {
                $('#pnlErrorMessage').append('<ul> Question#' + (i + 1));
                $('#pnlErrorMessage').append(html);
                $('#pnlErrorMessage').append('</ul>');
                $('#pnlErrorMessage').append('<br />');
            }
            else
                questions.push(question);
        }
        if (isError) {
            $("#pnlErrorModal").modal("show");
        }

        //Questions Delete
        for (var i = 0; i < questionDeleteArr.length; i++) {
            questions.push({
                QuestionID: questionDeleteArr[i].QuestionID,
                State: questionDeleteArr[i].State,
                IsSectionDeleted: questionDeleteArr[i].IsSectionDeleted,
                SectionID: questionDeleteArr[i].sectionId,
                SectionName: questionDeleteArr[i].sectionName,
            });
        }
        data.Questions = questions;

        //Options
        for (var i = 0; i < questionOptionDeleteArr.length; i++) {
            questionOptionArr.push({
                QuestionID: questionOptionDeleteArr[i].QuestionID,
                QuestionOptionID: questionOptionDeleteArr[i].QuestionOptionID,
                Option: questionOptionDeleteArr[i].Option,
                State: questionOptionDeleteArr[i].State

            });
        }
        data.QuestionOptions = questionOptionArr;

        //Conditions
        for (var i = 0; i < questionConditionDeleteArr.length; i++) {
            questionConditionArr.push({
                QuestionID: questionConditionDeleteArr[i].QuestionID,
                QuestionConditionID: questionConditionDeleteArr[i].QuestionConditionID,
                ConditionQuestionID: questionConditionDeleteArr[i].ConditionQuestionID,
                ConditionID: questionConditionDeleteArr[i].ConditionID,
                State: questionConditionDeleteArr[i].State
            });
        }
        data.QuestionConditions = questionConditionArr;
    }
    else {
        toastr["error"]("Please add atleast one question.");
        isError = true;
    }

    if (!isError) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=SurveyInsertOrUpdate',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(data)
        }).done(function (sr) {
            if (sr.HasError == false) {
                //toastr["success"]('Record has been saved successfully.');
                bindGrid();
                //$("#btnBack").trigger('click');
                if (data.SurveyID == 0)
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

function saveDeploy() {
    isError = false;

    var o = {};
    o.SurveyAssignmentID = 0;
    o.SurveyID = _id;
    o.StartDate = new Date();
    o.EndDate = new Date();
    o.IsActive = true;
    o.AssigneeID = $("#ddlAssignee").val();
    o.ManagerID = $("#ddlManager").val();
    o.SupervisorID = $("#ddlSupervisor").val();

    if (o.AssigneeID == null || o.AssigneeID == 'undefined' || o.AssigneeID.length == 0) {
        toastr["error"]("Please select assignee.");
        isError = true;
    }

    if (o.ManagerID == null || o.ManagerID == 'undefined' || o.ManagerID.length == 0) {
        toastr["error"]("Please select Manager.");
        isError = true;
    }

    if (o.SupervisorID == null || o.SupervisorID == 'undefined' || o.SupervisorID.length == 0) {
        toastr["error"]("Please select Supervisor.");
        isError = true;
    }

    if (!isError) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=SurveyAssignmentInsertOrUpdate',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(o)
        }).done(function (sr) {
            if (sr.HasError == false) {
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

function saveResponses() {

}
function save() {
    if ($("#formAction").html() == 'Design') {
        saveDesign();
    } else if ($("#formAction").html() == 'Deploy') {
        //saveDeploy();
    } else if ($("#formAction").html() == 'Responses') {
        saveResponses();
    }
    switchDeployAndResponseButton();
}

function editSurvey(sid) {
    obj =
    {
        SurveyID: sid
    };

    showLoadingPopup();
    $("#pnlMain").hide();
    $("#pnlAdd").show();
    $('#sectionContainer').empty();
    $('#txtName').val('');
    $('#txtDescription').val('');
    resetValues();
    _id = sid;

    $.ajax({
        url: '\Service.aspx?rq=SurveyGetById',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj)
    }).done(function (sr) {
        if (sr.HasError == false) {
            var data = sr.Data;
            $('#txtName').val(data.Name);
            $('#txtDescription').val(data.Description);

            //Section setup
            var sectionArr = [];
            data.Questions.forEach((q) => {
                if (sectionArr.indexOf(q.SectionID) == -1) {
                    sectionArr[q.SectionID] = false;
                }
            });

            //fill questions
            debugger;
            data.Questions = data.Questions.sort((a, b) => a.SectionID - b.SectionID);
            for (var i = 0; i < data.Questions.length; i++) {
                if (sectionArr[data.Questions[i].SectionID] === false) {
                    addSection(data.Questions[i].SectionID, false, { name: data.Questions[i].SectionName });
                    sectionArr[data.Questions[i].SectionID] = true;
                }

                var dat = data.Questions[i];
                addQuestion(dat.QuestionID);
                fillQuestionData(dat);
            }

            //fill options
            for (var i = 0; i < data.QuestionOptions.length; i++) {
                var dat = data.QuestionOptions[i];
                fillOptionData(dat);
            }

            //fill conditions
            for (var i = 0; i < data.QuestionConditions.length; i++) {
                var dat = data.QuestionConditions[i];
                fillConditionData(dat);
            }
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}
function editDeploy(sid) {
    obj =
    {
        //isActive: null,
        serveyId: _id,
    };
    var v2 = $.ajax({
        url: '\Service.aspx?rq=GetSurveyDeploymentInitDataDTO',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            _questionTypeData = sr.Data;
            $('#ddlAssignee').val(_questionTypeData.Assignees).trigger('change');
            $('#ddlManager').val(_questionTypeData.Managers).trigger('change');
            $('#ddlSupervisor').val(_questionTypeData.Supervisors).trigger('change');
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}
function editResponses(sid2) {
    console.log(sid2);
    var url = "\Service.aspx?rq=SurveySubmitGetAll&sid2=" + sid2;
    $grid = $("#grid2").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ surveyId: sid2 }),
        colNames: ['Survey Assignee ID', 'Survey ID', 'Survey', 'Assignee', 'Assigned Date', 'Start Date', 'End Date', 'Active', 'Submitted', 'Submitted Date', 'Status'],
        colModel: [
            { name: 'SurveyAssigneeID', index: 'SurveyAssigneeID', key: true, search: true, align: 'center', hidden: true },
            { name: 'SurveyID', index: 'SurveyID', search: true, hidden: true },
            { name: 'Survey', index: 'Survey', search: true },
            { name: 'AssigneeUserName', index: 'AssigneeUserName', search: true },
            { name: 'AssignDate', index: 'AssignDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'StartDate', index: 'StartDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' }, hidden: true },
            { name: 'EndDate', index: 'EndDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' }, hidden: true },
            { name: 'IsActive', index: 'IsActive', search: true, align: 'center', hidden: true },
            { name: 'IsSubmitted', index: 'IsSubmitted', search: true, align: 'center', hidden: true },
            { name: 'SubmittedDate', index: 'SubmittedDate', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'Status', index: 'Status', search: true },
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Responses',
        pager: '#gridpager2',
        rowList: [5, 20, 50, 100, 200, 500],
        height: '320px',
        autowidth: true,
        altRows: true,
        altclass: 'myAltRowClass',
        ignoreCase: true,
        loadComplete: function () {
            $("tr.jqgrow", this).contextMenu('GridContextMenu2', {
                bindings: {
                    'Preview': function (trigger) {
                        surveyAssigneeId = trigger.id;
                        previewSurveySubmission(trigger.id);
                    },
                    'View': function (trigger) {
                        surveyAssigneeId = trigger.id;
                        ViewSurvey(trigger.id);
                    }
                },
                onContextMenu: function (event) {
                    return true;
                }
            });
            var width = $('#ParentDiv2').width();
            $('#grid2').setGridWidth(width);
        }
    });
    $("#grid2").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: 'cn' });
    $("#grid2").jqGrid('setGridParam', { url: url, datatype: "json", page: 1 }).trigger("reloadGrid");
}

function edit(sid) {
    editSurvey(sid);
    //editDeploy(sid);
    $(".clsTabs").hide();
    $("#btnDesign").trigger('click');
    switchDeployAndResponseButton();
}

function remove(id) {
    obj =
    {
        Id: id
    };

    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=DeleteSurveyById',
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



//Questions
function addQuestion(qid) {
    if (sectionArr.length > 0) {
        if (getActiveSectionPanelId() == 0) {
            toastr["error"]("Please add a section first or select/uncollapse section.");
            return;
        }
    }
    if ($('#txtName').val() == '' || $('#txtDescription').val() == '') {
        toastr["error"]("Please enter name and description.");
        return;
    }
    var qo = { QuestionID: qid };
    $("#questionTmpl").tmpl(qo).appendTo("#questionContainer_" + getActiveSectionPanelId());

    questionArr.push([getActiveSectionPanelId(), qid]);
    bindQuestionType(qid);
    pnlQuestionShowHide(qid);
    updateQuestionSequence();
    if (qid < 0) {
        questionID++;
    }
    bindQuestionOld(qid);
    emptyCascadeDropDownContainer(qid);
}

function loadFormatDropDown(qid, fid) {
    var qtid = $("#ddlQuestionType_" + qid).val();

    var formats = questionTypeFormat.filter(f => f.QuestionTypeID == qtid);
    var tmpl = '<option value="-1">--- Select ---</option>';
    formats.forEach(function (f) {
        tmpl += '<option value="' + f.ID + '">' + f.Format + '</option>';
    });
    $("#ddlQuestionTypeFormat_" + qid).empty().append(tmpl);
    if (fid) {
        $("#ddlQuestionTypeFormat_" + qid).val(fid);
    }
}

function onchangeQuestionType(qid, fid) {
    if ($("#ddlQuestionType_" + qid).val() == 12) {
        $("#txtQuestionUnit_" + qid).val('');
        $("#divQuestionUnit_" + qid).show();
    } else {
        $("#divQuestionUnit_" + qid).hide();
    }

    if ($("#ddlQuestionType_" + qid).val() == 13) {
        emptyCascadeDropDownContainer(qid);
        $("#pnlCascadeDiv_" + qid).show();
    } else {
        $("#pnlCascadeDiv_" + qid).hide();
    }

    if (['7', '6', '12', '1'].includes($("#ddlQuestionType_" + qid).val())) {
        $("#formatDiv_" + qid).show();
    } else {
        $("#formatDiv_" + qid).hide();
    }

    //alert('onchangeQuestionType');
    questionOptionArr = questionOptionArr.filter(item => item.QuestionID !== qid);
    pnlOptionShowHide(qid);
    loadFormatDropDown(qid, fid);
}

function bindQuestionType(qid) {
    var tmpl = '';
    tmpl += '<option value="-1">---Select---</option>';
    tmpl += '<option value="1">Number</option>';
    tmpl += '<option value="2">Dropdown</option>';
    tmpl += '<option value="3">Radio Button</option>';
    tmpl += '<option value="4">Checkbox</option>';
    tmpl += '<option value="5">Multi Checkbox</option>';
    tmpl += '<option value="6">Date</option>';
    tmpl += '<option value="7">Text</option>';
    //tmpl += '<option value="8">Multi Textbox</option>';
    tmpl += '<option value="9">Image</option>';
    tmpl += '<option value="10">Images</option>';
    tmpl += '<option value="11">Location</option>';
    //tmpl += '<option value="12">Matrix</option>'
    tmpl += '<option value="12">Unit</option>'
    tmpl += '<option value="13">Cascade Dropdown</option>';

    $("#ddlQuestionType_" + qid).empty();
    $("#ddlQuestionType_" + qid).append(tmpl);
    $("#ddlQuestionType_" + qid).val(-1);
}

function onchangeQuestionName(qid) {
    $('#questionTitleText_' + qid).text($('#txtQuestionName_' + qid).val());
}

function onblurQuestionName(qid) {
    $('#questionTitle_' + qid).text($('#txtQuestionName_' + qid).val());
}

function bindQuestionName() {
    $(".cls-QuestionName").keyup(function () {
        var ctrl = $(this);
        var qid = ctrl[0].id.split("_")[1];
        $('#questionTitle_' + qid).text($('#txtQuestionName_' + qid).val());
    });
}

function updateQuestionSequence() {
    sectionArr.forEach((j) => {
        var questionArrTemp = questionArr.filter(q => q[0] == j);
        for (var i = 0; i < questionArrTemp.length; i++) {
            $('#questionSequence_' + questionArrTemp[i][1]).text((i + 1));
        }
    });
}

function removeQuestion(qid) {
    secID = questionArr.filter(item => item[1] !== qid)[0][1];
    questionArr = questionArr.filter(item => item[1] !== qid);
    questionOptionArr = questionOptionArr.filter(item => item.QuestionID !== qid);
    questionConditionArr = questionConditionArr.filter(item => item.QuestionID !== qid);
    if (qid > 0)
        questionDeleteArr.push({ sectionId: secID, sectionName: $('#sectionTitleText_' + secID).html(), QuestionID: qid, State: 3 });
    $('#divQuestion_' + qid).remove();
    updateQuestionSequence();
}

function removeSection(sid) {
    questionArrTemp = questionArr.filter(item => item[0] == sid);
    questionArrTemp.forEach((q) => {
        questionOptionArr = questionOptionArr.filter(item => item.QuestionID !== q[1]);
        questionConditionArr = questionConditionArr.filter(item => item.QuestionID !== q[1]);
        if (q[1] > 0)
            questionDeleteArr.push({ sectionId: sid, sectionName: $('#sectionTitleText_' + sid).html(), QuestionID: q[1], State: 3, IsSectionDeleted: true });
    });
    questionArr = questionArr.filter(item => item[0] !== sid);
    $('#divsection_' + sid).remove();
    sectionArr = sectionArr.filter(s => s != sid);
    //sectionDeleteArr.push({ sectionId: sid, sectionName: $('#sectionTitleText_' + sid).html(), State: 3 });
}

function pnlQuestionShowHide(qid) {
    //alert(qid);
    if ($('#diviboxcontent_' + qid).is(':visible')) {
        $('#divibox_' + qid).addClass('border-bottom');
        $('#btnibox_' + qid).removeClass('fa-chevron-up');
        $('#btnibox_' + qid).addClass('fa-chevron-down');
        $('#diviboxcontent_' + qid).hide();
    }
    else {
        $('#divibox_' + qid).removeClass('border-bottom');
        $('#btnibox_' + qid).addClass('fa-chevron-up');
        $('#btnibox_' + qid).removeClass('fa-chevron-down');
        $('#diviboxcontent_' + qid).show();
    }
}

function bindQuestion(cqid) {
    var tmpl = '';
    tmpl += '<option value="-1">---Select---</option>';

    var questionLength = $('.cls-QuestionName').length;
    for (var i = 0; i < questionLength; i++) {
        var qid = $('.cls-QuestionName')[i].id.split('_')[1];
        var qname = $('#txtQuestionName_' + qid).val();
        if (qid != cqid && qname.length > 0) {
            tmpl += '<option value="' + qid + '">' + qname + '</option>';
        }
    }

    $("#ddlQuestion").empty();
    $("#ddlQuestion").append(tmpl);
    $("#ddlQuestion").val(-1);
}

function fillQuestionData(quest) {

    $('#ddlQuestionType_' + quest.QuestionID).val(quest.QuestionTypeID);
    $('#cbQuestionIsRequired_' + quest.QuestionID).prop("checked", quest.IsRequired);
    $('#txtQuestionName_' + quest.QuestionID).val(quest.Name);
    $('#txtQuestionHint_' + quest.QuestionID).val(quest.Hint);
    $('#txtQuestionLength_' + quest.QuestionID).val(quest.Length);
    $('#cbQuestionIsNotApplicableOption_' + quest.QuestionID).prop("checked", quest.IsNotApplicableOption);
    $('#cbQuestionIsDontKnowOption_' + quest.QuestionID).prop("checked", quest.IsDontKnowOption);
    $('#cbQuestionIsAdvanced_' + quest.QuestionID).prop("checked", quest.IsAdvanced);
    $('#txtQuestionComments_' + quest.QuestionID).val(quest.Comments);
    $('#cbQuestionIsActive_' + quest.QuestionID).prop("checked", quest.IsActive);
    loadFormatDropDown(quest.QuestionID);
    if (quest.FormatID) {
        $('#ddlQuestionTypeFormat_' + quest.QuestionID).val(quest.FormatID);
    }

    if (quest.QuestionTypeID == 12) {
        $("#txtQuestionUnit_" + quest.QuestionID).val('');
        $("#divQuestionUnit_" + quest.QuestionID).show();
    } else {
        $("#divQuestionUnit_" + quest.QuestionID).hide();
    }

    if (quest.Unit) {
        $('#txtQuestionUnit_' + quest.QuestionID).val(quest.Unit);
    }

    if ($("#ddlQuestionType_" + quest.QuestionID).val() == 13) {
        $("#pnlCascadeDiv_" + quest.QuestionID).show();
    } else {
        $("#pnlCascadeDiv_" + quest.QuestionID).hide();
    }

    loadQuestionDesignCascadeDropdownFromMarkup(quest.QuestionID, quest.CascadeDropDownMarkup);

    onchangeQuestionName(quest.QuestionID);
    //onchangeQuestionType(quest.QuestionID, quest.FormatID);
    questionOptionArr = questionOptionArr.filter(item => item.QuestionID !== qid);
    pnlOptionShowHide(quest.QuestionID);
    loadFormatDropDown(quest.QuestionID, quest.FormatID);
}

function getValueByQuestionId(qid, elementId) {
    return $('#' + elementId + qid).val();
}

//function onchangeQuestionOld(qid) {
//    if ($("#ddlQuestionOld_" + qid).val() > 0) {
//        $('.cls-' + qid).prop('disabled', true);
//    }
//    else {
//        $('.cls-' + qid).prop('disabled', false);

//        $('#ddlQuestionType_' + qid).val(-1);
//        $('#cbQuestionIsRequired_' + qid).prop('checked', true);
//        $('#txtQuestionName_' + qid).val('');
//        $('#txtQuestionHint_' + qid).val('');
//        $('#txtQuestionLength_' + qid).val('');
//        $('#cbQuestionIsNotApplicableOption_' + qid).prop('checked', false);
//        $('#cbQuestionIsDontKnowOption_' + qid).prop('checked', false);
//        $('#cbQuestionIsAdvanced_' + qid).prop('checked', false);
//        $('#txtQuestionComments_' + qid).val('');
//        $('#cbQuestionIsActive_' + qid).prop('checked', true);
//    }
//}

function bindQuestionOld(qid) {
    var tmpl = '';
    tmpl += '<option value="-1">---Select---</option>';
    //tmpl += '<option value="1">Question-1</option>';
    //tmpl += '<option value="2">Question-2</option>';
    //tmpl += '<option value="3">Question-3</option>';

    tmpl += '<option value="1">Multi Checkbox question</option>';
    tmpl += '<option value="2">Image Question</option>';
    tmpl += '<option value="3">Location Question</option>';
    tmpl += '<option value="4">this is survey</option>';
    tmpl += '<option value="5">num</option>';
    tmpl += '<option value="6">txt</option>';
    tmpl += '<option value="7">1</option>';
    tmpl += '<option value="8">ddl</option>';
    tmpl += '<option value="11">asdasd</option>';
    tmpl += '<option value="99">test question</option>';

    //$("#ddlQuestionOld_" + qid).empty();
    //$("#ddlQuestionOld_" + qid).append(tmpl);
    //$("#ddlQuestionOld_" + qid).val(-1);
}



//Options
function btnAddOptionModal(qid) {
    $("#btnAddOption").show();
    $("#btnUpdateOption").hide();
    $('#txtOption').val('');
    questionIDCurrent = qid;
    var arr = questionOptionArr.filter(item => item.QuestionID == qid);
    $("#optionContainer").empty();
    $("#optionTmpl").tmpl(arr).appendTo("#optionContainer");
    $("#pnlOptionModal").modal("show");
}

function addOption() {
    $("#btnAddOption").show();
    $("#btnUpdateOption").hide();
    isError = false;

    if ($('#txtOption').val() == "") {
        toastr["error"]('Please enter option.');
        return;
    }

    var qo = { QuestionID: questionIDCurrent, QuestionOptionID: questionOptionID, Option: $('#txtOption').val(), State: 1 };
    questionOptionArr.push(qo);
    $("#optionTmpl").tmpl(qo).appendTo("#optionContainer");
    $('#btnAddOptionText').text('Add');
    $('#txtOption').val('');
    questionOptionID++;
}

function editOption(qid, qoid) {
    $("#btnAddOption").hide();
    $("#btnUpdateOption").show();
    var arr = questionOptionArr.filter(item => item.QuestionID == qid && item.QuestionOptionID == qoid);
    $('#txtOption').val(arr[0].Option);
    questionIDCurrent = qid;
    questionOptionIDCurrent = qoid;
}

function deleteOption(qid, qoid) {
    $('#optionRow_' + qid + '_' + qoid).remove();
    questionOptionArr = questionOptionArr.filter(item => item.QuestionID !== qid && item.QuestionOptionID !== qoid);
    if (qoid > 0) {
        questionOptionDeleteArr.push({ QuestionID: qid, QuestionOptionID: qoid, Option: "", State: 3 });
    }
}

function updateOption() {
    $('#optionCell_' + questionIDCurrent + '_' + questionOptionIDCurrent).text($('#txtOption').val());
    var arr = questionOptionArr.filter(item => item.QuestionID == questionIDCurrent && item.QuestionOptionID == questionOptionIDCurrent);
    arr[0].Option = $('#txtOption').val();
    arr[0].State = 2;
    $('#optionStateCell_' + questionIDCurrent + '_' + questionOptionIDCurrent).text("2");
    $('#txtOption').val('');
    $("#btnAddOption").show();
    $("#btnUpdateOption").hide();
}

function fillOptionData(opt) {
    questionOptionArr.push(opt);
    $("#optionTmpl").tmpl(opt).appendTo("#optionContainer");
}

function pnlOptionShowHide(qid) {
    var qtypeId = parseInt(getValueByQuestionId(qid, 'ddlQuestionType_'));
    switch (qtypeId) {
        case questionTypes.Checkbox:
        case questionTypes.Dropdown:
        case questionTypes.Multi_Checkbox:
        case questionTypes.Radio_Button:
            $('#pnlOption_' + qid).show();
            break;
        default:
            $('#pnlOption_' + qid).hide();
            break;
    }
}



//Conditions
function btnAddConditionModal(qid) {
    $("#btnAddCondition").show();
    $("#btnUpdateCondition").hide();
    $('#txtOption').val('');
    questionIDCurrent = qid;
    var arr = questionConditionArr.filter(item => item.QuestionID == qid);
    $("#conditionContainer").empty();
    $("#conditionTmpl").tmpl(arr).appendTo("#conditionContainer");
    $("#pnlConditionModal").modal("show");
    bindQuestion(questionIDCurrent);
}

function addCondition() {
    $("#btnAddCondition").show();
    $("#btnUpdateCondition").hide();
    isError = false;

    if ($('#ddlQuestion').val() == null || $('#ddlQuestion').val() == -1) {
        toastr["error"]("Please select question.");
        isError = true;
    }

    if ($('#ddlCondition').val() == null || $('#ddlCondition').val() == -1) {
        toastr["error"]("Please select condition.");
        isError = true;
    }

    if (isError) {
        return;
    }

    var qc = { QuestionConditionID: questionConditionID, QuestionID: questionIDCurrent, ConditionQuestionID: $('#ddlQuestion').val(), ConditionQuestion: $('#ddlQuestion option:selected').text(), ConditionID: $('#ddlCondition').val(), Condition: $('#ddlCondition option:selected').text(), State: 1 };
    questionConditionArr.push(qc);
    $("#conditionTmpl").tmpl(qc).appendTo("#conditionContainer");
    $('#btnAddConditionText').text('Add');
    $('#ddlQuestion').val(-1);
    $('#ddlCondition').val(-1);
    questionConditionID++;
}

////function editCondition(qid, qcid) {
////    $("#btnAddCondition").hide();
////    $("#btnUpdateCondition").show();
////    var arr = questionConditionArr.filter(item => item.QuestionID == qid && item.QuestionConditionID == qcid);
////    $('#txtOption').val(arr[0].Option);
////    questionIDCurrent = qid;
////    questionConditionIDCurrent = qcid;
////}

function deleteCondition(qid, qcid) {
    $('#conditionRow_' + qid + '_' + qcid).remove();
    questionConditionArr = questionConditionArr.filter(item => item.QuestionID !== qid && item.QuestionConditionID !== qcid);
    if (qcid > 0) {
        questionConditionDeleteArr.push({ QuestionConditionID: qcid, QuestionID: qid, State: 3 });
    }
}

function fillConditionData(cond) {
    //cond.ConditionQuestion = $("#txtQuestionName_" + cond.ConditionQuestionID).val();
    //cond.Condition = conditionArr.find(function (item) {
    //    return item.Key === cond.ConditionID;
    //}).Value;
    questionConditionArr.push(cond);
    $("#conditionTmpl").tmpl(cond).appendTo("#conditionContainer");
}

function fillConditionList() {
    conditionArr.push({ Key: 1, Value: "Cond1" });
    conditionArr.push({ Key: 2, Value: "Cond2" });
    conditionArr.push({ Key: 3, Value: "Cond2" });

    var tmpl = '<option value="-1">--- Select ---</option>';
    conditionArr.forEach(function (a) {
        tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
    });
    tmpl = '<option value="-1">--- Select ---</option>';
    $("#ddlCondition").empty();
    $("#ddlCondition").append(tmpl);
    $("#ddlCondition").val(-1);
}



//temp
function tempEdit() {
    var data = {};
    data.SurveyID = 0;
    data.Name = 'Survey Name';
    data.Description = 'Survey Description';

    var q1 = -1;
    var q2 = 2;
    var q3 = -3;

    var questions = [];
    questions.push(
        {
            QuestionID: q1,
            QuestionTypeID: 2,
            IsRequired: true,
            Name: 'Name1',
            Hint: 'Hint1',
            Length: 1,
            IsNotApplicableOption: false,
            IsDontKnowOption: true,
            IsAdvanced: false,
            Comments: 'Comments1',
            IsActive: true,
        }
    );
    questions.push(
        {
            QuestionID: q2,
            QuestionTypeID: 7,
            IsRequired: false,
            Name: 'Name2',
            Hint: 'Hint2',
            Length: 2,
            IsNotApplicableOption: true,
            IsDontKnowOption: false,
            IsAdvanced: true,
            Comments: 'Comments2',
            IsActive: false,
        }
    );
    questions.push(
        {
            QuestionID: q3,
            QuestionTypeID: 3,
            IsRequired: false,
            Name: 'Name3',
            Hint: 'Hint3',
            Length: 3,
            IsNotApplicableOption: true,
            IsDontKnowOption: false,
            IsAdvanced: true,
            Comments: 'Comments3',
            IsActive: false,
        }
    );
    data.Questions = questions;

    var options = [];
    options.push(
        {
            QuestionID: q1,
            QuestionOptionID: 1,
            Option: 'Op1',
            State: 4,
        }
    );
    options.push(
        {
            QuestionID: q1,
            QuestionOptionID: 2,
            Option: 'Op2',
            State: 4,
        }
    );
    options.push(
        {
            QuestionID: q3,
            QuestionOptionID: 3,
            Option: 'Op3',
            State: 4,
        }
    );
    data.QuestionOptions = options;

    var conditions = [];
    conditions.push(
        {
            ConditionQuestionID: 1,
            QuestionID: q1,
            ConditionQuestionID: q3,
            ConditionID: 2,
            State: 4,
        }
    );
    data.QuestionConditions = conditions;

    edit(data);
}



//Section
function addSection(sid, isUI = true, params) {
    var name = '';
    if (isUI) {
        var name = $("#sectionNameTb").val().trim();
        if (name == '') {
            toastr["error"]("Please enter Section name.");
            return;
        }

        $("#pnlSectionNameModal").modal("hide");
    } else {
        name = params.name;
    }


    var activeSectionPanelId = getActiveSectionPanelId();
    if (activeSectionPanelId !== 0) {
        pnlSectionShowHide(activeSectionPanelId);
    }

    var qo = { SectionID: sid, SectionName: name };
    $("#sectionTmpl").tmpl(qo).appendTo("#sectionContainer");
    sectionArr.push(sid);
    updateSectionSequence();
    if (sid < 0) {
        sectionID++;
    }
}

function updateSectionSequence() {
    for (var i = 0; i < sectionArr.length; i++) {
        $('#sectionSequence_' + sectionArr[i]).text((i + 1));
    }
}

function pnlSectionShowHide(sid) {
    if (getActiveSectionPanelId() !== 0 && getActiveSectionPanelId() !== sid) {
        pnlSectionShowHide(getActiveSectionPanelId());
    }

    if ($('#diviboxcontentsection_' + sid).is(':visible')) {
        $('#diviboxsection_' + sid).addClass('border-bottom');
        $('#btniboxsection_' + sid).removeClass('fa-chevron-up');
        $('#btniboxsection_' + sid).addClass('fa-chevron-down');
        $('#diviboxcontentsection_' + sid).hide();
    }
    else {

        $('#diviboxsection_' + sid).removeClass('border-bottom');
        $('#btniboxsection_' + sid).addClass('fa-chevron-up');
        $('#btniboxsection_' + sid).removeClass('fa-chevron-down');
        $('#diviboxcontentsection_' + sid).show();
    }
}

function pnlSectionShowHide2(sid) {
    //if (getActiveSectionPanelId() !== 0 && getActiveSectionPanelId() !== sid) {
    //    pnlSectionShowHide(getActiveSectionPanelId());
    //}

    if ($('#diviboxcontentsection2_' + sid).is(':visible')) {
        $('#diviboxsection2_' + sid).addClass('border-bottom');
        $('#btniboxsection2_' + sid).removeClass('fa-chevron-up');
        $('#btniboxsection2_' + sid).addClass('fa-chevron-down');
        $('#diviboxcontentsection2_' + sid).hide();
    }
    else {

        $('#diviboxsection2_' + sid).removeClass('border-bottom');
        $('#btniboxsection2_' + sid).addClass('fa-chevron-up');
        $('#btniboxsection2_' + sid).removeClass('fa-chevron-down');
        $('#diviboxcontentsection2_' + sid).show();
    }
}

function getActiveSectionPanelId() {
    for (var i = 0; i < sectionArr.length; i++) {
        if ($('#diviboxcontentsection_' + sectionArr[i]).is(':visible')) {
            return sectionArr[i];
        }
    }

    return 0;
}


//Deploy
function initDeploy() {
    obj =
    {
        //isActive: null,
        serveyId: _id,
    };
    var v2 = $.ajax({
        url: '\Service.aspx?rq=GetAllUserDropDownList',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            _questionTypeData = sr.Data;

            //var assigneeUser = _questionTypeData.filter((u) => { return u.RoleId == 1 });
            //var tmpl = '<option value="-1">--- Select ---</option>';
            //assigneeUser.forEach(function (a) {
            //    tmpl += '<option value="' + a.UserID + '">' + a.UserName + '</option>';
            //});

            //$("#ddlAssignee").empty();
            //$("#ddlAssignee").append(tmpl.replace("---All---", "---Select---"));
            //$("#ddlAssignee").val(assigneeUser).select2();

            //var managerUser = _questionTypeData.filter((u) => { return u.RoleId == 3 });
            //var tmpl = '<option value="-1">--- Select ---</option>';
            //managerUser.forEach(function (a) {
            //    tmpl += '<option value="' + a.UserID + '">' + a.UserName + '</option>';
            //});

            //$("#ddlManager").empty();
            //$("#ddlManager").append(tmpl.replace("---All---", "---Select---"));
            //$("#ddlManager").val(managerUser).select2();

            //var supervisorUser = _questionTypeData.filter((u) => { return u.RoleId == 4 });
            //var tmpl = '<option value="-1">--- Select ---</option>';
            //supervisorUser.forEach(function (a) {
            //    tmpl += '<option value="' + a.UserID + '">' + a.UserName + '</option>';
            //});

            //$("#ddlSupervisor").empty();
            //$("#ddlSupervisor").append(tmpl.replace("---All---", "---Select---"));
            //$("#ddlSupervisor").val(supervisorUser).select2();
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}


//PreView Survey
function previewSurveySubmission(surveyAssigneID) {
    $("#pnlMain2").show();
    $("#pnlAdd").hide();

    $.ajax({
        url: '\Service.aspx?rq=SurveySubmitGetById',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ SurveyAssigneeID: surveyAssigneID })
    }).done(function (sr) {
        if (sr.HasError == false) {
            $("#pnlMain").hide();
            $("#pnlSubmit").show();
            generateSurveyPreView(sr.Data);
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function getInputMask(format) {
    //var format = 'YYYY-MM-DD hh:mm:ss';
    var inputMask = '';
    const keywords = ['Y', 'M', 'D', 'h', 'm', 's'];
    format.split('').forEach(function (c) {
        if (keywords.includes(c)) {
            inputMask += '9';
        } else {
            inputMask += c;
        }
    });
    return inputMask;
}

function applyMask() {
    $(".clsWholeNumberMask").inputmask({
        alias: "numeric",
        digits: 0, // No decimals (whole number)
        rightAlign: false,
        allowMinus: true, // Set to true if negative numbers are allowed
        integerDigits: 10 // Limit number of digits (optional)
    });

    $(".clsDecimalNumberMask").inputmask("decimal", {
        radixPoint: ".",  // Decimal separator
        digits: 4,        // Number of decimal places
        rightAlign: false,
        allowMinus: true // Allow negative numbers (set to true if needed)
    });

    $(".clsURLMask").inputmask({
        alias: "url",
        placeholder: "https://"
    });

    $(".clsEmailMask").inputmask({
        alias: "email"
    });

    $(".clsDateMask").each(function (i, c) {
        $(c).inputmask({
            alias: "datetime",
            inputFormat: $(c).attr('placeholder'),
            placeholder: $(c).attr('placeholder'),
            showMaskOnHover: false
        });
    });
}

function generateId(length = 8) {
    return Math.random().toString(36).substr(2, length);
}
function generateSurveyPreView(data) {
    surveyQuestions = data.SurveyQuestions;

    var sections = Enumerable
        .From(data.SurveyQuestions)
        .Select(function (sq) {
            return { SectionName: sq.SurveySection, SectionID: sq.SurveySectionID }
        })
        .Distinct("$.SectionID")
        .ToArray();
    $("#sectionContainer2").empty();
    sections.forEach(function (section) {
        $("#sectionTmpl2").tmpl(section).appendTo("#sectionContainer2");
        var questions = Enumerable
            .From(data.SurveyQuestions)
            .Where((sq) => sq.SurveySectionID == section.SectionID)
            .Select(function (sq) { return sq; })
            .OrderBy(function (sq) { sq.Sequence; })
            .ToArray();
        questions.forEach(function (q) {
            var answerData = Enumerable.From(data.SurveySubmitQuestions);
            var answer = answerData
                .Where(function (item) { return item.QuestionID == q.QuestionID; })
                .Select(function (item) { return item; })
                .ToArray();
            q.SurveyAssigeeID = data.SurveyAssigeeID;
            q.DoRecordGPS = q.DoRecordGPS;
            q.Latitude = answer.length > 0 ? answer[0].Latitude : '';
            q.Longitude = answer.length > 0 ? answer[0].Longitude : '';
            q.Comment = answer.length > 0 ? answer[0].Comment : '';
            switch (q.QuestionTypeID) {
                case 1: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, q.QuestionTypeID);
                    $("#numberQuestionTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 2: {
                    var option = Enumerable.From(data.SurveyQuestionOptions)
                        .Where(function (item) { return item.QuestionID == q.QuestionID; })
                        .Select(function (item) { return item; })
                        .ToArray();
                    q.Options = [{ QuestionOptionID: '-1', QuestionID: '-1', Question: null, Option: '--- Select ---', IsActive: false }, ...option];
                    q.Answer = GetAnswerData(data, q.QuestionID, true, q.QuestionTypeID);
                    if (q.Answer == '') {
                        q.Answer = '-1';
                    }
                    $("#dropdownQuestionTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 3: {
                    var option = Enumerable.From(data.SurveyQuestionOptions)
                        .Where(function (item) { return item.QuestionID == q.QuestionID; })
                        .Select(function (item) { return item; })
                        .ToArray();
                    q.Options = option;
                    q.Answer = GetAnswerData(data, q.QuestionID, true, q.QuestionTypeID);
                    $("#radioQuestionTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 4: {
                    var option = Enumerable.From(data.SurveyQuestionOptions)
                        .Where(function (item) { return item.QuestionID == q.QuestionID; })
                        .Select(function (item) { return item; })
                        .ToArray();
                    q.Options = option;
                    q.Answer = GetAnswerData(data, q.QuestionID, true, q.QuestionTypeID);
                    $("#cbQuestionTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 5: {
                    var option = Enumerable.From(data.SurveyQuestionOptions)
                        .Where(function (item) { return item.QuestionID == q.QuestionID; })
                        .Select(function (item) { return item; })
                        .ToArray();
                    q.Options = option;
                    q.Answer = GetAnswerData(data, q.QuestionID, false, q.QuestionTypeID);
                    q.isChecked = function (optionId) {
                        return this.Answer.split(',').includes(optionId.toString());
                    }
                    $("#mcbQuestionTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 6: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, 0);
                    $("#inputTextDateTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 7: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, 0);
                    $("#inputTextTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 8: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, 0);
                    $("#inputMultiTextTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 9: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, q.QuestionTypeID);
                    $("#inputImageTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 10: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, q.QuestionTypeID);
                    $("#inputImagesTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 11: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, q.QuestionTypeID);
                    if (q.Answer[2] == "1") {
                        q.Answer[2] = "Current Location";
                    } else if (q.Answer[2] == "2") {
                        q.Answer[2] = "Use Map";
                    } else {
                        q.Answer[2] = "Enter Manually";
                    }
                    $("#locationTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 12: {
                    q.Answer = GetAnswerData(data, q.QuestionID, false, q.QuestionTypeID);
                    $("#inputUnitTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);
                    break;
                }
                case 13: {
                    var lines = q.CascadeDropDownMarkup.split(';');
                    var header = lines[0].split(',');

                    q.Answer = GetAnswerData(data, q.QuestionID, false, q.QuestionTypeID);
                    q.CascadeDdlNames = header;
                    $("#cddlQuestionTmpl").tmpl(q).appendTo("#questionContainer2_" + section.SectionID);

                    lines.shift();

                    var values = [];
                    $(lines).each(function (i, o) {
                        var cells = o.split(',');
                        if (values.indexOf(cells[0]) == -1) {
                            values.push(cells[0]);
                        }
                    });

                    var tmpl = '<option value="-1">--- Select ---</option>';
                    $(values).each(function (i, o) {
                        if (o == '') {
                            return;
                        }
                        tmpl += '<option value="' + generateId() + '">' + o + '</option>';
                    });
                    $("select[name='" + encodeURIComponent(header[0]) + "']").empty().append(tmpl);


                    var ansCell = q.Answer.split(',');
                    $("select[name='" + encodeURIComponent(header[0]) + "'] option").each(function () {
                        if ($(this).text() === ansCell[0]) {
                            $(this).prop('selected', true);
                            return false; // exit the loop
                        }
                    });

                    $(header).each(function (i, h) {
                        var index = (i + 1) > header.length - 1 ? i : i + 1;
                        $("select[name='" + encodeURIComponent(h) + "']").trigger('change');
                        $("select[name='" + encodeURIComponent(header[index]) + "'] option").each(function () {
                            if ($(this).text() === ansCell[index]) {
                                $(this).prop('selected', true);
                                return false; // exit the loop
                            }
                        });
                    });
                    break;
                }
                default:
                    alert('error!');
            }
        });
    });

    applyMask();
    updateSectionSequence2(sections);
}

function GetAnswerData(data, QuestionId, isId, pQuestionTypeId) {
    var answerData = Enumerable.From(data.SurveySubmitQuestions);
    var answer = answerData
        .Where(function (item) { return item.QuestionID == QuestionId; })
        .Select(function (item) { return item; })
        .ToArray();

    var txtAnswer = '';
    if (answer.length > 0) {
        if (isId)
            txtAnswer = answer[0].QuestionOptionID;
        else
            txtAnswer = answer[0].Answer;
    }

    if (pQuestionTypeId == 5) {
        txtAnswer = answer.length > 0 ? answer[0].QuestionOption.split(';')[0] : '';
    } else if (pQuestionTypeId == 9 && txtAnswer.length > 0)
        txtAnswer = '../img/' + txtAnswer;
    else if (pQuestionTypeId == 10 && txtAnswer.length > 0)
        txtAnswer = Enumerable.From(txtAnswer.split(',')).Select(function (item) { return '../img/' + item }).ToArray();
    else if (pQuestionTypeId == 11 && txtAnswer.length > 0)
        txtAnswer = txtAnswer.split(',');


    return txtAnswer;
}

function onCtrlChange(id) {
    switch (id.type) {
        case 'text':
        case 'select-one': {
            $(id).parents(".clsQuestion").data('answer', $(id).val());
            break;
        }
        case '': {
            break
        }
        default:
    }

}

//View Survey
function ViewSurvey(surveyAssigneID) {
    $("#pnlMain3").show();
    $("#pnlAdd").hide();

    $.ajax({
        url: '\Service.aspx?rq=SurveySubmitGetById',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ SurveyAssigneeID: surveyAssigneID })
    }).done(function (sr) {
        if (sr.HasError == false) {
            $("#pnlMain").hide();
            $("#pnlSubmit").show();

            sr.Data.getAllSections = function () {
                var sections = Enumerable
                    .From(this.data.SurveyQuestions)
                    .Select(function (sq) {
                        return { SectionName: sq.SurveySection, SectionID: sq.SurveySectionID }
                    })
                    .Distinct("$.SectionID")
                    .ToArray();
                return sections;
            }

            sr.Data.getSectionQuestions = function (SectionID) {
                debugger;
                var questions = Enumerable
                    .From(this.data.SurveyQuestions)
                    .Where((sq) => sq.SurveySectionID == SectionID)
                    .Select(function (sq) { return sq; })
                    .OrderBy(function (sq) { sq.Sequence; })
                    .ToArray();
                return questions;
            }

            sr.Data.getAnswerData = function (QuestionId, isId, pQuestionTypeId) {
                var answerData = Enumerable.From(this.data.SurveySubmitQuestions);
                var answer = answerData
                    .Where(function (item) { return item.QuestionID == QuestionId; })
                    .Select(function (item) { return item; })
                    .ToArray();


                var txtAnswer = '';
                if (answer.length > 0) {
                    if ([2, 3, 4, 5].includes(pQuestionTypeId))
                        txtAnswer = answer[0].QuestionOptionID;
                    else
                        txtAnswer = answer[0].Answer;
                }

                if (txtAnswer == '' && answer.length > 0) {
                    if (answer[0].QuestionOption == '') {
                        return '';
                    }
                }

                if (pQuestionTypeId == 9 && txtAnswer.length > 0)
                    txtAnswer = '../img/' + txtAnswer;
                else if (pQuestionTypeId == 10 && txtAnswer.length > 0)
                    txtAnswer = Enumerable.From(txtAnswer.split(',')).Select(function (item) { return '../img/' + item }).ToArray();
                else if (pQuestionTypeId == 10 && txtAnswer.length > 0)
                    txtAnswer = txtAnswer.split(',');


                switch (pQuestionTypeId) {
                    case 1: {
                        break;
                    }
                    case 2:
                    case 3:
                    case 4: {
                        var option = Enumerable.From(this.data.SurveyQuestionOptions)
                            .Where(function (item) { return item.QuestionID == QuestionId && txtAnswer == item.QuestionOptionID; })
                            .Select(function (item) { return item.Option; })
                            .SingleOrDefault();
                        if (option != null)
                            txtAnswer = option;
                        break;
                    }
                    case 5: {
                        //var option = Enumerable.From(this.data.SurveyQuestionOptions)
                        //    .Where(function (item) { return item.QuestionID == QuestionId && txtAnswer.split(';')[0].split(',').includes(item.QuestionOptionID.toString()) })
                        //    .Select(function (item) { return item.Option; })
                        //    .ToArray();
                        if (answer.length>0) {
                            txtAnswer = answer[0].QuestionOption.split(';')[1];
                        }
                        
                        break;
                    }
                    case 6: {
                        break;
                    }
                    case 7: {
                        break;
                    }
                    case 8: {
                        break;
                    }
                    case 9: {
                        break;
                    }
                    case 10: {
                        break;
                    }
                    case 11: {
                        txtAnswer = txtAnswer.split(',');
                        var locatioData = {};
                        if (txtAnswer[2] == "1") {
                            txtAnswer[2] = "Current Location";
                        } else if (txtAnswer[2] == "2") {
                            txtAnswer[2] = "Use Map";
                        } else {
                            txtAnswer[2] = "Enter Manually";
                        }
                        locatioData.Latitude = txtAnswer[0];
                        locatioData.Langitude = txtAnswer[1];
                        locatioData.AnswerType = txtAnswer[2];
                        return [locatioData];
                        break;
                    }
                    case 12: {
                        txtAnswer = txtAnswer + ' ' + this.data.SurveyQuestions.filter(q => q.QuestionID == QuestionId)[0].Unit;
                        break;
                    }
                    case 13: {
                        txtAnswer = txtAnswer;
                        break;
                    }
                    default:
                        alert('error!');
                }


                return txtAnswer;
            }

            sr.Data.getOtherData = function (QuestionID) {
                var answerData = Enumerable.From(this.SurveySubmitQuestions);
                var answer = answerData
                    .Where(function (item) { return item.QuestionID == QuestionID; })
                    .Select(function (item) { return item; })
                    .ToArray();
                if (answer.length > 0) {
                    return answer[0];
                }

                return { Latitude: '', Longitude: '', Comment: '' };

            }

            $("#surveyViewContainer").empty();
            $("#surveyViewTmpl").tmpl(sr.Data).appendTo("#surveyViewContainer");
            /*generateSurveyPreView(sr.Data);*/
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function saveViewSurvey() {
    var data = {};
    data.SurveyAssigneeID = surveyAssigneeId;
    data.Answers = [];

    $(".clsQuestion").each((i, q) => {
        var answer = {
            QuestionID: $(q).data('questionid'),
            QuestionTypeID: $(q).data('questiontypeid'),
            OptionID: -1,
            Option: null,
            Answer: null
        };

        var $ctrls = $(q).find(".clsCtrl");
        var type = ''; //

        if ($($ctrls[0]).hasClass('clsCtrlCascade')) {
            type = 'CASCADE';
        } else if ($($ctrls[0]).hasClass('clsCtrlLocation')) {
            type = 'LOCATION';
        } else if (typeof $ctrls[0].type !== "undefined") {
            type = $ctrls[0].type
        } else {
            type = $ctrls[0].tagName;
        }

        switch (type) {
            case 'text':
            case 'textarea': {
                answer.Answer = $($ctrls[0]).val();
                break;
            }
            case 'select-one': {
                answer.OptionID = $($ctrls[0]).val();
                answer.Option = $("#" + $ctrls[0].id + " option:selected").text();
                break;
            }
            case 'radio':
            case 'checkbox': {
                var optionID = '';
                var option = '';
                $ctrls.each(function (i, ctrl) {
                    if ($(ctrl).is(':checked')) {
                        if ($(ctrl).data('option') !== '') {
                            optionID = $(ctrl).val() + ',' + optionID;
                            option = $(ctrl).data('option') + ',' + option;
                            answer.OptionID = $(ctrl).val();
                            answer.Option = $(ctrl).data('option');
                        }
                    }
                });
                answer.Option = optionID.slice(0, -1) + ';' + option.slice(0, -1);
                break;
            }
            case 'IMG': {
                var srcs = '';
                $ctrls.each(function (i, ctrl) {
                    srcs += $(ctrl).attr('src') + ',';
                });
                if (srcs.length > 1) {
                    srcs = srcs.slice(0, -1);
                }
                answer.Answer = srcs;
                break;
            }
            case 'LOCATION': {
                var ansType = $($($ctrls[0]).find(".clsCtrlAnswerType")[0]).html();
                switch (ansType) {
                    case 'Current Location': {
                        ansType = "1";
                        break;
                    }
                    case 'Use Map': {
                        ansType = "2";
                        break;
                    }
                    case 'Enter Manually': {
                        ansType = "3";
                        break;
                    }
                }
                answer.Answer = $($($ctrls[0]).find(".clsCtrlLatitude")[0]).val() + ',' + $($($ctrls[0]).find(".clsCtrlLongitutde")[0]).val() + ',' + ansType;
                break;
            }
            case 'CASCADE': {
                debugger;
                debugger;
                var markup = $($ctrls[0]).parents(".cddlDiv").data('cascademarkup');
                var lines = markup.split(';');
                var header = lines[0].split(',');
                var ans = '';

                $(header).each(function (i, n) {
                    ans = ans + $("select[name='" + header[i] + "']").find('option:selected').text() + ',';
                });
                answer.Answer = ans.slice(0, -1);;
                break;
            }
            default: {
                break;
            }
        }

        data.Answers.push(answer);
    });
    console.log(data);
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=UpdateSurveyAnswer',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(data)
    }).done(function (sr) {
        if (sr.HasError == false) {
            if (data.SurveyID == 0)
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

function removeImage(e) {
    $(e).parents(".image-frame").remove();
}

function downloadImage(button) {
    let img = button.closest(".image-frame").querySelector("img");
    let imgUrl = img.src;
    let link = document.createElement("a");
    link.href = imgUrl;
    link.download = "downloaded-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


//Cascade Drop Down
function emptyCascadeDropDownContainer(qid) {
    $("#pnlCascadeDdl_" + qid).empty();
    $("#cddTmpl").tmpl({ QuestionID: qid }).appendTo($("#pnlCascadeDdl_" + qid));
}

function loadQuestionDesignCascadeDropdownFromMarkup(qid, markup) {
    if (markup == '' || markup == null) {
        return '';
    }

    var lines = markup.split(';');
    var header = lines[0].split(',');

    $(header).each(function (i, l) {
        if (i > 1) {
            addColumn(qid);
        }

        $("#cddlThead_" + qid + " tr td").eq(i).find(".cddlName").val(l);
    });

    lines.shift();
    lines = lines.reverse().filter(l => l != '');

    var index = 0;
    while (lines.length != 0) {
        var line = lines.pop();
        $(line.split(',')).each(function (i, c) {
            $("#cddlTbody_" + qid + " tr").eq(index).find("td").eq(i).find(".cddlValue").val(c);
        });
        addRow(qid);
        index++;
    }

}
function addColumn(qid) {
    var index = $("#cddlLastCol_" + qid).parent('tr').children('td').length;
    $("#cddlLastCol_" + qid).before($("#cddlColTmpl").tmpl({ index: index, QuestionID: qid }));
    addCell(qid, index);
}

function removeColumn(that, qid) {
    if ($("#cddlThead_" + qid + " tr td").length <= 2) {
        alert('There should be atlest 2 column in the table.');
        return;
    }

    var index = $(that).closest('td').index() + 1;
    removeCell(qid, index);
    $(that).closest('td').remove();
    resetPlaceholders(qid);
}

function addCell(qid, colindex) {
    $("#cddlTbody_" + qid).children('tr').each(function (ri, re) {
        $(re).children('td').each(function (ci, ce) {
            if (ci == colindex - 2) {
                $(ce).after($("#cddlCellTmpl").tmpl({ index: colindex }));
            }
        })
    });
}

function removeCell(qid, colindex) {
    $("#cddlTbody_" + qid).children('tr').each(function (ri, re) {
        $(re).children('td').each(function (ci, ce) {
            if (ci == colindex - 1) {
                $(ce).remove();
            }
        })
    });
}

function addRow(qid) {
    var $clone = $("#cddlTbody_" + qid + " tr").last().clone();
    $("#cddlTbody_" + qid + " tr").last().attr('id', '');
    $("#cddlTbody_" + qid + " tr").last().after($clone);
    $("#cddlTbody_" + qid + " tr").last().find('input[type="text"]').val('');
}

function removeRow(that, qid) {
    if ($("#cddlTbody_" + qid + " tr").length <= 1) {
        alert('There should be atlest 1 row in the table.');
        return;
    }
    $(that).parents('tr').remove();
}

function resetPlaceholders(qid) {
    $("#cddlThead_" + qid).children('tr').each(function (ri, re) {
        $(re).children('td').each(function (ci, ce) {
            $(ce).find(".cddlName").attr('placeholder', 'Drop Down ' + (ci + 1) + ' Name');
        })
    });

    $("#cddlTbody_" + qid).children('tr').each(function (ri, re) {
        $(re).children('td').each(function (ci, ce) {
            $(ce).find(".cddlValue").attr('placeholder', 'Drop Down ' + (ci + 1) + ' Value');
        })
    });
}

function onChangeCascadeDropdown(thatDdl) {
    var markup = $(thatDdl).parents(".cddlDiv").data('cascademarkup');
    var lines = markup.split(';');
    var header = lines[0].split(',');

    var nameOfwhichDropdownChangedIndex = $(thatDdl).attr('name');
    var whichDropdownChangedIndex = header.indexOf(nameOfwhichDropdownChangedIndex);

    if (header.length - 1 == whichDropdownChangedIndex) {
        return;
    }

    var whichDropdownChangedValue = $(thatDdl).find('option:selected').text();

    //Empty all drop down below the whichDropdownChangedIndex
    for (var i = whichDropdownChangedIndex + 1; i < header.length; i++) {
        $("select[name='" + header[i] + "']").empty();
        $("select[name='" + header[i] + "']").append('<option value="-1">--- Select ---</option>');
    }

    //Fill the next drop down based on the value of whichDropdownChangedIndex
    var nextDropDownIndex = whichDropdownChangedIndex + 1;
    lines.shift();
    var values = [];
    $(lines).each(function (i, o) {
        var cells = o.split(',');
        if (cells[nextDropDownIndex - 1] == whichDropdownChangedValue) {
            var nextDropdownValue = cells[nextDropDownIndex];
            if (values.indexOf(nextDropdownValue) == -1) {
                values.push(nextDropdownValue);
            }
        }
    });


    var tmpl = '<option value="-1">--- Select ---</option>';
    var nameOfNextDropdown = encodeURIComponent(header[nextDropDownIndex]);
    var nextDll = $("select[name='" + nameOfNextDropdown + "']");
    $(values).each(function (i, o) {
        var entry = o.split(',')[0];
        if (entry == '') {
            return;
        }
        tmpl += '<option value="' + generateId() + '">' + o.split(',')[0] + '</option>';
    });
    nextDll.empty().append(tmpl)
}

function updateSectionSequence2(secArr) {
    for (var i = 0; i < secArr.length; i++) {
        $('#sectionSequence2_' + secArr[i].SectionID).text((i + 1));
    }
}

const _conditions = [
    { ConditionID: 1, QuestionTypeID: 1, Name: "was answered" },
    { ConditionID: 2, QuestionTypeID: 1, Name: "was not answered" },
    //{ ConditionID: 3, QuestionTypeID: 1, Name: "is equal to" },
    //{ ConditionID: 4, QuestionTypeID: 1, Name: "is not equal to" },
    //{ ConditionID: 5, QuestionTypeID: 1, Name: "is greater than" },
    //{ ConditionID: 6, QuestionTypeID: 1, Name: "is less than" },
    { ConditionID: 7, QuestionTypeID: 2, Name: "was answered" },
    { ConditionID: 8, QuestionTypeID: 2, Name: "was not answered" },
    //{ ConditionID: 9, QuestionTypeID: 2, Name: "is" },
    //{ ConditionID: 10, QuestionTypeID: 2, Name: "isn't" },
    //{ ConditionID: 11, QuestionTypeID: 2, Name: "is one of" },
    //{ ConditionID: 12, QuestionTypeID: 2, Name: "isn't one of" },
    { ConditionID: 13, QuestionTypeID: 3, Name: "was answered" },
    { ConditionID: 14, QuestionTypeID: 3, Name: "was not answered" },
    //{ ConditionID: 15, QuestionTypeID: 3, Name: "is" },
    //{ ConditionID: 16, QuestionTypeID: 3, Name: "isn't" },
    //{ ConditionID: 17, QuestionTypeID: 3, Name: "is one of" },
    //{ ConditionID: 18, QuestionTypeID: 3, Name: "isn't one of" },
    { ConditionID: 19, QuestionTypeID: 4, Name: "is checked" },
    { ConditionID: 20, QuestionTypeID: 4, Name: "is not checked" },
    { ConditionID: 21, QuestionTypeID: 5, Name: "was answered" },
    { ConditionID: 22, QuestionTypeID: 5, Name: "was not answered" },
    //{ ConditionID: 23, QuestionTypeID: 5, Name: "includes" },
    //{ ConditionID: 24, QuestionTypeID: 5, Name: "does not include" },
    //{ ConditionID: 25, QuestionTypeID: 5, Name: "is one of" },
    //{ ConditionID: 26, QuestionTypeID: 5, Name: "isn't one of" },
    { ConditionID: 27, QuestionTypeID: 6, Name: "was answered" },
    { ConditionID: 28, QuestionTypeID: 6, Name: "was not answered" },
    //{ ConditionID: 29, QuestionTypeID: 6, Name: "is before" },
    //{ ConditionID: 30, QuestionTypeID: 6, Name: "is after" },
    { ConditionID: 31, QuestionTypeID: 7, Name: "was answered" },
    { ConditionID: 32, QuestionTypeID: 7, Name: "was not answered" },
    //{ ConditionID: 33, QuestionTypeID: 7, Name: "contains text" },
    //{ ConditionID: 34, QuestionTypeID: 7, Name: "does not contain text" },
    //{ ConditionID: 35, QuestionTypeID: 7, Name: "is" },
    //{ ConditionID: 36, QuestionTypeID: 7, Name: "isn't" },
    //{ ConditionID: 37, QuestionTypeID: 7, Name: "is one of" },
    //{ ConditionID: 38, QuestionTypeID: 7, Name: "isn't one of" },
    { ConditionID: 39, QuestionTypeID: 8, Name: "was answered" },
    { ConditionID: 40, QuestionTypeID: 8, Name: "was not answered" },
    //{ ConditionID: 41, QuestionTypeID: 8, Name: "contains text" },
    //{ ConditionID: 42, QuestionTypeID: 8, Name: "does not contain text" },
    //{ ConditionID: 43, QuestionTypeID: 8, Name: "is" },
    //{ ConditionID: 44, QuestionTypeID: 8, Name: "isn't" },
    //{ ConditionID: 45, QuestionTypeID: 8, Name: "is one of" },
    //{ ConditionID: 46, QuestionTypeID: 8, Name: "isn't one of" },
    { ConditionID: 47, QuestionTypeID: 9, Name: "was answered" },
    { ConditionID: 48, QuestionTypeID: 9, Name: "was not answered" },
    { ConditionID: 49, QuestionTypeID: 10, Name: "was answered" },
    { ConditionID: 50, QuestionTypeID: 10, Name: "was not answered" },
    { ConditionID: 51, QuestionTypeID: 11, Name: "was answered" },
    { ConditionID: 52, QuestionTypeID: 11, Name: "was not answered" }
];

function bindCondition() {
    var qid = $('#ddlQuestion').val();
    var qtid = $('#ddlQuestionType_' + qid).val();
    var tmpl = '<option value="-1">---Select---</option>';

    var formats = _conditions.filter(f => f.QuestionTypeID == qtid);
    formats.forEach(function (f) {
        tmpl += '<option value="' + f.ConditionID + '">' + f.Name + '</option>';
    });

    $("#ddlCondition").empty();
    $("#ddlCondition").append(tmpl);
    $("#ddlCondition").val(-1);
}

function loadDeployGrid(sid) {
    var url = "\Service.aspx?rq=GetDeployAssignees&surveyId=" + sid;
    if ($("#gridDeploy").parents('.ui-jqgrid').length > 0) {
        $("#gridDeploy").jqGrid('setGridParam', { url: url, datatype: "json", page: 1 }).trigger("reloadGrid");
    } else {
        $("#gridDeploy").jqGrid({
            url: url,
            datatype: "json",
            mtype: "POST",
            postData: JSON.stringify({ SurveyID: sid }),
            colNames: ['SurveyAssigneeID', 'User Name', 'Date'],
            colModel: [
                { name: 'SurveyAssigneeID', index: 'SurveyAssigneeID', key: true, hidden: true },
                { name: 'AssigneeUserName', index: 'AssigneeUserName', width: '200', search: true },
                { name: 'AssignDate', index: 'AssignDate', width: '150', search: true, align: 'center', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } }
            ],
            jsonReader: { repeatitems: false },
            viewrecords: true,
            loadonce: true,
            caption: '&nbsp;&nbsp;Deployments',
            pager: '#gridpagerDeploy',
            rowList: [5, 20, 50, 100],
            height: '250px',
            autowidth: true,
            altRows: true,
            altclass: 'myAltRowClass',
            ignoreCase: true,
            loadComplete: function () {
                $("tr.jqgrow", this).contextMenu('GridContextMenuDeploy', {
                    bindings: {
                        'Delete': function (trigger) {
                            deleteDeployAssignee(trigger.id);
                        }
                    },
                    onContextMenu: function (event) {
                        return true;
                    }
                });
                var width = $('#ParentDivDeployGrid').width();
                $('#gridDeploy').setGridWidth(width);
            }
        });
        $("#gridDeploy").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: 'cn' });
    }
}

function deleteDeployAssignee(surveyAssigneeId) {
    //if (confirm("Are you sure you want to delete this assignee?")) {
        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=DeploySurveyDeleteSingle',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify({ SurveyAssigneeID: surveyAssigneeId })
        }).done(function (sr) {
            if (sr.HasError == false) {
                toastr["success"]('Assignee deleted successfully.');
                //$("#gridDeploy").trigger("reloadGrid");
                loadDeployGrid(_id);
            } else {
                toastr["error"](sr.ErrorMessage);
            }
            closeLoadingPopup();
        }).fail(function () {
            closeLoadingPopup();
            toastr["error"]('An unexpected error occurred while deleting.');
        });
    //}
}