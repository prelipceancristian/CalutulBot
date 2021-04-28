echo off
cd Tests
FOR /F "tokens=*" %%i IN ('dir /b') DO node %%i
cd ..