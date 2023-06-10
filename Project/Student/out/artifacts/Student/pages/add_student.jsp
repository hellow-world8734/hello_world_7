<%@ page contentType="text/html; charset=utf-8" language="java"
	import="java.sql.*" errorPage=""%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>regist page</title>
		<link href="../css/regist.css" rel="stylesheet" type="text/css" />
		<script language="javascript" type="text/javascript"
			src="../js/My97DatePicker/WdatePicker.js">
</script>
		<script src="../js/jquery-1.8.3.min.js">

</script>
		<script src="../js/search.js">
</script>
	</head>
<style>
	img{
		object-fit: cover;
	}
	td{
		padding: 5px 10px;
		text-align: center;
	}
	#msg-box{
		width: 650px;
		margin: 20px auto;
		text-align: start;
		text-indent: 32px;
	}
	em{
		display: block;
		font-style: normal;
	}
</style>
	<body>
		<center>

			<form action="/Student/AddStudentServlet"
				enctype="multipart/form-data" method="post">
				<c:if test="${sessionScope.message!=null}">
					<h3 id="msg-box"></h3>
					<script type="text/javascript">
						let msg = "${sessionScope.message }";
						let h3 = document.getElementById("msg-box");
						h3.innerHTML = msg;
					</script>
				</c:if>
				<c:remove var="message" scope="session" />
				<div class="window" align="left">

					<div class="tit">
						添加学生
					</div>
					<div class="main">
						<div align="left">
							学号：
							<input type="text" name="no" />
						</div>
						<div align="left">
							姓名：
							<input type="text" name="name" />
						</div>
						<div align="left">
							性别：
							<input style="width: 20px; height: 20px" name="sex" type="radio"
								value="male" checked="checked" />
							男 &nbsp;&nbsp;&nbsp;&nbsp;
							<input style="width: 20px; height: 20px;" name="sex" type="radio"
								value="female" />
							女
						</div>
						<div align="left">
							生日：
							<input type="text" name="birth" onClick="WdatePicker()" />
						</div>
						<div align="left">
							班级：
							<select name="cla_id">
								<c:forEach items="${sessionScope.list_classes}" var="cla">
									<option value="${cla.id}">
										${cla.name}
									</option>
								</c:forEach>
							</select>
						</div>
						<div align="left">
							账号：
							<input type="text" name="ope_name" />
						</div>
						<div align="left">
							密码：
							<input type="text" name="ope_pwd" />
						</div>
						<div align="left">
							<a>头像：</a>
							<input style="margin-top: 20px;" type="file" name="pic" />
							<br />
							<br />
							<img id="user-avatar-dom" src="../images/person.png" width="150" height="150"
								style="margin-left: 100px;" />
						</div>
						<br />
						<div align="right" style="text-align: start">
							<input type="submit" value="添加"
								style="width: 65px; height: 35px; line-height: 35px; overflow: hidden; text-align: center;margin-left: 300px;" />
						</div>
					</div>
				</div>
			</form>
			<div class="excel-form-box" style="width: 650px;margin: 30px auto;">
				<form id="excel-form" action="${pageContext.request.contextPath}/ExcelAddStudentServlet" method="post" style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;">
					<input id="excel-input" type="file" accept=".xls, .xlsx" onchange="excelChange(this)"/>
					<input id="value-input" type="text" readonly name="data" style="display: none;visibility: hidden;"/>
					<table id="data-show-table" style="margin: 10px 0;" cellspacing="0" cellpadding="10">

					</table>
					<button id="my-btn" type="button" onclick="mySubmit()">提交excel数据</button>
				</form>
			</div>
			<script type="text/javascript" src="../js/xlsx.core.min.js"></script>
			<script type="text/javascript">
				// 定义一些全局变量
				// 表单DOM元素
				let form = document.getElementById("excel-form");
				// 文件input DOM元素
				let excelInput = document.getElementById("excel-input");
				// 用来存储获取到的数据
				let valueDom = document.getElementById("value-input");
				// 表格，用来显示获取到的数据
				let tableShow = document.getElementById("data-show-table");
				// 表格的内容（动态生成）
				let htmlStr = "";
				// 获取到的数据
				let students = null;
				// 用户选择的文件
				let file = null;

				// 方法（函数）文件监听变更事件
				function excelChange(e){
					file = e.files[0];
					if (file!=undefined){
						let fileType = file.name.substring(file.name.lastIndexOf("."));
						if(fileType == ".xls" || fileType == ".xlsx"){
							let fileReader = new FileReader();
							// 开始读文件，ninary二进制读取，文件以二进制流形式传输
							fileReader.readAsBinaryString(file);
							// 监听load(加载、读取)
							fileReader.addEventListener("load", (fe)=>{
								try{
									// 获取到excel数据
									var data = fe.target.result;
									// 获取到工作表
									var workbook = XLSX.read(data, {
										type: "binary"
									});
									// 判断sheet表是否为空，undefined为空表，反之有数据
									var fromTo = "";
									// 遍历workbook;
									for(var sheet in workbook.Sheets){
										if (workbook.Sheets.hasOwnProperty(sheet)){
											fromTo = workbook.Sheets[sheet]["!ref"];
											if (fromTo!=undefined){
												students = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
												showExcelData(students);
											}
										}else {
											myClear("为获取到数据T_T");
										}
									}
								}catch (err){
									myClear("读取错误，请稍后重试T_T");
									console.error(err);
								}
							});
						}else {
							myClear("文件格式不支持，仅支持EXCEL工作表");
						}
					}else {
						myClear("用户已取消操作");
					}
				}
				/**
				 * 显示excel表格的数据
				 * 无返回值
				 * @param Array array 传入一个数组
				 */
				function showExcelData(array){
					let studentsJSON = JSON.stringify(array);
					valueDom.value = studentsJSON;
					htmlStr = "<tr><td>NO.</td><td>NAME</td><td>SEX</td><td>BIRTH</td><td>CLASS</td><td>ACCOUNT</td><td>PASSWORD</td></tr>";
					for(var i = 0; i < array.length; i++){
						let student = array[i];
						htmlStr += "<tr><td>"+student.stu_no+"</td><td>"+student.stu_name+"</td><td>"+student.stu_sex+"</td><td>"+student.stu_birth+"</td><td>"+student.stu_class+"</td><td>"+student.stu_account+"</td><td>"+student.stu_password+"</td></tr>";
					}
					tableShow.border = "1";
					tableShow.innerHTML = htmlStr;
				}

				// 提交
				function mySubmit(){
					if(valueDom.value.trim() != ""){
						form.submit();
					}else {
						alert("请选择excel工作表文件");
					}
				}

				// 当发生错误时，置空, tip是要提示的字符串内容
				function myClear(tip){
					file = null;
					students = null;
					excelInput.value = "";
					valueDom.value = "";
					htmlStr = "";
					tableShow.border = "0";
					tableShow.innerHTML = htmlStr;
					alert(tip);
				}
			</script>
		</center>
	</body>
</html>