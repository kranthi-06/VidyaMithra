import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_email_otp(to_email: str, otp_code: str):
    msg = MIMEMultipart()
    msg['From'] = settings.FROM_EMAIL
    msg['To'] = to_email
    msg['Subject'] = "Your Verification Code"

    body = f"""
    <html>
        <body>
            <h2>Your Verification Code</h2>
            <p>Your OTP is: <strong>{otp_code}</strong></p>
            <p>This code will expire in 5 minutes.</p>
            <p>If you did not request this code, please ignore this email.</p>
        </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.FROM_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
