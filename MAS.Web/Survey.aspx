<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Survey.aspx.cs" Inherits="MAS.Web.Survey" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>

    <script src="js/Util.js"></script>
    <script src="js/FormScripts/Survey.js"></script>
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

        .active-btn {
            background-color: #28a745 !important; /* Green color for active button */
            border-color: #28a745 !important;
            color: white;
        }

        .inactive-btn {
            background-color: #6c757d !important; /* Gray color for inactive buttons */
            border-color: #6c757d !important;
            color: white;
        }

        .image-frame {
            position: relative;
            display: inline-block;
            border: 2px solid #ccc;
            padding: 5px;
            border-radius: 10px;
            background: #f8f9fa;
        }

        .button-group {
            position: absolute;
            top: 5px;
            right: 5px;
            display: flex; /* Ensures horizontal alignment */
            flex-direction: row; /* Forces row layout */
            gap: 5px; /* Adds spacing between buttons */
        }

        .close-btn, .download-btn {
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .close-btn {
            background: red;
        }

            .close-btn:hover {
                background: darkred;
                transform: scale(1.1);
            }

            .close-btn:active {
                background: rgb(255, 50, 50);
                transform: scale(0.9);
            }

        .download-btn {
            background: green;
        }

            .download-btn:hover {
                background: darkgreen;
                transform: scale(1.1);
            }

            .download-btn:active {
                background: rgb(50, 205, 50);
                transform: scale(0.9);
            }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-10">
            <h2>Survey</h2>
            <ol class="breadcrumb">
                <li>App Configuration
                </li>
                <li class="active">
                    <strong>Survey</strong>
                </li>
            </ol>
        </div>
        <div class="col-lg-2">
        </div>
    </div>
    <div class="wrapper wrapper-content animated fadeInRight">

        <%--Panel Main Survey Grid--%>
        <div id="pnlMain" class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>Survey</h5>
                        <button id="btnAdd" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-plus button-icon-padding"></i>Add New</button>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-sm-12">
                                <div id="ParentDiv">
                                    <table id="grid">
                                        <tbody>
                                            <tr>
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
                                                <span class="fa fa-paint-brush"></span>
                                                <span style="font-size: 11px; font-family: Verdana">Design</span>
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
        <%--Panel Main Survey Grid--%>



        <%--Panel - Design, Deploy and Responses--%>
        <div class="row" style="display: none" id="pnlAdd">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <div class="col-lg-4">
                            <h5 id="formAction">Design</h5>
                        </div>
                        <div class="col-lg-8 text-right">
                            <button id="btnResponses" type="button" class="btn btn-primary pnl-btn toggle-btn inactive-btn"><i class="fa fa-comments button-icon-padding"></i>Responses</button>
                            <button id="btnDeploy" type="button" class="btn btn-primary pnl-btn toggle-btn inactive-btn"><i class="fa fa-cloud-upload button-icon-padding"></i>Deploy</button>
                            <button id="btnDesign" type="button" class="btn btn-primary pnl-btn toggle-btn active-btn btn-success"><i class="fa fa-paint-brush button-icon-padding"></i>Design</button>
                            <button id="btnSave" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                            <button id="btnBack" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Discard</button>
                        </div>
                    </div>

                    <%--Design--%>
                    <div class="ibox-content clsTabs" id="divDesign">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Name</label>
                            <div class="col-sm-10">
                                <input type="text" id="txtName" name="Hint" class="form-control" placeholder="Name" />
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Description</label>
                            <div class="col-sm-10">
                                <input type="text" id="txtDescription" name="Hint" class="form-control" placeholder="Description" />
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <button type="button" class="btn btn-primary" data-toggle="modal" id="btnAddSection"><i class="fa fa-plus button-icon-padding"></i>Add Section</button>
                        <button type="button" class="btn btn-primary" data-toggle="modal" id="btnAddQuestion"><i class="fa fa-plus button-icon-padding"></i>Add Question</button>
                        <div id="sectionContainer"></div>
                        <div id="questionContainer"></div>
                    </div>

                    <%--Deploy--%>
                    <div class="ibox-content clsTabs" id="divDeploy" style="display: none">
                        <!-- Hidden original fields -->
                        <div style="display: none;">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Assignee<span class="mandantoryField">*</span></label>
                                <div class="col-sm-3">
                                    <select id="ddlAssignee" name="AssigneeID" multiple class="form-control clsSelect2" style="width: 100%;">
                                    </select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Manager<span class="mandantoryField">*</span></label>
                                <div class="col-sm-3">
                                    <select id="ddlManager" name="ManagerID" multiple class="form-control clsSelect2" style="width: 100%;">
                                    </select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Supervisor<span class="mandantoryField">*</span></label>
                                <div class="col-sm-3">
                                    <select id="ddlSupervisor" name="SupervisorID" multiple class="form-control clsSelect2" style="width: 100%;">
                                    </select>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                        </div>

                        <!-- New Role and User Selection Fields -->
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Role<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <select id="ddlDeployRole" class="form-control clsSelect2" style="width: 100%;">
                                    <option value="-1">--- Select ---</option>
                                    <option value="1">User</option>
                                    <option value="2">Manager</option>
                                    <option value="3">Supervisor</option>
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">User<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <select id="ddlDeployUser" class="form-control clsSelect2" style="width: 100%;">
                                    <option value="-1">--- Select ---</option>
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <div class="col-sm-3 col-sm-offset-2">
                                <button type="button" id="btnSaveDeploySingle" class="btn btn-primary"><i class="fa fa-save button-icon-padding"></i>Save</button>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>

                        <!-- New 2-Column Grid of Deployments -->
                        <div class="row">
                            <div class="col-sm-12">
                                <div id="ParentDivDeployGrid">
                                    <table id="gridDeploy">
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div id="gridpagerDeploy"></div>
                                    <div class="contextMenu" id="GridContextMenuDeploy" style="display: none">
                                        <ul style="width: 150px !important">
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

                    <%--Responses--%>
                    <div class="ibox-content clsTabs" id="divResponses" style="display: none;">
                        <div class="row">                            
                            <div class="col-lg-12 text-right">
                                <button id="btnExport" type="button" class="btn btn-warning"><i class="fa fa-download button-icon-padding"></i>Export</button>
                                <button id="btnImportTemplate" type="button" class="btn btn-warning"><i class="fa fa-download button-icon-padding"></i>Download Import Template</button>
                                <button id="openUploadModal" type="button" class="btn btn-primary"><i class="fa fa-upload button-icon-padding"></i>Import</button>
                                <button id="btnReport" type="button" class="btn btn-primary"><i class="fa fa-bar-chart-o button-icon-padding"></i>Report</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12">
                                <div id="ParentDiv2">
                                    <table id="grid2">
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div id="gridpager2">
                                    </div>
                                    <div class="contextMenu" id="GridContextMenu2" style="display: none">
                                        <ul style="width: 150px !important">
                                            <li id="Preview">
                                                <span class="fa fa-desktop"></span>
                                                <span style="font-size: 11px; font-family: Verdana">Preview</span>
                                            </li>
                                            <li id="View">
                                                <span class="fa fa-eye"></span>
                                                <span style="font-size: 11px; font-family: Verdana">View</span>
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

        <div class="modal inmodal fade" id="pnlSectionNameModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title">Section Name</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Name</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control" placeholder="Name" id="sectionNameTb" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="saveSectionNameBtn" class="btn btn-primary"><i class="fa fa-save button-icon-padding"></i>Save</button>
                        <button type="button" class="btn btn-white" data-dismiss="modal"><i class="fa fa-close button-icon-padding"></i>Close</button>
                    </div>
                </div>
            </div>
        </div>

        <script id="sectionTmpl" type="text/x-jquery-tmpl">
            <div class="form-group">
                <div class="col-lg-12" id="divsection_${SectionID}">
                    <div class="ibox" id="diviboxsection_${SectionID}">
                        <div class="ibox-title" style="background-color: #f9f9fb !important; border-color: #e7eaec !important; border-width: 1px !important;">
                            <h5 id="sectionTitle_${SectionID}"><span id="sectionSequence_${SectionID}"></span>. <span id="sectionTitleText_${SectionID}">${SectionName}</span></h5>
                            <div class="ibox-tools">
                                <a class="collapse-link">
                                    <i class="fa fa-chevron-up" id="btniboxsection_${SectionID}" onclick="pnlSectionShowHide(${SectionID})"></i>
                                </a>
                                <a class="close-link">
                                    <i class="fa fa-times" onclick="removeSection(${SectionID})"></i>
                                </a>
                            </div>
                        </div>
                        <div class="ibox-content" style="border-color: #e7eaec !important; border-width: 1px; border-bottom: 1px solid #e7eaec;" id="diviboxcontentsection_${SectionID}">
                            <div id="questionContainer_${SectionID}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </script>

        <script id="questionTmpl" type="text/x-jquery-tmpl">
            <div class="form-group">
                <div class="col-lg-12" id="divQuestion_${QuestionID}">
                    <div class="ibox" id="divibox_${QuestionID}">
                        <div class="ibox-title" style="background-color: #f9f9fb !important; border-color: #e7eaec !important; border-width: 1px !important;">
                            <h5 id="questionTitle_${QuestionID}"><span id="questionSequence_${QuestionID}"></span>. <span id="questionTitleText_${QuestionID}"></span></h5>
                            <div class="ibox-tools">
                                <a class="collapse-link">
                                    <i class="fa fa-chevron-up" id="btnibox_${QuestionID}" onclick="pnlQuestionShowHide(${QuestionID})"></i>
                                </a>
                                <a class="close-link">
                                    <i class="fa fa-times" onclick="removeQuestion(${QuestionID})"></i>
                                </a>
                            </div>
                        </div>
                        <div class="ibox-content" style="border-color: #e7eaec !important; border-width: 1px; border-bottom: 1px solid #e7eaec;" id="diviboxcontent_${QuestionID}">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Question Type</label>
                                <div class="col-sm-10">
                                    <select id="ddlQuestionType_${QuestionID}" name="QuestionType" class="form-control clsSelect2 width-100-percent cls-QuestionType cls-${QuestionID}" onchange="onchangeQuestionType(${QuestionID})">
                                    </select>
                                </div>
                            </div>
                            <div id="formatDiv_${QuestionID}" style="display: none">
                                <div class="hr-line-dashed"></div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">Format</label>
                                    <div class="col-sm-10">
                                        <select id="ddlQuestionTypeFormat_${QuestionID}" name="QuestionTypeFormat" class="form-control clsSelect2 width-100-percent cls-QuestionType cls-${QuestionID}">
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Requried</label>
                                <div class="col-sm-10">
                                    <div class="switch">
                                        <div class="onoffswitch">
                                            <input type="checkbox" class="onoffswitch-checkbox cls-${QuestionID}" id="cbQuestionIsRequired_${QuestionID}" name="cbQuestionIsRequired_${QuestionID}" />
                                            <label class="onoffswitch-label" for="cbQuestionIsRequired_${QuestionID}">
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
                                    <%--<input type="text"  class="cls-QuestionName form-control" placeholder="Name" id="txtQuestionName_${QuestionID}" onchange="onchangeQuestionName(${QuestionID})" onblur="onchangeQuestionName(${QuestionID})" />--%>
                                    <input type="text" class="cls-QuestionName form-control cls-${QuestionID}" placeholder="Name" id="txtQuestionName_${QuestionID}" onkeyup="onchangeQuestionName(${QuestionID})" />
                                </div>
                            </div>
                            <div id="divQuestionUnit_${QuestionID}" style="display: none">
                                <div class="hr-line-dashed"></div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">Unit</label>
                                    <div class="col-sm-10">
                                        <%--<input type="text"  class="cls-QuestionName form-control" placeholder="Name" id="txtQuestionName_${QuestionID}" onchange="onchangeQuestionName(${QuestionID})" onblur="onchangeQuestionName(${QuestionID})" />--%>
                                        <input type="text" class="cls-QuestionUnit form-control cls-${QuestionID}" placeholder="Unit" id="txtQuestionUnit_${QuestionID}" />
                                    </div>
                                </div>
                            </div>

                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Hint</label>
                                <div class="col-sm-10">
                                    <input type="text" class="cls-QuestionHint form-control cls-${QuestionID}" placeholder="Hint" id="txtQuestionHint_${QuestionID}" />
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Length</label>
                                <div class="col-sm-10">
                                    <input type="text" class="cls-QuestionLength form-control cls-${QuestionID}" placeholder="Length" id="txtQuestionLength_${QuestionID}" />
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Alternate</label>
                                <div class="col-sm-10">
                                    <div class="switch">
                                        <div class="onoffswitch">
                                            <input type="checkbox" class="onoffswitch-checkbox cls-${QuestionID}" id="cbQuestionIsNotApplicableOption_${QuestionID}" name="IsNotApplicableOption" />
                                            <label class="onoffswitch-label" for="cbQuestionIsNotApplicableOption_${QuestionID}">
                                                <span class="onoffswitch-inner"></span>
                                                <span class="onoffswitch-switch"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <label>Not Applicable Option</label>
                                    <div class="switch">
                                        <div class="onoffswitch">
                                            <input type="checkbox" class="onoffswitch-checkbox cls-${QuestionID}" id="cbQuestionIsDontKnowOption_${QuestionID}" name="IsDontKnowOption" />
                                            <label class="onoffswitch-label" for="cbQuestionIsDontKnowOption_${QuestionID}">
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
                                            <input type="checkbox" class="onoffswitch-checkbox cls-${QuestionID}" id="cbQuestionIsAdvanced_${QuestionID}" name="IsAdvanced" />
                                            <label class="onoffswitch-label" for="cbQuestionIsAdvanced_${QuestionID}">
                                                <span class="onoffswitch-inner"></span>
                                                <span class="onoffswitch-switch"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <label>Include a comment field with question</label>
                                    <div class="switch">
                                        <div class="onoffswitch">
                                            <input type="checkbox" class="onoffswitch-checkbox cls-${QuestionID}" id="cbQuestionRecordGPS_${QuestionID}" name="DoRecordGPS" />
                                            <label class="onoffswitch-label" for="cbQuestionRecordGPS_${QuestionID}">
                                                <span class="onoffswitch-inner"></span>
                                                <span class="onoffswitch-switch"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <label>Record GPS where question was answered</label>
                                </div>
                            </div>
                            <div class="hr-line-dashed" style="display: none"></div>
                            <div id="pnlAdvanced_${QuestionID}" style="display: none">
                                <div class="hr-line-dashed"></div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label">Comments</label>
                                    <div class="col-sm-10">
                                        <input type="text" id="txtQuestionComments_${QuestionID}" name="Comments" class="form-control cls-${QuestionID}" placeholder="Comments" />
                                    </div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">Active</label>
                                <div class="col-sm-10">
                                    <div class="switch">
                                        <div class="onoffswitch">
                                            <input type="checkbox" checked="" class="onoffswitch-checkbox cls-${QuestionID}" id="cbQuestionIsActive_${QuestionID}" name="IsActive" />
                                            <label class="onoffswitch-label" for="cbQuestionIsActive_${QuestionID}">
                                                <span class="onoffswitch-inner"></span>
                                                <span class="onoffswitch-switch"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group" id="pnlOption_${QuestionID}" style="display: none;">
                                <label class="col-sm-2 control-label">Options</label>
                                <div class="col-sm-10">
                                    <button type="button" class="btn btn-primary cls-btnAddOptionModal" onclick="btnAddOptionModal(${QuestionID})">Add Option</button>
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group" id="pnlCondition_${QuestionID}" style="display:none;">
                                <label class="col-sm-2 control-label">Conditions</label>
                                <div class="col-sm-10">
                                    <button type="button" class="btn btn-primary cls-btnAddConditionModal" onclick="btnAddConditionModal(${QuestionID})">Add Condition</button>
                                </div>
                            </div>
                            <div id="pnlCascadeDiv_${QuestionID}" style="display: none">
                                <div class="hr-line-dashed"></div>
                                <div class="form-group" id="pnlCascadeDdl_${QuestionID}">
                                    <label class="col-sm-2 control-label">Cascade Drop Down</label>
                                    <div class="col-sm-10" id="pnlDesignCascadeDiv_${QuestionID}">
                                        <input type="button" value="Add Column" onclick="addColumn(${QuestionID})" />
                                        <input type="button" value="Add Row" onclick="addRow(${QuestionID})" />
                                        <table style="width: 100%">
                                            <thead id="cddlThead_${QuestionID}">
                                                <tr>
                                                    <td>
                                                        <input class="cddlName" type="text" value="" placeholder="Drop Down 1 Name">
                                                        <input type="button" value="Remove Column" onclick="removeColumn(this,${QuestionID})" /></td>
                                                    <td>
                                                        <input class="cddlName" type="text" value="" placeholder="Drop Down 2 Name" />
                                                        <input type="button" value="Remove Column" onclick="removeColumn(this,${QuestionID})" /></td>
                                                    <td id="cddlLastCol_${QuestionID}" class="cddlIgnore"></td>
                                                </tr>
                                            </thead>
                                            <tbody id="cddlTbody_${QuestionID}">
                                                <tr>
                                                    <td>
                                                        <input class="cddlValue" type="text" value="" placeholder="Drop Down 1 Value" /></td>
                                                    <td>
                                                        <input class="cddlValue" type="text" value="" placeholder="Drop Down 2 Value" /></td>
                                                    <td class="cddlIgnore">
                                                        <input type="button" value="Remove Row" onclick="removeRow(this,${QuestionID})" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </script>

        <script id="cddTmpl" type="text/x-jquery-tmpl">
            <div class="hr-line-dashed"></div>
            <div class="form-group" id="pnlCascadeDdl_${QuestionID}">
                <label class="col-sm-2 control-label">Cascade Drop Down</label>
                <div class="col-sm-10" id="pnlDesignCascadeDiv_${QuestionID}">
                    <input type="button" value="Add Column" onclick="addColumn(${QuestionID})" />
                    <input type="button" value="Add Row" onclick="addRow(${QuestionID})" />
                    <table style="width: 100%">
                        <thead id="cddlThead_${QuestionID}">
                            <tr>
                                <td>
                                    <input class="cddlName" type="text" value="" placeholder="Drop Down 1 Name">
                                    <input type="button" value="Remove Column" onclick="removeColumn(this,${QuestionID})" /></td>
                                <td>
                                    <input class="cddlName" type="text" value="" placeholder="Drop Down 2 Name" />
                                    <input type="button" value="Remove Column" onclick="removeColumn(this,${QuestionID})" /></td>
                                <td id="cddlLastCol_${QuestionID}" class="cddlIgnore"></td>
                            </tr>
                        </thead>
                        <tbody id="cddlTbody_${QuestionID}">
                            <tr>
                                <td>
                                    <input class="cddlValue" type="text" value="" placeholder="Drop Down 1 Value" /></td>
                                <td>
                                    <input class="cddlValue" type="text" value="" placeholder="Drop Down 2 Value" /></td>
                                <td class="cddlIgnore">
                                    <input type="button" value="Remove Row" onclick="removeRow(this,${QuestionID})" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </script>

        <script id="cddlColTmpl" type="text/x-jquery-tmpl">
            <td>
                <input class="cddlName" type="text" value="" placeholder="Drop Down ${index} Name" />
                <input type="button" value="Remove Column" onclick="removeColumn(this,${QuestionID})" /></td>
        </script>

        <script id="cddlCellTmpl" type="text/x-jquery-tmpl">
            <td>
                <input class="cddlValue" type="text" value="" placeholder="Drop Down ${index} Value" /></td>
        </script>

        <div class="modal inmodal fade" id="pnlOptionModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title">Option</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Option</label>
                            <div class="col-sm-8">
                                <input type="text" id="txtOption" name="Option" class="form-control" placeholder="Option" />
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-2">
                            </div>
                            <div class="col-sm-8">
                                <button id="btnAddOption" type="button" class="btn btn-warning"><i class="fa fa-plus button-icon-padding"></i>Add</button>
                                <button id="btnUpdateOption" type="button" class="btn btn-warning"><i class="fa fa-save button-icon-padding"></i>Update</button>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="row">
                            <div class="col-sm-12">
                                <script id="optionTmpl" type="text/x-jquery-tmpl">
                                    <tr id="optionRow_${QuestionID}_${QuestionOptionID}">
                                        <td class="cls-QuestionOptionID cls-display-none">${QuestionID}</td>
                                        <td class="cls-QuestionOptionID cls-display-none">${QuestionOptionID}</td>
                                        <td id="optionCell_${QuestionID}_${QuestionOptionID}" class="cls-Option cls-text-Option${QuestionOptionID}">${Option}</td>
                                        <td id="optionStateCell_${QuestionID}_${QuestionOptionID}" class="cls-OptionState">${State}</td>
                                        <td>
                                            <input type="button" value="e" onclick="editOption(${QuestionID},${QuestionOptionID})" />
                                            <input type="button" value="x" onclick="deleteOption(${QuestionID},${QuestionOptionID})" />
                                        </td>
                                    </tr>
                                </script>
                                <table id="optionTable" class="table table-bordered">
                                    <thead>
                                        <th class="cls-display-none">QuestionID</th>
                                        <th class="cls-display-none">QuestionOptionID</th>
                                        <th>Option</th>
                                        <th>State</th>
                                        <th></th>
                                    </thead>
                                    <tbody id="optionContainer">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-white" data-dismiss="modal"><i class="fa fa-close button-icon-padding"></i>Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal inmodal fade" id="pnlConditionModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title">Condition</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Question</label>
                            <div class="col-sm-8">
                                <select id="ddlQuestion" name="QuestionID" class="form-control clsSelect2 width-100-percent">
                                    <option value="-1">--- Select ---</option>
                                    <option value="1001">Q1</option>
                                    <option value="1002">Q2</option>
                                    <option value="1003">Q3</option>
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Condition</label>
                            <div class="col-sm-8">
                                <select id="ddlCondition" name="ConditionID" class="form-control clsSelect2 width-100-percent">
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-2">
                            </div>
                            <div class="col-sm-8">
                                <button id="btnAddCondition" type="button" class="btn btn-warning"><i class="fa fa-plus button-icon-padding"></i>Add</button>
                                <button id="btnUpdateCondition" type="button" class="btn btn-warning"><i class="fa fa-save button-icon-padding"></i>Update</button>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="row">
                            <div class="col-sm-12">
                                <script id="conditionTmpl" type="text/x-jquery-tmpl">
                                    <tr id="conditionRow_${QuestionID}_${QuestionConditionID}">
                                        <td class="cls-QuestionID cls-display-none">${QuestionID}</td>
                                        <td class="cls-QuestionConditionID cls-display-none">${QuestionConditionID}</td>
                                        <td id="conditionCellQuestionID_${QuestionID}_${QuestionConditionID}" class="cls-ConditionQuestionID cls-display-none">${ConditionQuestionID}</td>
                                        <td id="conditionCellQuestion_${QuestionID}_${QuestionConditionID}" class="cls-ConditionQuestion">${ConditionQuestion}</td>
                                        <td id="conditionCellConditionID_${QuestionID}_${QuestionConditionID}" class="cls-ConditionID cls-display-none">${ConditionID}</td>
                                        <td id="conditionCellCondition_${QuestionID}_${QuestionConditionID}" class="cls-Condition">${Condition}</td>
                                        <td class="cls-ConditionState">${State}</td>
                                        <td>
                                            <input type="button" value="x" onclick="deleteCondition(${QuestionID},${QuestionConditionID})" /></td>
                                    </tr>
                                </script>
                                <table id="conditionTable" class="table table-bordered">
                                    <thead>
                                        <th class="cls-display-none">QuestionID</th>
                                        <th class="cls-display-none">QuestionConditionID</th>
                                        <th class="cls-display-none">ConditionQuestionID</th>
                                        <th>Question</th>
                                        <th class="cls-display-none">ConditionID</th>
                                        <th>Condition</th>
                                        <th>State</th>
                                        <th></th>
                                    </thead>
                                    <tbody id="conditionContainer">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-white" data-dismiss="modal"><i class="fa fa-close button-icon-padding"></i>Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal inmodal fade" id="pnlErrorModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                        <h4 class="modal-title">Errors</h4>
                    </div>
                    <div class="modal-body" id="pnlErrorMessage">
                    </div>
                </div>
            </div>
        </div>
        <%--Panel - Design, Deploy and Responses--%>



        <%--Survey Preview--%>
        <div id="pnlMain2" class="row" style="display: none">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>View Submitted Survey</h5>
                        <button id="btnSave2" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                        <button id="btnBack2" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-sm-12">
                                <div id="sectionContainer2">
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>

        <script id="sectionTmpl2" type="text/x-jquery-tmpl">
            <div class="form-group">
                <div class="col-lg-12" id="divsection2_${SectionID}">
                    <div class="ibox" id="diviboxsection2_${SectionID}">
                        <div class="ibox-title" style="background-color: #f9f9fb !important; border-color: #e7eaec !important; border-width: 1px !important;">
                            <h5 id="sectionTitle2_${SectionID}"><span id="sectionSequence2_${SectionID}"></span>. <span id="sectionTitleText2_${SectionID}">${SectionName}</span></h5>
                            <div class="ibox-tools">
                                <a class="collapse-link">
                                    <i class="fa fa-chevron-up" id="btniboxsection2_${SectionID}" onclick="pnlSectionShowHide2(${SectionID})"></i>
                                </a>
                                <a class="close-link">
                                    <i class="fa fa-times" onclick="removeSection(${SectionID})"></i>
                                </a>
                            </div>
                        </div>
                        <div class="ibox-content" style="border-color: #e7eaec !important; border-width: 1px; border-bottom: 1px solid #e7eaec;" id="diviboxcontentsection2_${SectionID}">
                            <div id="questionContainer2_${SectionID}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </script>

        <script id="numberQuestionTmpl" type="text/x-jquery-tmpl">
            <div class="form-group clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    {{if FormatID == 29}}
                        <input type="text" class="form-control clsCtrl clsWholeNumberMask" id="txtQuestion_${QuestionID}" value="${Answer}" />
                    {{else FormatID == 30}}
                        <input type="text" class="form-control clsCtrl clsDecimalNumberMask" id="txtQuestion_${QuestionID}" value="${Answer}" />
                    {{/if}}
                </div>
                {{if DoRecordGPS == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="txtQuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="dropdownQuestionTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    <select class="form-control clsCtrl" id="ddlQuestion_${QuestionID}">
                        {{each Options}}
                    {{if Answer == QuestionOptionID }}
                        <option value="${QuestionOptionID}" selected>${Option}</option>
                        {{else}}
                                <option value="${QuestionOptionID}">${Option}</option>
                        {{/if}}
                {{/each}}
                    </select>
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="radioQuestionTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    {{each Options}}
                        {{if Answer == QuestionOptionID }}
                            <label>
                                <input checked="checked" class="clsCtrl" type="radio" name="rdo${QuestionID}" id="txtQuestion2${QuestionID}${QuestionOptionID}" value="${QuestionOptionID}" data-option="${Option}">${Option}</label><br>
                    {{else}}
                                    <label>
                                        <input type="radio" class="clsCtrl" name="rdo${QuestionID}" id="txtQuestion2${QuestionID}${QuestionOptionID}" value="${QuestionOptionID}" data-option="${Option}">${Option}</label><br>
                    {{/if}}
                    {{/each}}
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="cbQuestionTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    {{each Options}}
                {{if Answer == QuestionOptionID }}
                    <label>
                        <input checked="checked" class="clsCtrl" type="checkbox" name="rdo${QuestionID}" id="txtQuestion2${QuestionID}${QuestionOptionID}" value="${QuestionOptionID}" data-option="${Option}">${Option}</label><br>
                    {{else}}
                        <label>
                            <input type="checkbox" class="clsCtrl" name="rdo${QuestionID}" id="txtQuestion2${QuestionID}${QuestionOptionID}" value="${QuestionOptionID}" data-option="${Option}">${Option}</label><br>
                    {{/if}}
            {{/each}}
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="mcbQuestionTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    {{each Options}}
                {{if isChecked(QuestionOptionID) == true }}
                    <label>
                        <input checked="checked" class="clsCtrl" type="checkbox" name="rdo${QuestionID}" id="txtQuestion2${QuestionID}${QuestionOptionID}" value="${QuestionOptionID}" data-option="${Option}">${Option}</label><br>
                    {{else}}
                            <label>
                                <input type="checkbox" class="clsCtrl" name="rdo${QuestionID}" id="txtQuestion2${QuestionID}${QuestionOptionID}" value="${QuestionOptionID}" data-option="${Option}">${Option}</label><br>
                    {{/if}}
            {{/each}}
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="inputTextDateTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    <input type="text" class="form-control clsCtrl clsDateMask" placeholder="${Format}" id="txtQuestion2${QuestionID}" value="${Answer}" data-mask="${Format}" />'
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="inputTextTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    {{if FormatID == 4}}
                        <input type="text" class="form-control clsCtrl" id="txtQuestion2${QuestionID}" value="${Answer}" />'
                    {{else FormatID == 3}}
                        <textarea rows="3" class="form-control clsCtrl" id="txtQuestion2${QuestionID}">${Answer}</textarea>'
                    {{else FormatID == 1}}
                        <input type="text" class="form-control clsCtrl clsURLMask" id="txtQuestion2${QuestionID}" value="${Answer}" />'
                    {{else FormatID == 2}}
                        <input type="text" class="form-control clsCtrl clsEmailMask" id="txtQuestion2${QuestionID}" value="${Answer}" />'
                    {{/if}}
                    
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <%-- <script id="inputMultiTextTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    <textarea rows="3" class="form-control clsCtrl" id="txtQuestion2${QuestionID}">${Answer}</textarea>'
                </div>
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
            </div>
        </script>--%>

        <script id="inputImageTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>


                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    {{if Answer == ''}}
            {{else}}
                    <div class="image-frame">
                        <div class="button-group">
                            <button class="download-btn" onclick="downloadImage(this)">↓</button>
                            <button class="close-btn" onclick="removeImage(this)">×</button>
                        </div>


                        <img alt="image" class="clsCtrl clsCtrlImg" id="txtQuestion2${QuestionID}" src="${Answer}" />
                    </div>

                    {{/if}}
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="inputImagesTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    {{each Answer}}
                    <div class="image-frame">
                        <div class="button-group">
                            <button class="download-btn" onclick="downloadImage(this)">↓</button>
                            <button class="close-btn" onclick="removeImage(this)">×</button>
                        </div>


                        <img alt="image" class="clsCtrl clsCtrlImg" id="txtQuestion2${QuestionID}" src="${$value}" />
                    </div>

                    {{/each}}
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="locationTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question}</label>
                <div class="col-sm-12 clsCtrl clsCtrlLocation" id="divQuestion2_${QuestionID}">
                    <div class="row">
                        <div class="col-md-3 d-flex">
                            <label class="col-sm-6">
                                <h4>Latitude</h4>
                            </label>
                        </div>
                        <div class="col-md-3 d-flex">
                            <input class="form-control clsCtrlLatitude" type="text" value="${Answer[0]}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 d-flex">
                            <label class="col-sm-6">
                                <h4>Longitutde</h4>
                            </label>
                        </div>
                        <div class="col-md-3 d-flex">
                            <input class="form-control clsCtrlLongitutde" type="text" value="${Answer[1]}" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3 d-flex">
                            <label class="col-sm-6">
                                <h4>Answer Type</h4>
                            </label>
                        </div>
                        <div class="col-md-3 d-flex">
                            <label class="col-sm-6 clsCtrlAnswerType">${Answer[2]}</label>
                        </div>
                    </div>
                </div>
            </div>
        </script>

        <script id="inputUnitTmpl" type="text/x-jquery-tmpl">
            <div class="form-group  clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                <label class="col-sm-12">${Question} (${Unit})</label>
                <div class="col-sm-12" id="divQuestion2_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="txtQuestion2${QuestionID}" value="${Answer}" />'
                </div>
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>

        <script id="cddlQuestionTmpl" type="text/x-jquery-tmpl">
            <div id="cddlDiv_${QuestionID}" data-cascademarkup="${CascadeDropDownMarkup}" class="form-group  cddlDiv clsQuestion" data-surveyassigneid="${SurveyAssigeeID}" data-questionid="${QuestionID}" data-questiontypeid="${QuestionTypeID}">
                {{each CascadeDdlNames}}
                <label class="col-sm-12">${$value}</label>
                <div class="col-sm-12">
                    <select name="${encodeURIComponent($value)}" onchange="onChangeCascadeDropdown(this)" class="form-control clsCtrl clsCtrlCascade">
                        <option value="-1">--- Select ---</option>
                    </select>
                </div>
                {{/each}}
                {{if IsAdvanced == true }}
                <label class="col-sm-12">Comment</label>
                <div class="col-sm-12" id="divQuestion2Comment_${QuestionID}">
                    <input type="text" class="form-control clsCtrl" id="QuestionComment_${QuestionID}" value="${Comment}" readonly="readonly" />
                </div>
                {{/if}}
                {{if DoRecordGPS == true }}
                <div class="row">
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Latitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Laitude}</label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">
                            <h4>Longitude</h4>
                        </label>
                    </div>
                    <div class="col-md-3 d-flex">
                        <label class="col-sm-12">${Longitude}</label>
                    </div>
                </div>
                {{/if}}
            </div>
        </script>
        <%--Survey Preview--%>



        <%--Survey View--%>
        <div id="pnlMain3" class="row" style="display: none">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>View Survey</h5>
                        <button id="btnBack3" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-sm-12">
                                <div id="surveyViewContainer">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script id="surveyViewTmpl" type="text/x-jquery-tmpl">
            <div class="row">
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">
                        <h4>Survey</h4>
                    </label>
                </div>
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">${Name}</label>
                </div>
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">
                        <h4>Submitted Date</h4>
                    </label>
                </div>
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">${SubmittedDate}</label>
                </div>
            </div>
            <div class="row">
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">
                        <h4>Assignee</h4>
                    </label>
                </div>
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">${Assignee}</label>
                </div>
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">
                        <h4>Status</h4>
                    </label>
                </div>
                <div class="col-md-3 d-flex">
                    <label class="col-sm-12">${Status}</label>
                </div>
            </div>
            <br />
            <br />
            <div class="col-lg-12">
            <div class="row">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>
                                <h4>Question</h4>
                            </th>
                            <th>
                                <h4>Asnwer</h4>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {{each getAllSections()}}
                            <tr style="background-color: #f9f9f9;">
                                <td colspan="2">${SectionName}</td>
                            </tr>
                        {{each getSectionQuestions(SectionID)}}
                                        <tr>
                                            <td>${Question}</td>
                                            <td>{{if QuestionTypeID == 9 }}
                                                    <img src="${getAnswerData(QuestionID,false,QuestionTypeID)}" />
                                                {{else QuestionTypeID == 10}}
                                                    {{each getAnswerData(QuestionID,false,QuestionTypeID)}}
                                                     <img src="${$value}" />
                                                {{/each}}
                                                {{else QuestionTypeID == 11}}
                                                    {{each getAnswerData(QuestionID,false,QuestionTypeID)}}
                                                        Latitude:${Latitude}, Langitude:${Langitude}, Answer Type: ${AnswerType}
                                                    {{/each}}
                                                {{else}}
                                                    ${getAnswerData(QuestionID,false,QuestionTypeID)}
                                                {{/if}}
                                                <br />
                                                {{if DoRecordGPS == true}}
                                                    
                                                Latitude :${getOtherData(QuestionID).Latitude}, Longitude :${getOtherData(QuestionID).Longitude}
                                                    <br />

                                                {{/if}}
                                                ${getOtherData(QuestionID).Comment}
                                            </td>
                                        </tr>
                        {{/each}}
                        {{/each}}
                    </tbody>
                </table>
            </div>
                </div>
        </script>
        <%--Survey View--%>
    </div>
    
    <div class="modal" id="fileUploadModal" tabindex="-1" role="dialog" aria-labelledby="fileUploadModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="fileUploadModalLabel">Import Response</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- File upload form -->
                    <form id="fileUploadForm" action="FileTransmissionEndPoint.aspx" method="post" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="fileInput">Choose File</label>
                            <input type="file" class="form-control" id="fileInput" name="fileInput" required>
                        </div>
                        <div>
                            <div id="uploadStatusSuccess" style="display:none;" class="label label-primary col-sm-4"></div>
                            <div id="uploadStatusError" style="display:none;" class="label label-danger col-sm-4"></div>
                            <br />
                            <a id="downloadFile" href="Temp" download="ImportError.txt" style="display:none;">Download file</a>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-close button-icon-padding"></i>Close</button>
                    <button type="button" class="btn btn-primary" id="submitUploadForm"><i class="fa fa-upload button-icon-padding"></i>Import</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
