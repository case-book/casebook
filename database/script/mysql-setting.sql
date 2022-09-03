use mysql;
create user bug_case_mgr@localhost identified by 'admin1234';
create user bug_case_app@localhost identified by 'admin1234';
create user 'bug_case_mgr'@'%' identified by 'admin1234';
create user 'bug_case_app'@'%' identified by 'admin1234';

create database bug_case default character set utf8 collate utf8_unicode_ci;
use bug_case;
show variables like 'char%';

alter user 'bug_case_mgr'@'localhost' identified with mysql_native_password by 'admin1234';
alter user 'bug_case_app'@'localhost' identified with mysql_native_password by 'admin1234';
alter user 'bug_case_mgr'@'%' identified with mysql_native_password by 'admin1234';
alter user 'bug_case_app'@'%' identified with mysql_native_password by 'admin1234';
alter user 'root'@'localhost' identified with mysql_native_password by 'admin1234';
grant all privileges on bug_case.* to bug_case_mgr@localhost;
grant all privileges on bug_case.* to bug_case_mgr@'%';
grant all privileges on bug_case.* to bug_case_app@localhost;
grant all privileges on bug_case.* to bug_case_app@'%';
flush privileges;

show grants for bug_case_mgr@localhost;
show grants for bug_case_app@localhost;
