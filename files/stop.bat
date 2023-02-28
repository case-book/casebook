@ECHO OFF
IF EXIST "application.pid" (
  SET /P PID= < application.pid
  taskkill /pid %PID% /f
) ELSE (
  ECHO "CANNOT FIND PID FILE"
)
