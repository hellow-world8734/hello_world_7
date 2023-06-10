package entity;

import java.io.Serializable;

public class AVG implements Serializable {
    private float avg;
    private String msg;
    private String classname;

    public AVG() {
    }

    public AVG(float avg, String msg, String classname) {
        this.avg = avg;
        this.msg = msg;
        this.classname = classname;
    }

    public float getAvg() {
        return avg;
    }

    public void setAvg(float avg) {
        this.avg = avg;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getClassname() {
        return classname;
    }

    public void setClassname(String classname) {
        this.classname = classname;
    }
}
