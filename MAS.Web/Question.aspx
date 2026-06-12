<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Question.aspx.cs" Inherits="MAS.Web.Question" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <link href="css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>
    <script src="js/Util.js"></script>
    <script src="js/FormScripts/Question.js"></script>
    <script src="js/plugins/summernote/summernote.min.js"></script>
    <script src="js/linq.min.js"></script>
    <style>
        .pnlBtn {
            margin-top: -9px !important;
            margin-bottom: 0px !important;
            float: right;
        }

        .gridBtn {
            font-size: 11px;
        }

        .disabledbutton {
            pointer-events: none;
            opacity: 0.9;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-10">
            <h2>Questions</h2>
            <ol class="breadcrumb">
                <li>App Configuration
                </li>
                <li class="active">
                    <strong>Questions</strong>
                </li>
            </ol>
        </div>
        <div class="col-lg-2">
        </div>
    </div>
    <div class="wrapper wrapper-content animated fadeInRight">
        <div id="pnlMain" class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>Questions</h5>
                        <button id="btnAdd" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-plus button-icon-padding"></i>Add New</button>
                    </div>
                    <div class="ibox-content">
                        <div class="row padding-left-20 padding-right-20">
                            <div class="col-sm-2 hidden">
                                <div class="form-group">
                                    <label>Category</label>
                                    <select id="ddlFilterCategory" name="FilterCategory" class="form-control select2 width-100-percent">
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-1 hidden"></div>
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label>Question Type</label>
                                    <select id="ddlFilterQuestionType" name="FilterQuestionType" class="form-control select2 width-100-percent">
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-1"></div>
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label></label>
                                    <button type="button" id="btnApply" class="btn btn-white" style="margin-top: 20px;"><i class="fa fa-search button-icon-padding"></i>Apply</button>
                                    <button type="button" id="btnReset" class="btn btn-white" style="margin-top: 20px;"><i class="fa fa-refresh button-icon-padding"></i>Reset</button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <div id="ParentDiv">
                                    <table id="grid">
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div id="gridpager">
                                    </div>
                                    <div class="contextMenu" id="GridContextMenu" style="display: none">
                                        <ul style="width: 150px !important">
                                            <li id="Edit">
                                                <span class="fa fa-edit"></span>
                                                <span style="font-size: 11px; font-family: Verdana">Edit</span>
                                            </li>
                                            <li id="Delete">
                                                <span class="fa fa-trash"></span>
                                                <span style="font-size: 11px; font-family: Verdana">Delete</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="display: none" id="pnlAdd">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <div class="col-lg-8">
                            <h5 id="formAction">Add Question</h5>
                        </div>
                        <div class="col-lg-4 text-right">
                            <button id="btnBack" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                            <button id="btnSave" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                            <%--<button id="btnSaveAndClose" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save and Close</button>--%>
                        </div>
                    </div>
                    <div class="ibox-content">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li id="tab-Basic-li" class="cls-tab cls-tab-Basic active"><a data-toggle="tab" href="#tab-Basic" aria-expanded="true">Basic</a></li>
                                <li id="tab-Options-li" class="cls-tab cls-tab-Options"><a data-toggle="tab" href="#tab-Options" aria-expanded="false">Options</a></li>
                                <li id="tab-Conditions-li" class="cls-tab cls-tab-Conditions hidden"><a data-toggle="tab" href="#tab-Conditions" aria-expanded="false">Conditions</a></li>
                                <li id="tab-Validations-li" class="cls-tab cls-tab-Validations"><a data-toggle="tab" href="#tab-Validations" aria-expanded="false" style="display: none;">Validations</a></li>
                                <li id="tab-Matrix-li" class="cls-tab cls-tab-Matrix"><a data-toggle="tab" href="#tab-Matrix" aria-expanded="false" style="display: none;">Matrix</a></li>
                            </ul>
                            <div class="tab-content">
                                <%-- Basic  ---> start --%>
                                <div id="tab-Basic" class="tab-pane cls-tab active">
                                    <div class="panel-body">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Question Type</label>
                                            <div class="col-sm-10">
                                                <select id="ddlQuestionType" name="QuestionType" class="form-control clsSelect2 width-100-percent">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Requried</label>
                                            <div class="col-sm-10">
                                                <div class="switch">
                                                    <div class="onoffswitch">
                                                        <input type="checkbox" class="onoffswitch-checkbox" id="cbIsRequired" name="cbIsRequired">
                                                        <label class="onoffswitch-label" for="cbIsRequired">
                                                            <span class="onoffswitch-inner"></span>
                                                            <span class="onoffswitch-switch"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Name</label>
                                            <div class="col-sm-10">
                                                <input type="text" id="txtName" name="Hint" class="form-control" placeholder="Name">
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Hint</label>
                                            <div class="col-sm-10">
                                                <input type="text" id="txtHint" name="Hint" class="form-control" placeholder="Hint">
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Length</label>
                                            <div class="col-sm-10">
                                                <input type="number" id="txtLength" name="Length" class="form-control" min="1" max="100" placeholder="Length">
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Alternate</label>
                                            <div class="col-sm-10">
                                                <div class="switch">
                                                    <div class="onoffswitch">
                                                        <input type="checkbox" class="onoffswitch-checkbox" id="cbIsNotApplicableOption" name="IsNotApplicableOption">
                                                        <label class="onoffswitch-label" for="cbIsNotApplicableOption">
                                                            <span class="onoffswitch-inner"></span>
                                                            <span class="onoffswitch-switch"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <label>Not Applicable Option</label>
                                                <div class="switch">
                                                    <div class="onoffswitch">
                                                        <input type="checkbox" class="onoffswitch-checkbox" id="cbIsDontKnowOption" name="IsDontKnowOption">
                                                        <label class="onoffswitch-label" for="cbIsDontKnowOption">
                                                            <span class="onoffswitch-inner"></span>
                                                            <span class="onoffswitch-switch"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <label>Dont Know Option</label>
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Advanced</label>
                                            <div class="col-sm-10">
                                                <div class="switch">
                                                    <div class="onoffswitch">
                                                        <input type="checkbox" class="onoffswitch-checkbox" id="cbIsAdvanced" name="IsAdvanced">
                                                        <label class="onoffswitch-label" for="cbIsAdvanced">
                                                            <span class="onoffswitch-inner"></span>
                                                            <span class="onoffswitch-switch"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="pnlAdvanced">
                                            <div class="hr-line-dashed"></div>
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label">Comments</label>
                                                <div class="col-sm-10">
                                                    <input type="text" id="txtComments" name="Comments" class="form-control" placeholder="Comments">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Active</label>
                                            <div class="col-sm-10">
                                                <div class="switch">
                                                    <div class="onoffswitch">
                                                        <input type="checkbox" checked="" class="onoffswitch-checkbox" id="cbIsActive" name="IsActive">
                                                        <label class="onoffswitch-label" for="cbIsActive">
                                                            <span class="onoffswitch-inner"></span>
                                                            <span class="onoffswitch-switch"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <%-- Basic ---> end --%>

                                <%-- Options ---> start --%>
                                <div id="tab-Options" class="tab-pane cls-tab">
                                    <div class="panel-body">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Option</label>
                                            <div class="col-sm-8">
                                                <input type="text" id="txtOption" name="Option" class="form-control" placeholder="Option">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-sm-2">
                                            </div>
                                            <div class="col-sm-8">
                                                <button id="btnAddOption" type="button" class="btn btn-warning"><i class="fa fa-plus button-icon-padding"></i><span id="btnAddOptionText">Add</span></button>
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="col-sm-12">
                                            <script id="optionTmpl" type="text/x-jquery-tmpl">
                                                <tr id="optionRow${QuestionOptionID}">
                                                    <td class="cls-QuestionOptionID cls-display-none">${QuestionOptionID}</td>
                                                    <td class="cls-Option cls-text-Option${QuestionOptionID}">${Option}</td>
                                                    <td class="cls-OptionIsDelete">${IsDelete}</td>
                                                    <td>
                                                        <input type="button" value="e" onclick="editOption(${QuestionOptionID})" />
                                                        <input type="button" value="x" onclick="deleteOption(${QuestionOptionID})" />
                                                    </td>
                                                </tr>
                                            </script>
                                            <table id="optionTable" class="table table-bordered">
                                                <thead>
                                                    <th class="cls-display-none">QuestionOptionID</th>
                                                    <th>Option</th>
                                                    <th class="cls-display-none">IsDelete</th>
                                                    <th></th>
                                                </thead>
                                                <tbody id="optionContainer">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <%-- Options ---> end --%>

                                <%-- Conditions ---> start --%>
                                <div id="tab-Conditions" class="tab-pane cls-tab">
                                    <div class="panel-body">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Question</label>
                                            <div class="col-sm-8">
                                                <select id="ddlQuestion" name="QuestionID" class="form-control clsSelect2 width-100-percent">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Condition</label>
                                            <div class="col-sm-8">
                                                <select id="ddlCondition" name="ConditionID" class="form-control clsSelect2 width-100-percent">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group" id="pnlCriteria" style="display: none;">
                                            <label class="col-sm-2 control-label">Criteria</label>
                                            <div class="col-sm-8">
                                                <input type="text" id="txtCriteria" name="Hint" class="form-control" placeholder="Criteria">
                                            </div>
                                        </div>
                                        <div class="form-group" id="pnlQuestionOption" style="display: none;">
                                            <label class="col-sm-2 control-label">Option</label>
                                            <div class="col-sm-8">
                                                <select id="ddlQuestionOption" name="QuestionOptionID" class="form-control clsSelect2 width-100-percent">
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-sm-2">
                                            </div>
                                            <div class="col-sm-8">
                                                <button id="btnAddCondition" type="button" class="btn btn-warning"><i class="fa fa-plus button-icon-padding"></i>Add</button>
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>
                                        <div class="col-sm-12">
                                            <script id="conditionTmpl" type="text/x-jquery-tmpl">
                                                <tr id="conditionRow${QuestionConditionID}">
                                                    <td class="cls-QuestionConditionID cls-display-none">${QuestionConditionID}</td>
                                                    <td class="cls-QuestionID cls-display-none">${QuestionID}</td>
                                                    <td class="cls-ConditionQuestionID cls-display-none">${ConditionQuestionID}</td>
                                                    <td class="cls-Question">${Question}</td>
                                                    <td class="cls-ConditionID cls-display-none">${ConditionID}</td>
                                                    <td class="cls-Condition">${Condition}</td>
                                                    <td class="cls-ConditionKey">${ConditionKey}</td>
                                                    <td class="cls-ConditionValue">${ConditionValue}</td>
                                                    <td class="cls-ConditionIsDelete">${IsDelete}</td>
                                                    <td><input type="button" value="x" onclick="deleteCondition(${QuestionConditionID})" /></td>
                                                </tr>
                                            </script>
                                            <table id="conditionTable" class="table table-bordered">
                                                <thead>
                                                    <th class="cls-display-none">QuestionConditionID</th>
                                                    <th class="cls-display-none">QuestionID</th>
                                                    <th class="cls-display-none">ConditionQuestionID</th>
                                                    <th>Question</th>
                                                    <th class="cls-display-none">ConditionID</th>
                                                    <th>Condition</th>
                                                    <th>Condition Key</th>
                                                    <th>Condition Value</th>
                                                    <th class="cls-display-none">IsDelete</th>
                                                    <th></th>
                                                </thead>
                                                <tbody id="conditionContainer">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <%-- Conditions ---> end --%>

                                <%-- Validations ---> start --%>
                                <div id="tab-Validations" class="tab-pane cls-tab">
                                    <div class="panel-body">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Validations</label>
                                        </div>
                                    </div>
                                </div>
                                <%-- Validations ---> end --%>

                                <%-- Matrix ---> start --%>
                                <div id="tab-Matrix" class="tab-pane">
                                    <div class="panel-body">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label">Matrix</label>
                                        </div>
                                    </div>
                                </div>
                                <%-- Matrix ---> end --%>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
