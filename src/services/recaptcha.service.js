const { InternalServerError } = require('@exceptions/error.excecptions');

const secret = process.env.RECAPTCHA_SECRET_KEY;

class RecaptchaService {
  static async verifyRecaptchaToken(recaptchaToken) {
    try {
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`;
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();

      if (!data.success) {
        throw new Error('reCAPTCHA verification failed');
      }

      return data.success;
    } catch (error) {
      console.error('Error verifying reCAPTCHA', error);
      throw new InternalServerError(
        'reCAPTCHA verification failed',
        `An error occurred while verifying reCAPTCHA: ${error.message}`,
      );
    }
  }
}

module.exports = RecaptchaService;
