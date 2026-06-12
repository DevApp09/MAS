var sid = getParameterByName('sid');

$(document).ready(function () {
    getData();
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getData() {
    obj =
    {
        SurveyID: sid
    };

    showLoadingPopup();

    $.ajax({
        url: '\Service.aspx?rq=SurveyReportById',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(obj)
    }).done(function (sr) {
        if (sr.HasError == false) {
            var data = sr.Data;
            var obj = JSON.parse(data);
            surveyStatus(obj.NewDataSet.Table);
            surveyQuestion(obj.NewDataSet.Table1);
            surveyAnswer(obj.NewDataSet.Table1, obj.NewDataSet.Table2);
        } else {
            toastr["error"](sr.ErrorMessage);
        }
        closeLoadingPopup();
    }).fail(function () {
        closeLoadingPopup();
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

function surveyStatus(table) {
    var cnvsTmpl = '<canvas id="surveyStatusChart"></canvas>';
    $('#surveyStatusChart').parent('div').empty().append(cnvsTmpl);
    var chartLabel = [];
    var chartData = [];
    $("#surveyStatusTmpl").tmpl(table).appendTo($('#surveyStatusContainer').empty());
    $(table).each(function (index, data) {
        chartLabel.push(data.EntityName);
        chartData.push(data.EntityCount);
    });

    var ctx = document.getElementById("surveyStatusChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartLabel,
            datasets: [{
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132), 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 2,
                data: chartData
            }]
        },
        options: {
            events: false,
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset) {

                        for (var i = 0; i < dataset.data.length; i++) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                start_angle = model.startAngle,
                                end_angle = model.endAngle,
                                mid_angle = start_angle + (end_angle - start_angle) / 2;

                            var x = mid_radius * Math.cos(mid_angle);
                            var y = mid_radius * Math.sin(mid_angle);

                            ctx.fillStyle = '#000';
                            if (i == 3) { // Darker text color for lighter background
                                ctx.fillStyle = '#444';
                            }
                            var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                            ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                            // Display percent in another line, line break doesn't work for fillText
                            //ctx.fillText(percent, model.x + x, model.y + y + 15);
                        }
                    });
                }
            }
        }
    });
}

function surveyQuestion(table) {
    $("#questionTmpl").tmpl(table).appendTo($('#questionContainer').empty());
}

function surveyAnswer(tableQuestion, tableAnswer) {
    closeLoadingPopup();

    tableQuestion.forEach(function (a) {
        var dta = Enumerable.From(tableAnswer).Where(function (item) { return item.QuestionID == a.QuestionID; }).ToArray();
        $("#answerTmpl").tmpl(dta).appendTo($('#answerContainer_' + a.QuestionID).empty());
        answerChart(a.QuestionID, dta);
        $('#diviboxSR_' + a.QuestionID).addClass('border-bottom');
        $('#btnQuestionSR_' + a.QuestionID).removeClass('fa-chevron-up');
        $('#btnQuestionSR_' + a.QuestionID).addClass('fa-chevron-down');
        $('#diviboxcontentSR_' + a.QuestionID).hide();
    });
}

function answerChart(qid, table) {
    var chartid = 'answerChart_' + qid;
    var cnvsTmpl = '<canvas id="' + chartid + '"></canvas>';
    $('#' + chartid).parent('div').empty().append(cnvsTmpl);
    var anschartLabel = [];
    var anschartData = [];
    $(table).each(function (index, data) {
        anschartLabel.push(data.AnswerName);
        anschartData.push(data.AnswerCount);
    });

    var ctx = document.getElementById(chartid).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: anschartLabel,
            datasets: [{
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132), 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 2,
                data: anschartData
            }]
        },
        options: {
            events: false,
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    this.data.datasets.forEach(function (dataset) {

                        for (var i = 0; i < dataset.data.length; i++) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                start_angle = model.startAngle,
                                end_angle = model.endAngle,
                                mid_angle = start_angle + (end_angle - start_angle) / 2;

                            var x = mid_radius * Math.cos(mid_angle);
                            var y = mid_radius * Math.sin(mid_angle);

                            ctx.fillStyle = '#000';
                            if (i == 3) { // Darker text color for lighter background
                                ctx.fillStyle = '#444';
                            }
                            var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                            ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                            // Display percent in another line, line break doesn't work for fillText
                            //ctx.fillText(percent, model.x + x, model.y + y + 15);
                        }
                    });
                }
            }
        }
    });
}

function pnlQuestionSRShowHide(qid) {
    if ($('#diviboxcontentSR_' + qid).is(':visible')) {
        $('#diviboxSR_' + qid).addClass('border-bottom');
        $('#btnQuestionSR_' + qid).removeClass('fa-chevron-up');
        $('#btnQuestionSR_' + qid).addClass('fa-chevron-down');
        $('#diviboxcontentSR_' + qid).hide();
    }
    else {
        $('#diviboxSR_' + qid).removeClass('border-bottom');
        $('#btnQuestionSR_' + qid).addClass('fa-chevron-up');
        $('#btnQuestionSR_' + qid).removeClass('fa-chevron-down');
        $('#diviboxcontentSR_' + qid).show();
    }
}