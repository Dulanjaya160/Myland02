@echo off
echo Testing Add Ingredient API...
echo.

echo Sending test ingredient data to API...
echo.

curl -X POST http://127.0.0.1:8080/api/myland/ingredient ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Ingredient\",\"type\":\"KG\",\"quantity\":10.0,\"pricePerUnit\":5.0}"

echo.
echo.
echo Check above for response.
echo If you see the ingredient data returned, the API works.
echo If you see an error, check the backend log.
echo.
pause
