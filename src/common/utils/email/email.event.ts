import { EventEmitter } from 'node:events';
import Mail from 'nodemailer/lib/mailer';
import { verifyTemplateEmail } from './verify.template.email';
import { sendEmail } from './send.email';
import { OtpEnum } from 'src/common/enums';

export interface IEmail extends Mail.Options {
  otp: string;
}

export const emailEvent = new EventEmitter();

emailEvent.on(OtpEnum.CONFIRM_EMAIL, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.CONFIRM_EMAIL;
    data.html = verifyTemplateEmail(data.otp, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail To  Send Email`, error);
  }
});



emailEvent.on(OtpEnum.RESET_PASSWORD, async (data: IEmail) => {
  try {
    data.subject = OtpEnum.RESET_PASSWORD;
    data.html = verifyTemplateEmail(data.otp, data.subject);
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail To  Send Email`, error);
  }
});


