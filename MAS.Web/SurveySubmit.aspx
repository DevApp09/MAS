<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SurveySubmit.aspx.cs" Inherits="MAS.Web.SurveySubmit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <link href="css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>
    <script src="js/Util.js"></script>
    <script src="js/FormScripts/SurveySubmit.js"></script>
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
        <div id="pnlMain" class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>Survey</h5>
                        <button style="display: none;" id="addNewBtn" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-plus button-icon-padding"></i>Add New</button>
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
                                            <li id="Delete">
                                                <span class="fa fa-edit"></span>
                                                <span style="font-size: 11px; font-family: Verdana">Delete</span>
                                            </li>
                                            <li id="View">
                                                <span class="fa fa-edit"></span>
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
        <div class="row" style="display: none" id="pnlSubmit">
            <div class="col-lg-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <div class="col-lg-8">
                            <h5 id="formAction">Survey Submit</h5>
                        </div>
                        <div class="col-lg-4 text-right">
                            <button id="btnBack" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                            <button style="display: none;" id="btnSave" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                        </div>
                    </div>
                    <div class="ibox-content" id="divContent">
                        <%--<script id="questionTmpl" type="text/x-jquery-tmpl">
                            <div class="form-group">
                                <label class="col-sm-12">${Question}</label>
                                <div class="col-sm-12" id="divQuestion${Sequence}">
                                </div>
                            </div>
                            <%--{{if QuestionTypeID == 1}}
                            <div class="form-group">
                                <label class="col-sm-12">${Question}</label>
                                <div class="col-sm-12" id="divQuestion${Sequence}">
                                </div>
                            </div>                         
                            {{/if}}
                            {{if QuestionTypeID == 2}}
                            <div class="form-group">
                                <label class="col-sm-12">${Question}</label>
                                <div class="col-sm-12">
                                    <select id="txtQuestion${Sequence}"></select>
                                </div>
                            </div>                         
                            {{/if}}
                            {{if QuestionTypeID == 3}}
                            <div class="form-group">
                                <label class="col-sm-12">${Question}</label>
                                <div class="col-sm-12" >                                    
                                </div>
                            </div>                         
                            {{/if}}-%>
                        </script>
                        <%--<table style="width: 100%;" class="table table-bordered">
                            <tbody id="questionContainer">
                            </tbody>
                        </table>-%>
                         <div id="questionContainer">
                        </div>--%>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
