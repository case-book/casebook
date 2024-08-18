use mysql;
create user casebook_mgr@localhost identified by 'admin1234';
create user casebook_app@localhost identified by 'admin1234';
create user 'casebook_mgr'@'%' identified by 'admin1234';
create user 'casebook_app'@'%' identified by 'admin1234';

create database casebook default character set utf8 collate utf8_unicode_ci;
use casebook;
show variables like 'char%';

alter user 'casebook_mgr'@'localhost' identified with mysql_native_password by 'admin1234';
alter user 'casebook_app'@'localhost' identified with mysql_native_password by 'admin1234';
alter user 'casebook_mgr'@'%' identified with mysql_native_password by 'admin1234';
alter user 'casebook_app'@'%' identified with mysql_native_password by 'admin1234';
alter user 'root'@'localhost' identified with mysql_native_password by 'admin1234';
grant all privileges on casebook.* to casebook_mgr@localhost;
grant all privileges on casebook.* to casebook_mgr@'%';
grant all privileges on casebook.* to casebook_app@localhost;
grant all privileges on casebook.* to casebook_app@'%';
flush privileges;

show grants for casebook_mgr@localhost;
show grants for casebook_app@localhost;
