var _id = 0;
var $grid = null;
var noOfFields = 0;

$(document).ready(function () {
    // grid responsive on menu toggle
    $(window).on('MenuToggle', function () {
        var width = $('#ParentDiv').width();
        $('#grid').setGridWidth(width);
    });

    showLoadingPopup();
    bindQuestionType();
    bindDepartmentType();
    bindjqGrid();

    $("#addNewBtn").click(function () {
        $('#formValues').clearForm();
        $("#isActive").empty();
        $("#mainPnl").hide();
        $("#addNewPnl").show();
        $("#titleHeading").text('Add New Question');
        $("#btnSaveMore").show();
        _id = 0;
        noOfFields = 0;

        $("#ddlQuestionType").val(-1).select2();
        $("#ddlDepartmentType").val(-1).select2();
        $('#txtPossibleAnswers').val('');
        $('#optionContainer').empty();

        createDefaultRow(-1);
    });

    $("#goBackBtn").click(function () {
        $("#mainPnl").show();
        $("#addNewPnl").hide();
    });

    $("#btnSave").click(function () {
        save(false);
    });

    $("#btnSaveMore").click(function () {
        save(true);
    });
});

function bindQuestionType() {
    obj =
        {
            companyID: $("#ddlcompany").val(),
            isActive: true,
            defaultKey: -1,
            defaultValue: '---Select---'
        };
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=GetQuestionTypesDropDown',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            var table = sr.Data;
            var tmpl;
            table.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });
            $("#ddlQuestionType").empty();
            $("#ddlQuestionType").append(tmpl);
            $("#ddlQuestionType").val(-1).select2();

        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
        }).fail(function () {
            closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function bindDepartmentType() {
    obj =
        {
            companyID: $("#ddlcompany").val(),
            isActive: true,
            defaultKey: -1,
            defaultValue: '---Select---'
        };
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=GetDepartmentDropDown',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            var table = sr.Data;
            var tmpl;
            table.forEach(function (a) {
                tmpl += '<option value="' + a.Key + '">' + a.Value + '</option>';
            });
            $("#ddlDepartmentType").empty();
            $("#ddlDepartmentType").append(tmpl);
            $("#ddlDepartmentType").val(-1).select2();

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

    var url = "\Service.aspx?rq=GetAllQuestions";
    $grid = $("#grid").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ companyID: $("#ddlcompany").val() }),
        colNames: ['ID', 'Name', 'Description', 'SurveyQuestionTypeName', 'NumberOfAnswers', 'DepartmentName', 'IsActive'],
        colModel: [
            { name: 'ID', index: 'ID', key: true, search: true, align: 'center', hidden: true },
            { name: 'Name', index: 'Name', search: true },
            { name: 'Description', index: 'Description', search: true },
            { name: 'SurveyQuestionTypeName', index: 'SurveyQuestionTypeName', search: true },
            { name: 'NumberOfAnswers', index: 'NumberOfAnswers', search: true, hidden: true },
            { name: 'DepartmentName', index: 'DepartmentName', search: true },
            { name: 'IsActive', index: 'IsActive', search: true, align: 'center' },
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
                    'Edit': function (trigger) {
                        edit(trigger.id);
                    },
                    'Delete': function (trigger) {
                        remove(trigger.id);
                    },
                    'ViewAnswers': function (trigger){
                        ViewAnswers(trigger.id);
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

var index;
function check(i) {
    return i == index;
}

function save(addMore) {
    isError = false;

    var questionName = $('#txtName').val().trim();
    var questionDescription = $('#txtDescription').val().trim();
    var questionTypeID = $('#ddlQuestionType').val();
    var departmentID = $('#ddlDepartmentType').val();

    if (questionName == '') {
        toastr["error"]("Please enter question name.");
        isError = true;
    }

    if (questionDescription == '') {
        toastr["error"]("Please enter question description.");
        isError = true;
    }

    if (questionTypeID == '-1') {
        toastr["error"]("Please select question type.");
        isError = true;
    }

    if (departmentID == '-1') {
        toastr["error"]("Please select department.");
        isError = true;
    }

    //if (noOfFields == 0 || noOfFields < 2) {
    //    toastr["error"]("No of Answer must be equal or greater than 2.");
    //    isError = true;
    //}

    var answers = [];
    var correctAnwserCount = 0; 

    for (var i = 1; i < noOfFields; i++)
    {
        index = i;
        if (deletedIds.find(check)) continue;

        var answerId = $('#answerId' + i).text();
        var answer = $('#txtAnswer' + i).val();
        var isCorrect = $("#isCorrectAnswer" + i).is(":checked");
        var isActive = $("#isAnswerActive" + i).is(":checked");

        if (answer == '') {
            toastr["error"]("Answer"+i+" must be provided");
            isError = true;
        }

        if (isCorrect)
        {
            correctAnwserCount++;
        }

        if (answerId != "") {
            answers.push({ ID: parseInt(answerId), Name: answer, IsCorrect: isCorrect, IsActive: isActive });
        }
    }

    var uniqueCounts = answers.filter((x => y => !x.has(y.Name) && x.add(y.Name))(new Set)).length;
    var orignalCounts = answers.length;

    if (uniqueCounts < orignalCounts) {
        toastr["error"]("System cannot allow same option.");
        return;
    }

    if (correctAnwserCount > 1 && questionTypeID != '1') {
        toastr["error"]("System cannot allow multiple correct answer of selected question type.");
        isError = true;
    }

    if (correctAnwserCount == 0) {
        toastr["error"]("Please mark atleast one correct answer.");
        isError = true;
    }

    if (!isError) {

        var data = {
            ID: _id,
            SurveyQuestionTypeID: questionTypeID,
            Name: questionName,
            Description: questionDescription,
            NumberOfAnswers: noOfFields,
            IsActive: $("#isActive").is(":checked"),
            CompanyID: $("#ddlcompany").val(),
            SurveyQuestionAnswersDTO: answers,
            DepartmentID: departmentID,
            DepartmentName: $("#ddlDepartmentType option:selected").text()
        };

        showLoadingPopup();
        $.ajax({
            url: '\Service.aspx?rq=InsertOrUpdateQuestionAndAnswers',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(data)
        }).done(function (sr) {
            if (sr.HasError == false) {

                if (!addMore) {
                    $("#grid").trigger('reloadGrid');
                    bindjqGrid();
                    $("#goBackBtn").trigger('click');
                    
                } else {
                    $('#txtName').val('');
                    $('#txtDescription').val(''),
                    $("#ddlQuestionType").val(-1).select2();
                    $("#ddlDepartmentType").val(-1).select2();
                    $('#txtPossibleAnswers').val('');
                    $('#optionContainer').empty();

                    createDefaultRow(-1);
                }

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

function edit(id) {

    $('#formValues').clearForm();
    $("#mainPnl").hide();
    $("#addNewPnl").show();
    _id = id;
    noOfFields = 0;
    $('#optionContainer').empty();
    $("#titleHeading").text('Edit Question');
    $("#btnSaveMore").hide();

    obj =
        {
            Id: _id
        };
    showLoadingPopup();
    $.ajax({
        url: '\Service.aspx?rq=GetSpecificQuestion',
        type: 'POST',
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify(obj),
    }).done(function (sr) {
        if (sr.HasError == false) {
            var data = sr.Data;

            $('#txtName').val(data.Name);
            $('#txtDescription').val(data.Description);
            $('#ddlQuestionType').val(data.SurveyQuestionTypeID).select2();
            $('#ddlDepartmentType').val(data.DepartmentID).select2();

            data.SurveyQuestionAnswersDTO.forEach(function (a) {

                createDefaultRow(-1);

                $('#answerId' + noOfFields).text(a.ID);
                $('#txtAnswer' + noOfFields).val(a.Name);
                $("#isCorrectAnswer" + noOfFields).prop("checked", a.IsCorrect);
                $('#isAnswerActive' + noOfFields).prop("checked", a.IsActive);
            });

            createDefaultRow(-1);

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
        url: '\Service.aspx?rq=DeleteQuestionAndAnswers',
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

function CreateAnswerFields(flag) {

    noOfFields++;

    if (flag) noOfFields++;
    
    //var fields = ` <div id="answerdiv` + noOfFields +`">
    //                     <div class="hr-line-dashed"></div>
    //                     <div class="form-group">
    //                         <input type="hidden" id="answerId`+ noOfFields+`" value="-1" data-default="NULL" />
    //                         <label class="col-sm-2 control-label">Answer`+ noOfFields +`</label>
    //                         <div class="col-sm-10">
    //                             <div class="col-sm-10">
    //                                 <textarea id="txtAnswer`+ noOfFields + `" class="form-control" placeholder="Answer` + noOfFields +`" aria-multiline="true"></textarea>
    //                             </div>
    //                             <div class="col-sm-1">
    //                                 <div class="switch" style="margin-top: 5px;">
    //                                     <input type="checkbox" class="checkbox" id="isCorrectAnswer`+ noOfFields +`" >
    //                                 </div>
    //                             </div>
    //                             <div class="col-sm-1">
    //                                 <div class="switch">
    //                                     <div class="onoffswitch" style="margin-top: 8px;" >
    //                                         <input type="checkbox" checked="" class="onoffswitch-checkbox" id="isAnswerActive`+ noOfFields +`">
    //                                         <label class="onoffswitch-label" for="isAnswerActive`+ noOfFields +`">
    //                                             <span class="onoffswitch-inner"></span>
    //                                             <span class="onoffswitch-switch"></span>
    //                                         </label>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>`;

    var fields = `<tr id="row` + noOfFields+`">
                      <td style="display: none;" id="answerId`+ noOfFields + `">-1</td>
                      <td>
                          <textarea id="txtAnswer`+ noOfFields + `" class="form-control" aria-multiline="true" onblur="createDefaultRow(` + noOfFields+`)"></textarea>
                      <td>
                          <input type="checkbox" class="checkbox" id="isCorrectAnswer`+ noOfFields +`" >
                      </td>
                      <td>
                          <input type="checkbox" class="checkbox" checked="" id="isAnswerActive`+ noOfFields +`">
                      </td>
                      <td>
                          <div class="infont col-sm-1" style="display:none;" id="delete`+ noOfFields + `" onclick="deleteRow(` + noOfFields +`)"><i class="fa fa-times"></i></div>
                      </td>
                  </tr>`;

    $('#optionContainer').append(fields);
}

function ViewAnswers(id) {
    
    $('#answersBtn').trigger('click');
    $("#gridAnswer").trigger('reloadGrid');
    bindAnswerjqGrid(id);
}

function bindAnswerjqGrid(questionID) {
    
    var url = "\Service.aspx?rq=GetAllAnswers";
    $grid = $("#gridAnswer").jqGrid({
        url: url,
        datatype: "json",
        mtype: "POST",
        postData: JSON.stringify({ Id: questionID }),
        colNames: ['ID', 'Name', 'IsCorrect', 'IsActive'],
        colModel: [
            { name: 'ID', index: 'ID', key: true, align: 'center'},
            { name: 'Name', index: 'Name'},
            { name: 'IsCorrect', index: 'IsCorrect', align: 'center' },
            { name: 'IsActive', index: 'IsActive', align: 'center' },
        ],
        jsonReader: { repeatitems: false },
        viewrecords: true,
        loadonce: true,
        caption: '&nbsp;&nbsp;Answers',
        pager: '#gridpagerAnswer',
        rowList: [5, 20, 50, 100, 200, 500],
        height: '100px',
        autowidth: true,
        altRows: true,
        altclass: 'myAltRowClass',
        ignoreCase: true,

        loadComplete: function () {
        }
    });
    $("#gridAnswer").jqGrid('filterToolbar', { stringResult: true, searchOnEnter: true, defaultSearch: 'cn' });
    $("#gridAnswer").jqGrid('setGridParam', { url: url, datatype: "json", page: 1 }).trigger("reloadGrid");
}

var isSecondTime;
var deletedIds = [];

function createDefaultRow(id) {

    if (id != -1 && $('#answerId' + id).text() == '-1' && $('#txtAnswer' + id).val() != "" && (noOfFields == id || noOfFields == 0)) {
        $('#delete' + id).show();
    }

    if (id == -1) {
        CreateAnswerFields(false);
        isSecondTime = true;
    } else if ($('#txtAnswer' + id).val() != "" && (noOfFields == id || noOfFields == 0)) {

        if (isSecondTime) {
            CreateAnswerFields(true);
            isSecondTime = false;
        } else {
            CreateAnswerFields(false);
        }
    }
}

function deleteRow(id) {

    $('#row' + id).remove();

    //if ($('#answerId' + (id - 1)).text() == '-1')
        //$('#delete' + (id - 1)).show();
    deletedIds.push(id);
}

$(document).ajaxStop(function () {
    closeLoadingPopup();
});

// Add responsive to jqGrid
$(window).bind('resize', function () {
    var width = $('#ParentDiv').width();
    $('#grid').setGridWidth(width);
});