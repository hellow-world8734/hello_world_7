package student.servlet;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import entity.*;
import impl.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/ExcelAddStudentServlet")
public class ExcelAddStudentServlet extends HttpServlet {
    public ExcelAddStudentServlet() {
        super();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("utf-8");

        String data = req.getParameter("data");

        if (!"".equals(data)){
            OperatorImpl operatorImpl = new OperatorImpl();
            RoleImpl roleImpl = new RoleImpl();
            ClassesImpl classesImpl = new ClassesImpl();
            StudentImpl studentImpl = new StudentImpl();
            SubjectImpl subjectImpl = new SubjectImpl();
            ScoreImpl scoreImpl = new ScoreImpl();
            String msg = "";
            JSONArray jsonArray = JSON.parseArray(data);
            for (Object o : jsonArray){
                try {
                    ExcelStudent excelStudent = JSON.toJavaObject(JSON.parseObject(o.toString()), ExcelStudent.class);
                    System.out.println(JSON.toJSONString(excelStudent));
                    Student student = new Student();
                    Operator operator = new Operator();
                    operator.setName(excelStudent.getStu_account());
                    operator.setPwd(excelStudent.getStu_password());
                    operator.setRole(roleImpl.query("rol_id", "3").get(0));
                    student.setOperator(operator);
                    student.setBirth(excelStudent.getStu_birth());
                    student.setNo(excelStudent.getStu_no());
                    student.setSex(excelStudent.getStu_sex());
                    student.setName(excelStudent.getStu_name());
                    List<Classes> classes = classesImpl.query("cla_name", excelStudent.getStu_class());
                    // 班级存在才进行以下操作
                    if (classes != null && classes.size() > 0){
                        operator = operatorImpl.add(operator);
                        student.setOperator(operator);
                        student.setClasses(classes.get(0));
                        int i = studentImpl.excelAdd(student);
                        if (i == 1) {
                            msg += "<em style='color: green;'>添加学生"+student.getName()+"成功！</em>";
                        } else {
                            msg += "<em style='color: red;'>添加学生"+student.getName()+"失败！信息冲突或已存在</em>";
                        }
                    }else {
                        msg += "<em style='color:red;'>班级"+excelStudent.getStu_class()+"不存在，学生"+excelStudent.getStu_name()+"添加失败！</em>";
                    }

                    req.getSession().setAttribute("message", msg);

                    // 为学生添加课程成绩记录信息
                    List<Subject> list_subject = subjectImpl.query("stu_id", student
                            .getId()
                            + "");
                    List<Cla2Sub> list_cla2sub = new Cla2SubImpl().query("stu_id",
                            student.getId() + "");
                    for (int x = 0; x < list_subject.size(); x++) {
                        Score score = new Score();
                        score.setStudent(student);
                        score.setSubject(list_subject.get(x));
                        score.setCla2sub(list_cla2sub.get(x));
                        scoreImpl.add(score);
                    }

                } catch (Exception e){
                    req.getSession().setAttribute("message", "<em style='color:red;'>服务器错误！</em>");
                    e.printStackTrace();
                }
            }

        }
        resp.sendRedirect("pages/add_student.jsp");
    }
}
