#!/bin/bash
echo "Testing API..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3001/api/auth/me
echo "Testing login endpoint..."
curl -s -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}' | head -c 200
echo ""
echo "Checking if server is listening on port 3001..."
netstat -tuln | grep 3001 || echo "Port 3001 not listening"
