const express = require('express');
const mongoose = require('mongoose');
const ipinfo = require('ipinfo');
const twilio = require('twilio');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3005;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost/nodeProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});


const UserSchema = new mongoose.Schema({
  ipAddress: String,
  phoneNumber: String,
  otp: String,
});

const User = mongoose.model('User', UserSchema);

const twilioClient = new twilio('ACafbe552d422c20946caf57278ec0a5b2', 'ed83cd958dfa5955014d31419ab109f3');
const twilioPhoneNumber = '9492804969';

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}


app.post('/sendOTP', async (req, res) => {
  try {
    const { ipAddress, phoneNumber } = req.body;


    const ipDetails = await ipinfo(ipAddress);
    const countryCode = ipDetails.country;

  
    const otp = generateOTP();
    const user = new User({ ipAddress, phoneNumber, otp });
    await user.save();

    twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/validateOTP', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

  
    const user = await User.findOne({ phoneNumber, otp });

    if (!user) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }



    res.json({ message: 'OTP validated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
