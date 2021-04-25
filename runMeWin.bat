FOR /F "tokens=*" %%i IN ('cd') DO set CURRENT_PATH=%%i
set temp1=%CURRENT_PATH%\Music\Misc\*.mp3
set temp2=%CURRENT_PATH%\Music\Kanye\*.mp3
cd %CURRENT_PATH%\Music 
break>outputMisc.txt
FOR /F "tokens=*" %%G IN ('dir /b %temp1%') DO echo %%G >> outputMisc.txt
break>outputKanye.txt
FOR /F "tokens=*" %%G IN ('dir /b %temp2%') DO echo %%G >> outputKanye.txt
cd %CURRENT_PATH%
node bot.js >> logs.log 2>> error.log
rem node bot.js
pause 10