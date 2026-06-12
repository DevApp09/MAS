var teacher;
var student;
var employee;

$(document).ready(function () {
    showLoadingPopup();
    var url = window.location.href;

    if (url.search("welcome") > 0) {
        //bindBranch();
        //$('#selectBranch').trigger('click');
    }
    else {
        GetReportData();
    }
});

function bindEmployeeChart() {
    /*
	Bug fixed
	it is required to destroy chart else it will fliker with new and old data.
	*/
    var cnvsTmpl = '<canvas id="EmployeeChart"></canvas>';
    $('#EmployeeChart').parent('div').empty().append(cnvsTmpl);

    var ctx = document.getElementById("EmployeeChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Male", "Female"],
            datasets: [{
                backgroundColor: [
                    "#95a5a6",
                    "#9b59b6"
                ],
                data: [employee.MaleCount, employee.FemaleCount]
            }]
        }
    });
}

function bindStudentChart() {
    /*
	Bug fixed
	it is required to destroy chart else it will fliker with new and old data.
	*/
    var cnvsTmpl = '<canvas id="StudentChart"></canvas>';
    $('#StudentChart').parent('div').empty().append(cnvsTmpl);

    var ctx = document.getElementById("StudentChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Male", "Female"],
            datasets: [{
                backgroundColor: [
                    "#3498db",
                    "#e74c3c"
                ],
                data: [student.MaleCount, student.FemaleCount]
            }]
        }
    });
}

function bindTeacherChart() {
    /*
	Bug fixed
	it is required to destroy chart else it will fliker with new and old data.
	*/
    var cnvsTmpl = '<canvas id="TeacherChart"></canvas>';
    $('#TeacherChart').parent('div').empty().append(cnvsTmpl);

    var ctx = document.getElementById("TeacherChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Male", "Female"],
            datasets: [{
                backgroundColor: [
                    "#2ecc71",
                    "#3498db"
                ],
                data: [teacher.MaleCount, teacher.FemaleCount]
            }]
        }
    });
    ctx.up
}

function GetReportData() {
    
    $.ajax({
        url: '\Service.aspx?rq=GetAllChartData',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({ comapnyId: $("#ddlcompany").val(), branchId: $("#ddlDefaultBranch").val()}),
    }).done(function (sr) {
        if (sr.HasError == false) {
            sr.Data[3].MaleCount = null;
            sr.Data[3].FemaleCount = null;
            $("#statisticsTmpl").tmpl(sr.Data).appendTo($('#statisticsContainer').empty());

            employee = sr.Data[0];
            student = sr.Data[1];
            teacher = sr.Data[2];

            $('#totalEmployee').text(employee.TotalCount);
            $('#totalStudent').text(student.TotalCount);
            $('#totalTeacher').text(teacher.TotalCount);

            bindEmployeeChart();
            bindStudentChart();
            bindTeacherChart();

            $('.canvasjs-chart-credit').hide();

        } else {
            toastr["error"](sr.ErrorMessage);
        }
    }).fail(function () {
        toastr["error"]('An unexpected error has occured please try later or contact your administrator.');
    });
}

$(document).ajaxStop(function () {
    closeLoadingPopup();
});