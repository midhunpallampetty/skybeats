import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { gql, GraphQLClient } from 'graphql-request';
import { jsPDF } from 'jspdf';

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
  mutation CreateBooking($input: BookingInput!, $flightModel: String!) {
    createBooking(input: $input, flightModel: $flightModel) {
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
    const flightModel = req.body.flightModel;
    console.log(req.body, 'cfcdfdsf');

    try {
      // Create a PDF document
      const doc = new jsPDF();
      
      doc.setFontSize(25);
      doc.text('Skybeats - Fearless to Reach Altitude', 10, 10);
     
doc.rect(200, 10, 50, 20, 'S'); 
      doc.setFontSize(12);
      doc.text(`Invoice Number: INV-${new Date().getTime()}`, 10, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 40);
      doc.text(`Passenger Name: ${bookingInput.passengerName}`, 10, 60);
      doc.text(`Email: ${bookingInput.email}`, 10, 70);
      doc.text(`Phone: ${bookingInput.phoneNumber}`, 10, 80);
      doc.text(`Flight: ${bookingInput.flightNumber}`, 10, 100);
      doc.text(`From: ${bookingInput.departureAirport}`, 10, 110);
      doc.text(`To: ${bookingInput.arrivalAirport}`, 10, 120);
      doc.text(`Stop: ${bookingInput.stop}`, 10, 130);
      doc.text(`Fare Paid: INR ${bookingInput.FarePaid}`, 10, 140);
      doc.text('Thank you for flying with us!', 10, 160);

      // Convert the PDF to an ArrayBuffer
      const pdfOutput = doc.output('arraybuffer');
      const pdfBuffer = Buffer.from(pdfOutput); // Convert ArrayBuffer to Buffer

      const bucketName = process.env.S3_BUCKET!;
      const timestamp = Date.now();
      const fileName = `invoices/invoice-${Math.random()}-${timestamp}.pdf`;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
      };

      // Upload PDF to S3
      await s3.send(new PutObjectCommand(uploadParams));

      const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      const bookingWithTicketUrl = {
        ...bookingInput,
        ticketUrl: s3Url,
      };
      const variables = { input: bookingWithTicketUrl, flightModel };
      await client.request(CREATE_BOOKING_MUTATION, variables);

      res.status(200).json({
        message: 'PDF generated and uploaded to S3 successfully!',
        s3Url,
      });

    } catch (error: any) {
      console.error('Error generating or uploading invoice:', error);
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
