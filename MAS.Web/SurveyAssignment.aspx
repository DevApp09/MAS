<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SurveyAssignment.aspx.cs" Inherits="MAS.Web.SurveyAssignment" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
     <link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>
    <script src="js/Util.js"></script>
    <script src="js/FormScripts/SurveyAssignment.js"></script>
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
            <h2>Survey Assignment</h2>
            <ol class="breadcrumb">
                <li>App Configuration
                </li>
                <li class="active">
                    <strong>Survey Assignment</strong>
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
                        <h5>Survey Assignment</h5>
                        <button id="addNewBtn" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-plus button-icon-padding"></i>Add New</button>
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
                            <h5 id="formAction">Add Survey Assignment</h5>
                        </div>
                        <div class="col-lg-4 text-right">
                            <button id="btnBack" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                            <button id="btnSave" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                        </div>
                    </div>
                    <div class="ibox-content">
                        <input type="hidden" id="id" name="SurveyAssignmentID" value="-1" data-default="NULL" />
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Survey<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <select id="ddlSurvey" name="SurveyID" class="form-control clsSelect2" style="width: 100%;">
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Start Date<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtStartDate" name="Date" class="form-control datePicker clsText" placeholder="MM/DD/YY" data-provide="datepicker" readonly="readonly" maxlength="10">
                            </div>
                            <label class="col-sm-2 control-label">End Date<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtEndDate" name="Date" class="form-control datePicker clsText" placeholder="MM/DD/YY" data-provide="datepicker" readonly="readonly" maxlength="10">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Assignee<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <select id="ddlAssignee" name="AssigneeID" multiple class="form-control clsSelect2" style="width: 100%;">
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
