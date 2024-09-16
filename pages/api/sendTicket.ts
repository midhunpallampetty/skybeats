import { NextApiRequest, NextApiResponse } from "next";
import easyinvoice from "easyinvoice";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import utility from 'util-functions-nodejs'
import { gql, GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:3300/graphql';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});


const client = new GraphQLClient(endpoint);

const CREATE_BOOKING_MUTATION = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      passengerName
      email
      phoneNumber
      departureAirport
      arrivalAirport
      stop
      flightNumber
      flightDuration
      departureTime
      arrivalTime
      totalPassengers
      FarePaid
      ticketUrl
    }
  }
`;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const bookingInput = req.body;
    const bookingInput2 = req.body;

    try {
     
      const invoiceData = {
        
        "currency": "INR",
        "taxNotation": "gst",
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "sender": {
          "company": "Skybeats-Fearless to Reach Altitude",
          "address": "Blagnac, France",
          "zip": "400001",
          "city": "Blagnac",
          "country": "France"
        },
        "client": {
          "company": bookingInput.passengerName,
          "email": bookingInput.email,
          "phone": bookingInput.phoneNumber
        },
        "information": {
          "number": `INV-${new Date().getTime()}`, 
          "date": new Date().toLocaleDateString(),
          "due-date": new Date().toLocaleDateString()
        },
        "products": [
          {
            "quantity": bookingInput.totalPassengers,
            "description": `Flight from ${bookingInput.departureAirport} to ${bookingInput.arrivalAirport} - ${bookingInput.stop} (${bookingInput.flightNumber})`,
            "tax-rate": 0,
            "price": bookingInput.FarePaid
          }
        ],
        "bottom-notice": "Thank you for flying with us!"
      };

      const invoiceResult = await easyinvoice.createInvoice(invoiceData);

      const pdfBuffer = Buffer.from(invoiceResult.pdf, 'base64');
      const bucketName = process.env.S3_BUCKET!;
      const timestamp = Date.now();
      const fileName = `invoices/invoice-${Math.random()}-${timestamp}.pdf`;
      
      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
      };

      const uploadResult = await s3.send(new PutObjectCommand(uploadParams));

      const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      const bookingWithTicketUrl = {
        ...bookingInput,
        ticketUrl: s3Url,  
      };
      const variables = { input: bookingWithTicketUrl };
      const data = await client.request(CREATE_BOOKING_MUTATION, variables);
      res.status(200).json({
        message: 'PDF generated and uploaded to S3 successfully!',
        s3Url,
      });

    } catch (error: any) {
      console.error('Error generating or uploading invoice:', error);
            res.status(500).json({ message: 'Error creating booking', error: error.message });

      res.status(500).json({ message: 'Error creating or uploading invoice', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
  
}
