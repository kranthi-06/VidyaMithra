# Authentication System Implementation

This project now uses a custom Email + OTP verification system, replacing Supabase Auth.

## Features
- **Signup**: Creates a user with `is_verified = False`.
- **OTP Generation**: secure 6-digit code, valid for 5 minutes, 60s resend cooldown.
- **OTP Verification**: Verifies code, marks user as `is_verified = True`.
- **Login Block**: Users cannot log in until verified.

## Configuration
You **MUST** update `backend/.env` (or `app/core/config.py`) with your SMTP credentials for emails to work.

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=your-email@gmail.com
```

> **Note**: For Gmail, you must generate an "App Password" from your Google Account Security settings. Do not use your plain password.

## Testing
A test script `test_verification_flow.py` is provided in the root directory.

1. Start the backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. Run the test script in a new terminal:
   ```bash
   python test_verification_flow.py
   ```

3. The backend logs will show the OTP (search for "DEBUG: OTP") even if email sending fails, allowing you to test the flow without valid SMTP credentials.

## API Endpoints
- `POST /api/v1/signup`: Register
- `POST /api/v1/send-otp`: Request OTP
- `POST /api/v1/verify-otp`: Verify OTP
- `POST /api/v1/login/access-token`: Login (requires verification)
