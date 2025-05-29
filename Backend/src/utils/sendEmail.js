import { Resend } from 'resend';
import { Welcome_Email_Template } from '../constant/emailTemplate.js';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendWelcomeEmail(mail, userName) {
  const html = Welcome_Email_Template(userName);
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ahmedanis4546@gmail.com',
      subject: `Welcome to Meraki, ${userName}! 🎯`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export { sendWelcomeEmail };