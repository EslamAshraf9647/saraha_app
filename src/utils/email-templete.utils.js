const emailTemplate = (username, ConfirmEmailLink) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Account</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 480px;
            margin: 30px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            border-top: 5px solid #007bff;
        }
        .logo {
            max-width: 120px;
            margin-bottom: 20px;
        }
        h2 {
            color: #333;
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        p {
            color: #555;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .otp-box {
            background:rgb(255, 0, 81);
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            padding: 15px 30px;
            display: inline-block;
            border-radius: 8px;
            letter-spacing: 4px;
            margin-top: 10px;
            box-shadow: 0 3px 10px rgba(0, 123, 255, 0.2);
        }
        .note {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
        .footer {
            font-size: 12px;
            color: #aaa;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Verify Your Account</h2>
        <p>Hello <strong>${username}</strong>, click the link below to verify your account:</p>
        <div class="otp-box"> <a href=" ${ConfirmEmailLink}"> verfiy your Email </a> </div>
        <p class="footer">If you did not request this, please ignore this email or <a href="#">contact support</a>.</p>
    </div>
</body>
</html>
`;

export default emailTemplate;