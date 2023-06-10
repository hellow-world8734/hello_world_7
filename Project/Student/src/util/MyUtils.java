package util;

import entity.AVG;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class MyUtils {
    // 获取平均分数信息
    public static List<AVG> getAvg(int role, String value){
        List<AVG> avgs = null;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DB.getConn();
            String sql = "";
            if (role == 1){//管理员
                sql = "select round(avg(score.sco_count), 2) as avg, `subject`.sub_name as msg, classes.cla_name as classname from score, `subject`, classes, teacher where `subject`.sub_id = score.sub_id and classes.cla_id = score.cla_id and classes.cla_tec = teacher.tec_name GROUP BY score.sub_id";
                preparedStatement = connection.prepareStatement(sql);
            }else if(role == 2){//老师
                sql = "select round(avg(score.sco_count), 2) as avg, `subject`.sub_name as msg, classes.cla_name as classname from score, `subject`, classes, teacher where `subject`.sub_id = score.sub_id and classes.cla_id = score.cla_id and classes.cla_tec = ? and classes.cla_tec = teacher.tec_name GROUP BY score.sub_id";
                preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, value);
            }else if(role == 3){//学生
                sql = "select round(avg(score.sco_count), 2) as avg, `student`.stu_name as msg, classes.cla_name as classname from score, `subject`, classes, student where `subject`.sub_id = score.sub_id and classes.cla_id = score.cla_id and score.stu_id = ? and score.stu_id = student.stu_id;";
                preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1, value);
            }

            resultSet = preparedStatement.executeQuery();
            avgs = new ArrayList<>();
            while (resultSet.next()){
                float avg = resultSet.getFloat("avg");
                String msg = resultSet.getString("msg");
                String classname = resultSet.getString("classname");
                AVG avgObj = new AVG(avg, msg, classname);
                avgs.add(avgObj);
            }

            return avgs;
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DB.close(connection, preparedStatement, resultSet);
        }

        return null;
    }
}
