<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Knowledge.aspx.cs" Inherits="MAS.Web.Knowledge" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <link href="css/plugins/dropzone/dropzone.css" rel="stylesheet" />
    <link href="css/plugins/dropzone/basic.css" rel="stylesheet" />
    <link href="css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>
    <script src="js/plugins/dropzone/dropzone.js"></script>
    <script src="js/Util.js"></script>
    <script src="js/FormScripts/Knowledge.js"></script>
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
    <script type="text/javascript">
        Dropzone.autoDiscover = false;
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-10">
            <h2>Knowledge</h2>
            <ol class="breadcrumb">
                <li>App Configuration
                </li>
                <li class="active">
                    <strong>Knowledge</strong>
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
                        <h5>Knowledge</h5>
                        <button id="addNewBtn" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-plus button-icon-padding"></i>Add New</button>
                        <%--<button id="btnExport" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-file-excel-o button-icon-padding"></i>Export</button>--%>
                    </div>
                    <div class="ibox-content">
                        <div class="row padding-left-20 padding-right-20">
                            <div class="col-sm-2">
                                <div class="form-group">
                                    <label>Knowledge Type</label>
                                    <select id="ddlFilterKnowledgeType" name="FilterKnowledgeTypeID" class="form-control select2">
                                    </select>
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
                                            <li id="Download">
                                                <span class="fa fa-download"></span>
                                                <span style="font-size: 11px; font-family: Verdana">Download</span>
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
                            <h5 id="formAction">Add Knowledge</h5>
                        </div>
                        <div class="col-lg-4 text-right">
                            <button id="btnBack" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                            <button id="btnSave" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                        </div>
                    </div>
                    <div class="ibox-content">
                        <input type="hidden" id="id" name="KnowledgeID" value="-1" data-default="NULL" />
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Knowledge Type<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <select id="ddlKnowledgeType" name="KnowledgeTypeID" class="form-control clsSelect2" style="width: 100%;">
                                </select>
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Date<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtDate" name="Date" class="form-control datePicker clsText" placeholder="MM/DD/YY" data-provide="datepicker" readonly="readonly" maxlength="10">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Title<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtTitle" name="Title" placeholder="Title" class="form-control" maxlength="200">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Description<span class="mandantoryField">*</span></label>
                            <div class="col-sm-3">
                                <input type="text" id="txtDescription" name="Description" placeholder="Description" class="form-control" maxlength="500">
                            </div>
                        </div>
                        <div class="hr-line-dashed"></div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"></label>
                            <div class="col-sm-10">
                                <label title="UploadFile" id="fsUpload" for="inputFile" class="btn btn-primary col-sm-2"><i class="fa fa-upload" aria-hidden="true"></i>&nbsp;Upload File</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%--[UPLOADER]--%>
    <div style="display: none;" id="dropZoneTemplate">
        <div class="mdz-wrapper">
            <div class="mdz-content-wrapper">
                <div class="mdz-file-icon">
                    <i class="material-icons">insert_drive_file</i>
                </div>
                <div class="mdz-file-info">
                    <p data-dz-name></p>
                    |
						<p data-dz-size></p>
                </div>
            </div>
            <div>
                <div>
                    <p data-dzc-id></p>
                </div>
                <i class="material-icons" data-dz-remove>cancel</i>
            </div>
        </div>
    </div>
    <div class="modal inmodal fade" id="myModal5" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">Upload File</h4>
                </div>
                <div class="modal-body">
                    <form action="\FileTransmissionEndPoint.aspx" runat="server" id="dropzoneForm" class="dropzone">
                        <div class="fallback">
                            <input id="fileUpload" name="file" type="file" accept="application/msword, application/pdf, image/*" />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" id="closeImageUploader" class="btn btn-white" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
    <%--[UPLOADER]--%>
</asp:Content>