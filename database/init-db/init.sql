CREATE DATABASE  IF NOT EXISTS casebook default character set utf8 collate utf8_unicode_ci;
USE casebook;

CREATE USER IF NOT EXISTS casebook_app@localhost IDENTIFIED BY 'admin1234';
CREATE USER IF NOT EXISTS 'casebook_app'@'%' IDENTIFIED BY 'admin1234';

alter user 'casebook_app'@'localhost' identified with mysql_native_password by 'admin1234';
alter user 'casebook_app'@'%' identified with mysql_native_password by 'admin1234';

grant all privileges on casebook.* to casebook_app@localhost;
grant all privileges on casebook.* to casebook_app@'%';

flush privileges;