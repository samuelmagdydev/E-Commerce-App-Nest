import { EventEmitter } from 'node:events';
import Mail from 'nodemailer/lib/mailer';
import { verifyTemplateEmail } from './verify.template.email';
import { sendEmail } from './send.email';

export interface IEmail extends Mail.Options {
  otp: string;
}

export const emailEvent = new EventEmitter();

emailEvent.on('confirmEmail', async (data: IEmail) => {
  try {
    data.subject = 'Confirm your email';
    data.html = verifyTemplateEmail(data.otp, 'Email Confirmation');
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail To  Send Email`, error);
  }
});



emailEvent.on('forgetPassword', async (data: IEmail) => {
  try {
    data.subject = 'Reset your password';
    data.html = verifyTemplateEmail(data.otp, 'Reset Password Code');
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail To  Send Email`, error);
  }
});


