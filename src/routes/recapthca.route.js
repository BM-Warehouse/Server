const express = require('express');
const RecaptchaService = require('@services/recaptcha.service');
const { ClientError } = require('@exceptions/error.excecptions');

const router = express.Router();

router.post('/verify', async (req, res) => {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: 'reCAPTCHA token is missing' });
  }

  try {
    const success = await RecaptchaService.verifyRecaptchaToken(recaptchaToken);
    if (success) {
      return res.status(200).json({ message: 'reCAPTCHA verification succeeded' });
    } else {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
