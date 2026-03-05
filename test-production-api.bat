@echo off
echo Testing Production API...
echo.

echo Making request to: http://127.0.0.1:8080/api/myland/production
echo.

curl -X GET http://127.0.0.1:8080/api/myland/production

echo.
echo.
echo If you see JSON data above, the API is working correctly.
echo If you see an error or empty array [], there's no data in the database.
echo.
pause
