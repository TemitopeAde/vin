import express from 'express';
import nodemon from 'nodemon';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
dotenv.config();

// Use the cors middleware
app.use(cors());

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', async (req, res) => {
  try {
    // Extract token and VIN from query parameters
    const { token, VIN, type } = req.query;

    // Check if required parameters are present
    if (!token || !VIN || !type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Make a request to the external API
    const apiUrl = `https://check-vin.org/api/getinfo?token=${token}&VIN=${VIN}&type=${type}`;
    const response = await axios.get(apiUrl);

    // Return the data from the external API
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// NOT FOUND MIDDLEWARE
// app.use('*', (req, res) => {
//   res.status(404).json({ msg: 'not found' })
// });


const port = 5100;

try {
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  })
} catch (error) {
  console.log(error);
  process.exit(1)
}