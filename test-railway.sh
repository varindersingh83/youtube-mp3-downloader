#!/bin/bash

# Test script for Railway deployment
# Replace YOUR_RAILWAY_URL with your actual Railway URL

RAILWAY_URL="YOUR_RAILWAY_URL"  # Replace this with your Railway URL

echo "🚂 Testing Railway Deployment..."
echo "URL: $RAILWAY_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
curl -s "$RAILWAY_URL/health" | jq .
echo ""

# Test 2: API Endpoint
echo "2️⃣ Testing API Endpoint..."
curl -X POST "$RAILWAY_URL/api/download" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}' \
  -s | jq .
echo ""

# Test 3: Frontend (if you deploy frontend too)
echo "3️⃣ Testing Frontend..."
curl -s "$RAILWAY_URL" | head -5
echo ""

echo "✅ Testing complete!"
echo "🎉 Your app should be working on Railway!" 