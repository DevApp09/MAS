<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ManageSurvey.aspx.cs" Inherits="MAS.Web.Survey" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="css/plugins/select2/select2.min.css" rel="stylesheet" />
    <script src="js/plugins/jqGrid/i18n/grid.locale-en.js"></script>
    <script src="js/plugins/jqGrid/jquery.jqGrid.min.js"></script>
    <script src="js/Plugins/ContextMenu/jquery.contextmenu.r2.js"></script>
    <script src="js/Util.js"></script>
    <%--<script src="js/FormScripts/Survey.js"></script>--%>
    <script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
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

    <div id="app">
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
            <div class="row" id="pnlAdd">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <div class="col-lg-8">
                                <h5 id="formAction">Add Survey</h5>
                            </div>
                            <div class="col-lg-4 text-right">
                                <button id="btnBack" type="button" class="btn btn-warning pnl-btn"><i class="fa fa-arrow-left button-icon-padding"></i>Back</button>
                                <button id="btnSave" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save</button>
                                <button id="btnSaveAndClose" type="button" class="btn btn-primary pnl-btn"><i class="fa fa-save button-icon-padding"></i>Save and Close</button>
                            </div>
                        </div>
                        <div class="ibox-content">
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
                            <button type="button" class="btn btn-primary" data-toggle="modal" id="btnAddQuestion">Add Question</button>
                            <div id="questionContainer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <script>
        // Define Component 1: GreetingComponent
        const GreetingComponent = {
            props: ['name'], // Accepts a prop named "name"
            template: `<p>Hello, {{ name }}! Welcome to Vue.js Components.</p>`
        };

        // Define Component 2: CounterComponent
        const CounterComponent = {
            data() {
                return { count: 0 };
            },
            template: `
                <div>
                    <p>Current Count: {{ count }}</p>
                    <button @click="count++">Increment</button>
                </div>
            `
        };

        // Create Vue App and Register Components
        const app = Vue.createApp({
            components: {
                'greeting-component': GreetingComponent,
                'counter-component': CounterComponent
            }
        });

        // Mount the Vue App
        app.mount('#app');
    </script>


</asp:Content>
