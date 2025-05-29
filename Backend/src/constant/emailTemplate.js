export const Welcome_Email_Template = (username) => `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Meraki Interview Prep</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333;
      }
      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 30px auto;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        padding: 25px;
        border: 1px solid #ddd;
      }
      .header {
        background-color: #FF9324;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
        border-radius: 8px;
      }
      .highlight {
        color: #ffffff;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
        text-align: center;
        margin: 10px 0;
      }
      .footer {
        font-size: 12px;
        color: #777777;
        text-align: center;
        margin-top: 30px;
        border-top: 1px solid #ddd;
        padding-top: 15px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Welcome to <span class="highlight">Meraki</span>, ${username}!
      </div>
      <div class="content">
        <p>Hi <strong>${username}</strong>,</p>
        <p>
          Congratulations on taking the first step towards landing your dream job!
          You're now part of <strong>Meraki</strong>, your personal AI-powered interview coach.
        </p>
        <p>
          Get ready to tackle real interview questions, receive instant AI feedback,
          and track your progress — all tailored just for you.
        </p>
        <p>
          Let’s start prepping smart and leveling up 🚀
        </p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Meraki AI Interview Prep. All rights reserved.
      </div>
    </div>
  </body>
  </html>
`;
