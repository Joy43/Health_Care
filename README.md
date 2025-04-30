# -----------------------------------------
# App Environment Configuration
# -----------------------------------------
NODE_ENV='development'

# -----------------------------------------
# Database Configuration (PostgreSQL)
# -----------------------------------------
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/health_care?schema=joytest"

# -----------------------------------------
# JWT Authentication Configuration
# -----------------------------------------
JWT_SECRET=7f3d2b9c0a494fcdb1dbb03b04940419e6431703fa5f7042305497057bc3e4ac
EXPIRES_IN=15d

# -----------------------------------------
# JWT Refresh Token Configuration
# -----------------------------------------
REFRESH_TOKEN_SECRET=91b4bb99b4d3a0b0e50d9081fa871cc0bc1dcb372c03af4733134baba6d6fc74f8ecb208d49bd02f52fd799b1c91e0a9a0b88add4002bdcd13a85a76319818ed
REFRESH_TOKEN_EXPIRES_IN=6h

# -----------------------------------------
# Password Reset Configuration
# -----------------------------------------
RESET_PASS_TOKEN="123ER556656565777657"
RESET_PASS_TOKEN_EXPIRES_IN="5m"
RESET_PASS_LINK=http://localhost:5000/reset-password

# -----------------------------------------
# Email/SMTP Configuration
# -----------------------------------------
EMAIL=ssjoy370@gmail.com
app_pass=sqyi bgmh ckam oxis
SMTP_PORT=587
