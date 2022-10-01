import "dotenv/config";

import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myNumber = process.env.MY_NUMBER;

if (accountSid && authToken && myNumber && twilioNumber) {
  const client = new Twilio(accountSid, authToken);

  client.messages
    .create({
      from: twilioNumber,
      to: myNumber,
      body: "You have successfully placed your bet! For -> Memphis Grizzlies @ 1 DeSo",
    })
    .then((message) => console.log(message.sid));
} else {
  console.error(
    "Your message failed to send. Please check your .env file and try again."
  );
}
