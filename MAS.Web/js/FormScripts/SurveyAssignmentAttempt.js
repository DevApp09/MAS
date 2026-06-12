var _id = 0;
var $grid = null;
var noOfFields = 0;
var _groupId;
var _branchId;

$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    showLoadingPopup();
    bindjqGrid();

    $('.datePicker').datepicker({
        format: "mm/dd/yyyy",
        autoclose: true
    });

    $("#goBackBtn").click(function () {
        $("#mainPnl").show();
        $("#addNewPnl").hide();
    });

    $("#btnSave").click(function () {
        save();
    });
});

function bindjqGrid() {

    var url = "\Service.aspx?rq=GetAllSurveyAssignment";
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ companyID: $("#ddlcompany").val() }),
        colNames: ['ID', 'SurveyGroupName', 'BranchName', 'StartAt', 'EndAt', 'IsAttempt', 'AttemptAt', 'SurveyGroupID', 'BranchID'],
        colModel: [
            { name: 'ID', index: 'ID', key: true, search: true, align: 'center', hidden: true },
            { name: 'SurveyGroupName', index: 'SurveyGroupName', search: true },
            { name: 'BranchName', index: 'BranchName', search: true },
            { name: 'StartAt', index: 'StartAt', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'EndAt', index: 'EndAt', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'IsAttempt', index: 'IsAttempt', search: true, align: 'center' },
            { name: 'AttemptAt', index: 'AttemptAt', search: true, align: 'center', width: '100', formatter: 'date', formatoptions: { srcformat: "m/d/Y H:i A", newformat: 'ShortDate' } },
            { name: 'SurveyGroupID', index: 'SurveyGroupID', hidden: true },
            { name: 'BranchID', index: 'BranchID', hidden: true }
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Questions',
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
                    'Attempt': function (trigger) {
                        var rowData = $("#grid").jqGrid('getRowData', trigger.id)
                        attempt(rowData);
                    }
                },
                onContextMenu: function (event) {
                    return true;
                }
            });
        }
    });
    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: 'cn' });
    $("#grid").jqGrid('setGridParam', { url: url, datatype: "json", page: 1 }).trigger("reloadGrid");
}

function save() {

    var data = {
        SurveyGroupID: _groupId,
        BranchID: _branchId,
        Questions: null,
        CompanyID: $("#ddlcompany").val()
    };

    var questions = [];
    var isError = false;

    for (var i = 0; i < questionCount; i++) {
        var question = {
            SurveyQuestionID: $('#questionId' + i).text(),
            SurveyQuestion: $('#question' + i).val(),
            Answers: null
        }

        var questionType = $('#questionTypeId' + i).text();
        var noOfAnswers = parseInt($('#numberOfAnswers' + i).text());
        var answers = [];

        switch (questionType) {

            case "1":
            case "3":
                var count = 0;
                for (var j = 0; j < noOfAnswers; j++) {
                    var answerId = '#answerId' + i + '' + j;
                    var answerName = '#answer' + i + '' + j;
                    if ($(answerName).prop('checked')) {
                        count++;
                        answers.push({ SurveyAnswerID: $(answerId).text(), SurveyAnswer: $(answerName).val() });
                    }
                }

                if (count == 0) {
                    toastr["error"]('Please insert the answer of Q' + (i + 1));
                    isError = true;
                }

                break;
         
            case "2":

                var dropDownValue = $("#answer" + i + "0").val();

                if (dropDownValue == '-1')
                {
                    toastr["error"]('Please insert the answer of Q' + (i + 1));
                    isError = true;
                }

                answers.push({ SurveyAnswerID: $("#answer" + i + "0").val(), SurveyAnswer: $("#answer" + i + "0 option:selected").text() });
                break;

            
        }

        question.Answers = answers;
        questions.push(question);
    }

    if (!isError)
    {
        data.Questions = questions;

        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=InsertOrUpdateSurveyAttemptAnswers',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(data),
        }).done(function (sr) {
            if (sr.HasError == false) {
                $("#grid").trigger('reloadGrid');
                bindjqGrid();
                $("#mainPnl").show();
                $("#addNewPnl").hide();
                toastr["success"]('Record has been Added/Updated successfully.');
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

function attempt(rowData) {

    if (rowData.IsAttempt == 'true') {
        toastr["error"]('Survey is already attempt.');
        return;
    }
    //$('#formValues').clearForm();
    $("#isActive").empty();
    $("#mainPnl").hide();
    $("#addNewPnl").show();

    $('#accordion').empty();
    questionCount = 0;

    _id = rowData.ID;
    _groupId = rowData.SurveyGroupID;
    _branchId = rowData.BranchID;

    obj =
        {
        groupId: _groupId,
        companyId: $("#ddlcompany").val()
        };

    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=GetAllQuestionAndAnswersOfSpecificGroup',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            var questionAnswersGroupList = sr.Data;

            $('#accordion').html(createDepartmentGroup(questionAnswersGroupList));
            fillAnswers();

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
            Id: id
        };

    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=DeleteSurveyAssignment',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            $("#grid").trigger('reloadGrid');
            bindjqGrid();
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

function GetDate(jsonDate) {
    if (jsonDate != null && jsonDate != "")
        return new moment(jsonDate).format('MM/DD/YYYY');

    return "";
}

var panelCount = 0;
var questionCount = 0;

function createDepartmentGroup(questionAnswersGroupList){

    var html = ``;

    questionAnswersGroupList.forEach(function (questions) {

        html += `<div class="panel panel-default">
                                <div class="panel-heading">
                                    <h5 class="panel-title">
                                        <a data-toggle="collapse" data-parent="#accordion" href="#collapsepanel`+ panelCount+`" aria-expanded="false" class="collapsed">`+ questions[0].DepartmentName + `</a>
                                    </h5>
                                </div>
                                <div id="collapsepanel`+ panelCount+`" class="panel-collapse collapse" aria-expanded="false" style="height: 0px;">
                                    <div class="panel-body">`;

        html += getQuestionAndAnswers(questions);

        html += `</div></div></div>`;

        panelCount++;

    });

    return html;
}

function getQuestionAndAnswers(questions) {

    var html = ``;

    questions.forEach(function (question) {

        html += `<div class="form-group">
                        <label style="display: none;" id="questionId`+ questionCount + `">` + question.ID+`</label>
                        <label style="display: none;" id="numberOfAnswers`+ questionCount + `">` + question.SurveyQuestionAnswersDTO.length +`</label>
                        <label style="display: none;" id="questionTypeId`+ questionCount + `">` + question.SurveyQuestionTypeID +`</label>
                        <div class="col-sm-12">
                            <label id="question`+ questionCount + `" class="control-label">` + (questionCount + 1) + `) ` + question.Name +` ? </label>
                        </div>
                    </div>`;

        html += getAnswers(question.SurveyQuestionTypeID, question.SurveyQuestionAnswersDTO);

        questionCount++;
    });

    return html;
}

function getAnswers(questionTypeId, answers) {

    var html = ``;

    switch (questionTypeId)
    {
        case 1:
            html += getCheckBoxes(answers);
            break;
        case 2:
            html += getDropDownList(answers);
            break;
        case 3:
            html += getRadioButton(answers);
            break;
    }

    return html;
}

function getDropDownList(answers)
{
    var answerCount = 0;
    var html = `<div class="form-group">
                        <label style="display: none;" id="1"></label>  
                        <div class="col-sm-12">
                            <select class="form-control select2" id="answer`+ questionCount + answerCount +`">`;

    html += `<option value="-1" active>--Select--</option>`;

    answers.forEach(function (answer) {
        html += `<option value="` + answer.ID + `">` + answer.Name +`</option>`;
    });

    html += `</select></div></div>`;

    return html;

}

function getCheckBoxes(answers)
{
    var answerCount = 0;
    var html = `<div class="form-group">
                        <div class="col-sm-11">`;

    answers.forEach(function (answer) {

        html += `<div>
                    <label style="display: none;" id="answerId`+ questionCount + `` + answerCount + `">` + answer.ID +`</label>
                    <label>
                       <input id="answer`+ questionCount + `` + answerCount + `" type="checkbox" value="` + answer.Name +`">
                        `+ answer.Name +` 
                    </label>
                 </div>`;

        answerCount++;
    });


    html += `</div></div>`;

    return html;
}

function getRadioButton(answers) {

    var answerCount = 0;
    var html = `<div class="form-group">
                        <div class="col-sm-11">`;

    answers.forEach(function (answer) {

        html += `<div>
                    <label style="display: none;" id="answerId`+ questionCount + `` + answerCount + `">` + answer.ID +`</label>
                    <label>
                       <input type="radio" value="`+ answer.Name + `" id="answer` + questionCount + `` + answerCount + `" name="optionsRadios ` + questionCount + `` + answerCount+ `">
                        `+ answer.Name + ` 
                    </label>
                 </div>`;

        answerCount++;
    });


    html += `</div></div>`;

    return html;
}

function fillAnswers()
{
    obj =
        {
            groupID: _groupId,
            branchID: _branchId,
            compnayID: $("#ddlcompany").val()
        };

    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=GetAllSurveyAttemptAnswers',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {

            var data = sr.Data;
            populateFields(data);

        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
        }).fail(function () {
            closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function populateFields(data) {

    var qC = 0;

    data.Questions.forEach(function (a) {

        var questionType = $('#questionTypeId' + qC).text();
        var noOfAnswers = parseInt($('#numberOfAnswers' + qC).text())

        var aC = 0;
        a.Answers.forEach(function (b) {

            switch (questionType) {
                case "1":
                    fillDropDowns(b, qC, aC);
                    break;

                case "2":
                case "3":

                    for (var z = 0; z < noOfAnswers; z++) {

                        if (b.SurveyAnswerID == $('#answerId' + qC + '' + z).text()) {
                            fillCheckBoxOrRadio(b, qC, z);
                        }
                    }
                    break;
            }

            aC++;
        });

        qC++;
    });
};

function fillDropDowns(data, qC, aC){

    $('#answer' + qC + '' + aC).select2().  select2('val', data.SurveyAnswerID);
}

function fillCheckBoxOrRadio(data, qC, aC) {

    $('#answer' + qC + '' + aC).prop('checked', true);
}

$(document).ajaxStop(function () {
    closeLoadingPopup();
});

// Add responsive to jqGrid
$(window).bind('resize', function () {
    var width = $('#ParentDiv').width();
    $('#grid').setGridWidth(width);
});