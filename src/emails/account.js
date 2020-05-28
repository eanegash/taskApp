require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.DB_SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '<CUSTOM EMAIL DOMAIN>',
        subject: 'Thanks for joining.',
        text: `Welcome to the app, ${name}!.`
    });
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '<CUSTOM EMAIL DOMAIN>',
        subject: 'Account has been deleted.',
        text: `Goodbye, ${name}. Sorry to see you go! Hope to see you back sometime soon.`
    });
}

//ES6 Shortand sendWelcomeEmail: sendWelcomeEmail -> sendWelcomeEmail
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

