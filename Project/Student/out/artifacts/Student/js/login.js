function login()
{
	var url = "/Student/LoginServlet?type=login&ope_name=";
	url += $("#ope_name").val() + "&ope_pwd=" + $("#ope_pwd").val();
	$.post(url, null, function(rs)
	{
		if (rs == "success")
			window.open("/Student/pages/index.jsp", "_self");
		else
			alert(rs);
	});
}

function logout()
{
	$.post("/Student/LoginServlet?type=logout");
	alert("注销成功！");
	window.parent.location.reload();
}

document.onkeydown = function(event)
{
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e && e.keyCode == 13)
		login();
};

$(function()
{
	$("#ope_name").focus();
	$("#dou").click(function()
	{
		alert("这种行为是犯法的噢,耗子为汁^_^");
	});
});