const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();


app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static('public'));

app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Kris',
            lastName: 'Logemann',
        }
    }
    res.render('index', data);
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/thanks', (req, res) => {
    const contact = req.body;
    res.render('thanks', { contact: req.body })
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: 'krisrlogemann@gmail.com',
        from: contact.contact,
        subject: `${contact.firstName} ${contact.lastName}`,
        company: contact.company,
        text: contact.subject
    };
    console.log(msg);
    sgMail.send(msg);
});

app.listen(8080, () => {
    console.log('listening at http://localhost:8080');
});

module.exports = app;