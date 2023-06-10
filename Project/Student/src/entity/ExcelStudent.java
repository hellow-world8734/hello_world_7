package entity;

import java.util.Date;

public class ExcelStudent {
    private String stu_no;
    private String stu_name;
    private String stu_sex;
    private Date stu_birth;
    private String stu_class;
    private String stu_account;
    private String stu_password;

    public ExcelStudent() {

    }

    public ExcelStudent(String stu_no, String stu_name, String stu_sex, Date stu_birth, String stu_class, String stu_account, String stu_password) {
        this.stu_no = stu_no;
        this.stu_name = stu_name;
        this.stu_sex = stu_sex;
        this.stu_birth = stu_birth;
        this.stu_class = stu_class;
        this.stu_account = stu_account;
        this.stu_password = stu_password;
    }

    public String getStu_no() {
        return stu_no;
    }

    public void setStu_no(String stu_no) {
        this.stu_no = stu_no;
    }

    public String getStu_name() {
        return stu_name;
    }

    public void setStu_name(String stu_name) {
        this.stu_name = stu_name;
    }

    public String getStu_sex() {
        return stu_sex;
    }

    public void setStu_sex(String stu_sex) {
        this.stu_sex = stu_sex;
    }

    public Date getStu_birth() {
        return stu_birth;
    }

    public void setStu_birth(Date stu_birth) {
        this.stu_birth = stu_birth;
    }

    public String getStu_class() {
        return stu_class;
    }

    public void setStu_class(String stu_class) {
        this.stu_class = stu_class;
    }

    public String getStu_account() {
        return stu_account;
    }

    public void setStu_account(String stu_account) {
        this.stu_account = stu_account;
    }

    public String getStu_password() {
        return stu_password;
    }

    public void setStu_password(String stu_password) {
        this.stu_password = stu_password;
    }
}
