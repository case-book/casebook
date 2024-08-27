start /B java -jar -Duser.timezone=GMT -Dfile.encoding=utf-8 -Djava.net.preferIPv4Stack=true -Dapp.name=casebook -Dspring.profiles.active=default,production -Dspring.config.additional-location=./conf/application.properties -Dlog.dir=./logs ./bin/__fileName__.jar

