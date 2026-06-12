<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Meeting.aspx.cs" Inherits="MAS.Web.Meeting" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <link href="css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <link href="css/plugins/clockpicker/clockpicker.css" rel="stylesheet">
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>
    <script src="js/plugins/clockpicker/clockpicker.js"></script>
    <script src="js/Util.js"></script>
    <script src="js/FormScripts/Meeting.js"></script>
    <script src="js/plugins/summernote/summernote.min.js"></script>
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
            <h2>Meeting</h2>
            <ol class="breadcrumb">
                <li>App Configuration
                </li>
                <li class="active">
                    <strong>Meeting</strong>
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
                        <h5>Meeting</h5>
                        <button id="addNewBtn" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-plus button-icon-padding"></i>Add New</button>
                        <%--<button id="btnExport" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-file-excel-o button-icon-padding"></i>Export</button>--%>
                    </div>
                    <div class="ibox-content">
                        <%--<div class="row padding-left-20 padding-right-20">
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label>Question Type</label>
                                    <select id="ddlFilterMeetingOccurance" name="FilterMeetingOccuranceID" class="form-control select2">
                                    </select>
                                </div>
                            </div>
                        </div>--%>
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
                                            <li id="FollowUp">
                                                <span class="fa fa-download"></span>
                                                <span style="font-size: 11px; font-family: Verdana">FollowUp</span>
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
                            <h5 id="formAction">Add Meeting</h5>
                        </div>
                        <div class="col-lg-4 text-right">
                            <button id="btnBack" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                            <button id="btnSave" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                        </div>
                    </div>
                    <div class="ibox-content">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Title<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtTitle" name="Title" placeholder="Title" class="form-control" maxlength="500">
                            </div>
                            <label class="col-sm-2 control-label">Description<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtDescription" name="Description" placeholder="Description" class="form-control" maxlength="500">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Start Date<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtStartDate" name="StartDate" class="form-control datePicker clsText" placeholder="MM/DD/YY" data-provide="datepicker" readonly="readonly" maxlength="10">
                            </div>
                            <label class="col-sm-2 control-label">End Date<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtEndDate" name="EndDate" class="form-control datePicker clsText" placeholder="MM/DD/YY" data-provide="datepicker" readonly="readonly" maxlength="10">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Start Time<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtStartTime" name="StartTime" placeholder="hh:mm" class="form-control clockpicker readOnly" data-autoclose="true" readonly="readonly" />
                            </div>
                            <label class="col-sm-2 control-label">End Time<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtEndTime" name="EndTime" placeholder="hh:mm" class="form-control clockpicker readOnly" data-autoclose="true" readonly="readonly" />
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Occurance<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <select id="ddlMeetingOccurance" name="MeetingOccuranceID" class="form-control clsSelect2" style="width: 100%;">
                                </select>
                            </div>
                            <label class="col-sm-2 control-label">Location<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtLocation" name="Location" placeholder="Location" class="form-control" maxlength="50">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="row">
                            <div class="col-lg-12">
                                <h3>Agenda</h3>
                                <%--<script id="agendaTmpl" type="text/x-jquery-tmpl">
                                <tr>
                                    <td style="display: none;" class="clsUserID">${UserID}</td>
                                    <td style="display: none;" class="clsStudentID">${StudentID}</td>
                                    <td class="clsStudent">${RegistrationNumber + " - " + StudentName}</td>
                                    <td style="text-align: center;">
                                        <select class="clsStatus">
                                            <option value="1">Present</option>
                                            <option value="2">Absent</option>
                                            <option value="3">Leave</option>
                                        </select>
                                    </td>
                                </tr>
                            </script>--%>
                                <table style="width: 100%;" class="table table-bordered">
                                    <thead class="bg-info">
                                        <tr style="color: black;">
                                            <th style="width: 5%; display: none;">AgendaID</th>
                                            <th style="width: 5%;">S.NO</th>
                                            <th style="width: 20%;">Agenda Title</th>
                                            <th style="width: 20%;">Assignee</th>
                                            <th style="width: 10%;">Status</th>
                                            <th style="width: 15%;">Comments</th>
                                            <th style="width: 30%;">Completed</th>
                                        </tr>
                                        <tr style="color: black;">
                                            <td>1</td>
                                            <td>
                                                <input type="text" id="txtAgendaTitle" name="AgendaTitle" class="form-control" maxlength="200"></td>
                                            <td>
                                                <select id="ddlAgendaAssignee" name="AgendaAssigneeID" class="form-control clsSelect2" style="width: 100%;">
                                                </select>
                                            <td>
                                                <select class="form-control">
                                                    <option value="1">Select</option>
                                                    <option value="1">A</option>
                                                    <option value="2">B</option>
                                                    <option value="3">C</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input type="text" id="txtAgendaComments" name="AgendaComments" class="form-control" maxlength="500"></td>
                                            <td>
                                                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
                                                <button style="margin: 0px 200px 0px 0px !important;" id="addDelete" type="button" class="btn btn-primary pnl-btn">Delete</button>
                                                <button style="margin: -34px 100px -10px -130px !important;" id="addForward" type="button" class="btn btn-primary pnl-btn">Forward</button>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody id="agendaContainer">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Assignee<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <select id="ddlAttendeeAssignee" name="AttendeeAssigneeID" multiple class="form-control clsSelect2" style="width: 100%;">
                                </select>
                            </div>
                        </div>
                        <%--<div class="row">
                            <div class="col-lg-12">
                                <div class="col-sm-6">
                                    <h3>Attendance Requried</h3>
                                    <table style="width: 100%;" class="table table-bordered">
                                        <thead class="bg-info">
                                            <tr style="color: black;">
                                                <th style="width: 5%; display: none;">AgendaID</th>
                                                <th style="width: 5%;">S.NO</th>
                                                <th style="width: 20%;">Agenda Detail</th>
                                                <th style="width: 5%;">Action</th>
                                            </tr>
                                            <tr style="color: black;">
                                                <td>1</td>
                                                <td>
                                                    <input type="text" id="txtDetail2" name="Detail" class="form-control" maxlength="200">
                                                </td>
                                                <td>
                                                    <button style="margin: 0px 25px 0px 0px !important;" id="addDelete2" type="button" class="btn btn-primary pnl-btn">Delete</button>
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody id="agendaContainer2">
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-sm-6">
                                    <h3>Attendance Optional</h3>
                                    <table style="width: 100%;" class="table table-bordered">
                                        <thead class="bg-info">
                                            <tr style="color: black;">
                                                <th style="width: 5%; display: none;">AgendaID</th>
                                                <th style="width: 5%;">S.NO</th>
                                                <th style="width: 20%;">Agenda Detail</th>
                                                <th style="width: 5%;">Action</th>
                                            </tr>
                                            <tr style="color: black;">
                                                <td>1</td>
                                                <td>
                                                    <input type="text" id="txtDetail3" name="Detail" class="form-control" maxlength="200">
                                                </td>
                                                <td>
                                                    <button style="margin: 0px 25px 0px 0px !important;" id="addDelete3" type="button" class="btn btn-primary pnl-btn">Delete</button>
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody id="agendaContainer3">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="display: none" id="pnlHistory">
                        <div class="hr-line-dashed"></div>
                            <div class="col-lg-12">
                                <div class="col-sm-3">
                                    <h3>History</h3>
                                    <table style="width: 100%;" class="table table-bordered">
                                        <thead class="bg-info">
                                            <tr style="color: black;">
                                                <th style="width: 5%; display: none;">AgendaID</th>
                                                <th style="width: 10%;">Date</th>
                                                <th style="width: 2%;">Action</th>
                                            </tr>
                                            <tr style="color: black;">
                                                <td>
                                                   2023-05-20
                                                </td>
                                            </tr>
                                            <tr style="color: black;">
                                                <td>
                                                   2023-05-20
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody id="agendaContainer4">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>--%>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
