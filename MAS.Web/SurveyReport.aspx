<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="SurveyReport.aspx.cs" Inherits="MAS.Web.SurveyReport" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="js/jquery.tmpl.min.js"></script>
    <script src="js/plugins/chartJs/Chart.min.js"></script>
    <script src="js/Util.js"></script>
    <script src="js/FormScripts/SurveyReport.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-10">
            <h2>Survey</h2>
            <ol class="breadcrumb">
                <li>App Configuration
                </li>
                <li class="active">
                    <strong>Survey Report</strong>
                </li>
            </ol>
        </div>
        <div class="col-lg-2">
        </div>
    </div>
    <div class="wrapper wrapper-content animated fadeInRight">
        <div id="pnlMain" class="row">
            <div class="col-lg-12">
                <div class="ibox float-e-margins" id="pnlSurveyStatus">
                    <div class="ibox-title">
                        <h5>Survey Status</h5>
                        <div class="ibox-tools">
                            <a class="collapse-link">
                                <i class="fa fa-chevron-up"></i>
                            </a>
                        </div>
                    </div>
                    <div class="ibox-content">
                        <div class="row">
                            <div class="col-lg-5">
                                <script id="surveyStatusTmpl" type="text/x-jquery-tmpl">
                                    <tr>
                                        <td>${EntityName}</td>
                                        <td class="text-right">${EntityCount}</td>
                                    </tr>
                                </script>
                                <table class="table table-bordered no-margins">
                                    <thead>
                                        <tr>
                                            <th class="text-center">Status</th>
                                            <th class="text-center">Count</th>
                                        </tr>
                                    </thead>
                                    <tbody id="surveyStatusContainer">
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-lg-1"></div>
                            <div class="col-lg-6">
                                <div class="ibox float-e-margins">
                                    <div>
                                        <div>
                                            <canvas id="surveyStatusChart"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="questionContainer"></div>
        <script id="questionTmpl" type="text/x-jquery-tmpl">
            <div id="pnlSRMain_${QuestionID}" class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins" id="diviboxSR_${QuestionID}">
                        <div class="ibox-title">
                            <h5>Question: ${QuestionName}</h5>
                            <div class="ibox-tools">
                                <a class="collapse-link">
                                    <i class="fa fa-chevron-up" id="btnQuestionSR_${QuestionID}" onclick="pnlQuestionSRShowHide(${QuestionID})"></i>
                                </a>
                            </div>
                        </div>
                        <div class="ibox-content" id="diviboxcontentSR_${QuestionID}">
                            <div class="row">
                                <div class="col-lg-5">                                
                                    <table class="table table-bordered no-margins">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Answer</th>
                                                <th class="text-center">Count</th>
                                            </tr>
                                        </thead>
                                        <tbody id="answerContainer_${QuestionID}">
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-lg-1"></div>
                                <div class="col-lg-6">
                                    <div class="ibox float-e-margins">
                                        <div>
                                            <div>
                                                <canvas id="answerChart_${QuestionID}"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </script>
        <script id="answerTmpl" type="text/x-jquery-tmpl">
            <tr>
                <td>${AnswerName}</td>
                <td class="text-right">${AnswerCount}</td>
            </tr>
        </script>

    </div>
</asp:Content>
