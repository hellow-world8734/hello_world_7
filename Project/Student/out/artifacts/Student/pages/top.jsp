<%@ page contentType="text/html; charset=utf-8" language="java"
	import="java.sql.*" errorPage=""%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>top page</title>
<link href="../css/top.css" rel="stylesheet" type="text/css" />
<script src="../js/jquery-1.8.3.min.js"></script>
<script src="../js/login.js"></script>
</head>

<body>
	<div class="main">
		<p>
			<img class="titleIMG" src="../images/Title.jpg" />
		</p>
		<div class="user" align="center">
			<table class="msg">
				<tr>
					<td ><a href="###">${sessionScope.log_operator.name}</a></td>
					<c:if test="${role == 1 }">
						<td width="30">|</td>
						<td ><a id="dou" href="###">删库跑路</a></td>
					</c:if>
					<c:if test="${role == 2 }">
						<td width="30">|</td>
						<td ><a href="/Student/InfoTeacherServlet" target="main">教师个人中心</a></td>
					</c:if>
					<c:if test="${role == 3 }">
						<td width="30">|</td>
						<td ><a href="/Student/InfoStudentServlet" target="main">学生个人中心</a></td>
					</c:if>
					<td width="30">|</td>
					<td ><a href="###" onclick="logout()">注销</a></td>
				</tr>
			</table>
		</div>
	</div>
</body>
</html>