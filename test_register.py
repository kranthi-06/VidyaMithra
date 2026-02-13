import requests

url = "http://localhost:8000/api/v1/users/"
data = {
    "email": "test_user_2@example.com",
    "password": "SecurePassword123!",
    "full_name": "Test User 2"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
