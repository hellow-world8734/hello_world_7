package score.servlet;

import com.alibaba.fastjson.JSON;
import entity.AVG;
import entity.Operator;
import entity.Student;
import entity.Teacher;
import impl.StudentImpl;
import impl.TeacherImpl;
import util.MyUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/GetAvgServlet")
public class GetAvgServlet extends HttpServlet {
    public GetAvgServlet() {
        super();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("utf-8");
        resp.setContentType("text/json;utf-8");
        Operator operator = (Operator) req.getSession().getAttribute("log_operator");
        int ope_rol_id = operator.getRole().getId();
        TeacherImpl teacherImpl = new TeacherImpl();
        StudentImpl studentImpl = new StudentImpl();
        List<AVG> avgs = new ArrayList<>();
        if (ope_rol_id == 1){
            avgs = MyUtils.getAvg(ope_rol_id, null);
        }else if (ope_rol_id == 2){
            Teacher teacher = teacherImpl.query("ope_id", operator.getId() + "").get(0);
            avgs = MyUtils.getAvg(ope_rol_id, teacher.getName());
        }else if(ope_rol_id == 3){
            Student student = studentImpl.query("ope_id", operator.getId() + "").get(0);
            avgs = MyUtils.getAvg(ope_rol_id, String.valueOf(student.getId()));
        }
        PrintWriter printWriter = resp.getWriter();
        printWriter.write(JSON.toJSONString(avgs));
        printWriter.flush();
        printWriter.close();
    }
}
