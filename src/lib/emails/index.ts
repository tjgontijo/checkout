import { sendEmail } from './services/email.service';

export async function sendVerificationEmail(email: string, token: string) {
  return sendEmail({
    to: email,
    token,
    type: 'verification',
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  return sendEmail({
    to: email,
    token,
    type: 'reset-password',
  });
}
