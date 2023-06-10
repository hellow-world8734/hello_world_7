// 全局变量，总页数，当前页数
var countPages = 1;
var currentPage = 1;
var roleId;
var canvas = null;
var ctx = null;
var cwidth = 800;
var cheight = 300;
var cpadding = 30;
var data = null;

function getAvg(roleId){
	var url = "/Student/GetAvgServlet";
	$.ajax( {
		type : "get",
		url : url,
		async : true,
		dataType : "json",
		success : function(rs) {
			let table = document.getElementById("avg-table");
			table.innerHTML = "";
			let str = "";
			if(roleId == 3) {
				str = "<tr><td>平均分</td><td>姓名</td><td>班级</td></tr>";
			}else {
				str = "<tr><td>平均分</td><td>课程</td><td>班级</td></tr>";
			}
			for(let i = 0; i < rs.length; i++){
				str += "<tr><td>"+rs[i].avg+"</td><td>"+rs[i].msg+"</td><td>"+rs[i].classname+"</td></tr>";
			}
			table.innerHTML = str;
		}
	});
}

function initCanvas(){
	if (canvas != null){
		canvas.width = cwidth;
		canvas.height = cheight;
		ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, cwidth, cheight);
		ctx.moveTo(cpadding, cheight - cpadding);
		ctx.lineTo(cwidth, cheight - cpadding);
		ctx.lineTo(cwidth - 10, cheight - cpadding - 10);
		ctx.moveTo(cwidth, cheight - cpadding);
		ctx.lineTo(cwidth - 10, cheight - cpadding + 10);
		let str = "学号";
		let size = 12;
		ctx.font = size + "px 新宋体";

		ctx.fillText(str, cwidth - size*str.length, cheight - cpadding + 25);

		ctx.moveTo(cpadding, cheight - cpadding);
		ctx.lineTo(cpadding, cpadding);
		ctx.lineTo(cpadding - 10, cpadding + 10);
		ctx.moveTo(cpadding, cpadding);
		ctx.lineTo(cpadding + 10, cpadding + 10);

		str = "分数";
		ctx.fillText(str, cpadding + 15, cpadding);

		str = "0";
		ctx.fillText(str, cpadding - size*str.length, cheight - cpadding + size*str.length);

		// 可以用for循环来处理，数量少我就直接写了
		ctx.moveTo(cpadding, cheight - cpadding - 40*1);
		ctx.lineTo(cpadding - 10, cheight - cpadding - 40*1);
		str = "20";
		ctx.fillText(str, cpadding - size*str.length, cheight - cpadding - 40*1 + size/2);

		ctx.moveTo(cpadding, cheight - cpadding - 40*2);
		ctx.lineTo(cpadding - 10, cheight - cpadding - 40*2);
		str = "40";
		ctx.fillText(str, cpadding - size*str.length, cheight - cpadding - 40*2 + size/2);

		ctx.moveTo(cpadding, cheight - cpadding - 40*3);
		ctx.lineTo(cpadding - 10, cheight - cpadding - 40*3);
		str = "60";
		ctx.fillText(str, cpadding - size*str.length, cheight - cpadding - 40*3 + size/2);

		ctx.moveTo(cpadding, cheight - cpadding - 40*4);
		ctx.lineTo(cpadding - 10, cheight - cpadding - 40*4);
		str = "80";
		ctx.fillText(str, cpadding - size*str.length, cheight - cpadding - 40*4 + size/2);

		ctx.moveTo(cpadding, cheight - cpadding - 40*5);
		ctx.lineTo(cpadding - 10, cheight - cpadding - 40*5);
		str = "100";
		ctx.fillText(str, cpadding - size*str.length/2 - 10, cheight - cpadding - 40*5 + size/2);

		ctx.strokeStyle = "black";
		ctx.lineWidth = "1";
		ctx.stroke();
		ctx.closePath();
	}
}

/**
 * 根据当前页数据绘制柱状统计图，如果想要多处复用，可以把canvas作为形参分装起来，
 * @param data {Array}
 */
function draw(data){
	// 间距,可自行调整
	let spacing = (canvas.width - cpadding) / data.length / 3 * 2.8;
	// 比例,40是分数的间隔距离=(canvas.height - 2*cpadding)/(100/20 + 1),20是分段，每20分为一段
	let proportion = (canvas.height - 2*cpadding - 40)/100;
	for(let i = 0; i < data.length; i++){
		// 学号
		let no = data[i].student.no;
		// 学科
		let subject = data[i].subject.name;
		// 总分数
		let score = data[i].count;
		// 绘制横坐标的值（学号+科目）
		let tempSpacing = spacing * i + spacing;
		// 取出上一次绘制
		ctx.restore();
		// 开始绘制
		ctx.beginPath();
		ctx.textAlign = "center";
		ctx.textBaseline = "center";
		ctx.fillStyle = "#000";
		ctx.fillText(no, tempSpacing, canvas.height - cpadding + 25);
		// 柱状的宽度
		let w = 20;
		// 柱状的高度
		let h = score*proportion;
		if(h <= 3){
			h = 3;
		}
		// 根据分数和比例计算y坐标
		let y = (proportion*100) + cpadding + 40 - h;
		// 绘制柱状图
		let myFillStyle = "";
		if(h >= 90*proportion){
			ctx.fillStyle = "green"; // 90 - 100
		}else if(h >= 80*proportion) {
			ctx.fillStyle = "#0094FF"; // 80 - 90
		}else if(h >= 60*proportion){
			ctx.fillStyle = "orange"; // 60 - 80
		}else {
			ctx.fillStyle = "red"; // 不及格
		}
		myFillStyle = ctx.fillStyle;
		ctx.fillRect(tempSpacing - w/2, y, w, h);
		// 绘制柱状图顶部对应的学科和分数
		ctx.fillStyle = "#663333";
		ctx.fillText(subject, tempSpacing, y - 5);
		ctx.fillStyle = myFillStyle;
		ctx.fillText(score, tempSpacing, y - 20);
		// 保存当前绘制状态
		ctx.save();
	}
}

// AJAX异步查询成绩
$(function() {
	$("#search_score").click(
			function() {
				canvas = document.getElementById("pillar-canvas");
				if ($("#search_type").val() != "stu_all"
						&& $.trim($("#value").val()) == "")
					alert("请输入关键字。");
				else {
					// 获取角色ID
					roleId = getRoleId();
					getAvg(roleId);
					// 查询总页数并赋值到全局变量中
					countPages = getCountPage();
					// 默认查询第一页数据
					showData(currentPage);
					// 根据当前页数构建分页按钮
					showPage(currentPage);
				}
			});
});

// 整体调用函数
function show(page) {
	showData(page);
	showPage(page);
}

// 根据条件查询数据，并显示分页查询数据
function showData(page) {
	var url = "";
	url += "/Student/SearchScoreServlet?search_type=" + $("#search_type").val();
	url += "&value=" + encodeURI(encodeURI($("#value").val())) + "&page="
			+ page;
	$.post(url, null, function(rs) {
		data = rs;
		initCanvas();
		draw(data);
		$("#table>tbody>tr").not(":first").remove();
		var str = "";
		for ( var i = 0; i < rs.length; i++) {
			str = "<tr class='change' align='center'>";
			str += "<td>" + (i + 1) + "</td>";
			str += "<td>" + rs[i].student.no + "</td>";
			str += "<td>" + rs[i].student.name + "</td>";
			str += "<td>" + rs[i].subject.name + "</td>";
			str += "<td>" + rs[i].daily + "</td>";
			str += "<td>" + rs[i].exam + "</td>";
			str += "<td>" + rs[i].count + "</td>";
			if (roleId == 2)
				str += "<td><a href='/Student/EditScoreServlet?sco_id="
						+ rs[i].id + "'>编辑</a></td>";
			else
				str += "<td>&nbsp;/ </td>";
			str += "</tr>";
			$("#table").append(str);
		}
	}, "json");
}

// 查询总页数,只返回一个总页数
function getCountPage() {
	var url = "", rt = "";
	url += "/Student/GetScoreCountPageServlet?search_type="
			+ $("#search_type").val();
	url += "&value=" + encodeURI(encodeURI($("#value").val()));
	$.ajax( {
		type : "post",
		url : url,
		async : false, // 设置成同步，不然回调函数无法按正确顺序执行
		dataType : "text",
		success : function(rs) {
			rt = rs;
		}
	});
	return rt;
}

// 构建分页按钮链接组件
function showPage(page) {
	$("#center>p,#center>br").remove();
	var str = "<br/><p>";

	if (page <= 1)
		str += "<a class='a_3'>上一页</a>";
	else
		str += "<a class='a_3' href='###' onclick='javascript:show("
				+ (page - 1) + ")'>上一页</a>";

	for ( var i = 1; i <= countPages; i++) {
		if (i == page)
			str += "<a class='a_4 select'>" + i + "</a>";
		else
			str += "<a class='a_4' href='###' onclick='javascript:show(" + i
					+ ")'>" + i + "</a>";
	}

	if (page >= countPages)
		str += "<a class='a_3'>下一页</a>";
	else
		str += "<a class='a_3' href='###' onclick='javascript:show("
				+ (page + 1) + ")'>下一页</a>";

	$("#center").append(str);
}

// 获取当前登录的用户的角色ID，用来判断是否提供修改链接
function getRoleId() {
	var rol_id;
	var url = "/Student/LoginServlet?type=get_rol_id";
	$.ajax( {
		type : "post",
		url : url,
		async : false,
		dataType : "text",
		success : function(rs) {
			rol_id = rs;
		}
	});
	return rol_id;
}
