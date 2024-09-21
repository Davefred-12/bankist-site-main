const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD 
    }
  });
  

// Serve the homepage
app.get('/', (req, res) => {
  res.render('index', { message: null }); 
});

app.post('/create-account', (req, res) => {
    const { firstName, lastName, email } = req.body;

    const adminMailOptions = {
        to: process.env.EMAIL,
        subject: 'New Account Created',
        text: `New account details:\nFirst Name: ${firstName}\nLast Name: ${lastName}\nEmail: ${email}`
      };
    
      const userMailOptions = {
        to: email,
        subject: 'Welcome to Our Service',
        text: `Hello ${firstName},\n\nYour account has been created successfully!\n\nBest regards,\nThe Team`
      };
    
      // Send email to admin
      transporter.sendMail(adminMailOptions, (err) => {
        if (err) {
          console.log('Error sending email to admin:', err);
          return res.render('index', { message: 'Error sending email to admin. Please try again later.', formData: req.body });
        }
    
        // Send email to user
        transporter.sendMail(userMailOptions, (err) => {
          if (err) {
            console.log('Error sending email to user:', err);
            return res.render('index', { message: 'Account created, but failed to send confirmation email. Please try again later.', formData: req.body });
          }
    
          console.log('Emails sent successfully');
          return res.render('index', { message: 'Account created successfully! A confirmation email has been sent to your address.', formData: {} });
        });
      });
    });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
