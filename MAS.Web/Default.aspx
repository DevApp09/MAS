<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="MAS.Web.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <%--<link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <link href="css/plugins/summernote/summernote.css" rel="stylesheet">
    <link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>
    <script src="js/FormScripts/Question.js"></script>
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
    </style>--%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-10">
            <h2>Dashboard</h2>
            <ol class="breadcrumb">
                <li class="active">
                    <strong>Dashboard</strong>
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
                        <h5>Dashboard</h5>
                    </div>
                    <div class="ibox-content">
                        <%--content--%>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
