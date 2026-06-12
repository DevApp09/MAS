<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="MAS.Web.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Monitoring and Accountability System (MAS) | Login</title>
    <link href="css/bootstrap.min.css" rel="stylesheet" />
    <link href="font-awesome/css/font-awesome.css" rel="stylesheet" />
	<link href="css/plugins/toastr/toastr.min.css" rel="stylesheet" />
    <link href="css/animate.css" rel="stylesheet" />
    <link href="css/style.css" rel="stylesheet" />
    <link href="css/customstyle.css" rel="stylesheet" />
</head>
<body class="gray-bg">
    <%--Loading panel HTML start--%>
    <div class="app-modal" style="display: none;">
        <div class="app-center">
            <div class="sk-spinner sk-spinner-wave">
                <div class="sk-rect1"></div>
                <div class="sk-rect2"></div>
                <div class="sk-rect3"></div>
                <div class="sk-rect4"></div>
                <div class="sk-rect5"></div>
            </div>
            Please wait while system is processing your request ...
        </div>
    </div>
    <form id="form1" runat="server">
    <div class="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 class="logo-name" style="font-size: 125px !important;">MAS</h1>
            </div>
            <h3>Monitoring and Accountability System (MAS)</h3>
            <p>Login in. To see it in action.</p>
            <%--<form class="m-t" role="form" action="index.html">--%>
                <div class="form-group">
                    <input id="txtLogin" type="text" name="Login" class="form-control" maxlength="50" placeholder="Username" />
                </div>
                <div class="form-group">
                    <input id="txtPassword" type="password" name="Password" class="form-control" maxlength="30" placeholder="Password" />
                </div>
                <button id="btnLogin" type="button" class="btn btn-primary block full-width m-b">Login</button>

                <%--<a href="#"><small>Forgot password?</small></a>
                <p class="text-muted text-center"><small>Do not have an account?</small></p>
                <a class="btn btn-sm btn-white btn-block" href="register.html">Create an account</a>--%>
            <%--</form>--%>
            <%--<p class="m-t"> <small>Inspinia we app framework base on Bootstrap 3 &copy; 2014</small> </p>--%>
        </div>
    </div>

    <!-- Mainly scripts -->
    <script src="js/jquery-3.1.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
	<script src="js/plugins/toastr/toastr.min.js"></script>
	<script src="js/FormScripts/JQueryExtension.js"></script>
    <script src="js/Util.js"></script>
    <script src="js/FormScripts/Login.js"></script>
    </form>
</body>
</html>
