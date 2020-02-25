const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const recaptcha = new Recaptcha(process.env.RECAPCHA_SITE_KEY, process.env.RECAPCHA_SECRET_KEY);

module.exports = recaptcha;