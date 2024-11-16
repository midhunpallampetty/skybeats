import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { gql, GraphQLClient } from 'graphql-request';
import { createCanvas, loadImage } from 'canvas';

import path from 'path';
import QRCode from 'qrcode';
const endpoint = 'https://skybeats.neptunemusics.shop/graphql';

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
      arrivalAirport
      arrivalTime
      DateofJourney
      departureAirport
      departureTime
      email
      FarePaid
      flightDuration
      flightModel
      flightNumber
      id
      passengerName {
        age
        disability
        firstName
        lastName
        middleName
        passportNumber
      }
      ticketUrls
    }
  }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  const ticketImagePath = path.join(process.cwd(), 'public', 'ticket-Photoroom.png');
  const logoImagePath = path.join(process.cwd(), 'public', 'logo-Photoroom-light.png');

  if (req.method === 'POST') {
    const bookingInput = req.body; // Access the input object from the request body
    const flightModel = req.body.flightModel;
    
    // Remove returnDate from the bookingInput
    const { returnDate, ...filteredBookingInput } = bookingInput;

    try {
      const ticketUrls: string[] = [];

      for (const passenger of filteredBookingInput.passengerName) {
        // Load the ticket template image and logo
        const templateImage = await loadImage(ticketImagePath);
        const logoImage = await loadImage(logoImagePath);

        // Create a canvas and draw the images
        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(templateImage, 0, 0, templateImage.width, templateImage.height);

        // Draw the logo and passenger details dynamically
        const logoWidth = 150, logoHeight = 50, logoX = 20, logoY = 20;
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
        
        // Set text styles and add passenger details
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.fillStyle = '#000';
        ctx.fillText(`cdcdscdscdsc`, 155, 175);
        ctx.fillText(`sxsaxasxsax`, 1145, 116);
        ctx.fillText(`saxasxsaxasxsax`, 100, 522);
        ctx.fillText(`sxsaxsaxsaxsa`, 101, 409);
        ctx.fillText('→ ', 110, 411);
        ctx.fillText(`xsaxsaxasxasxsa`, 243, 416);
        ctx.fillText(`xsaxsaxsaxasx`, 895, 415);

        // Generate the QR code with passenger details
        const qrData = JSON.stringify({
          passengerName: `${passenger.firstName} ${passenger.lastName}`,
          flightNumber: filteredBookingInput.flightNumber,
          departureAirport: filteredBookingInput.departureAirport,
          arrivalAirport: filteredBookingInput.arrivalAirport,
          DateofJourney: filteredBookingInput.DateofJourney,
          seat: filteredBookingInput.seatNumber,
        });
        const qrCodeBuffer = await QRCode.toBuffer(qrData, { width: 150, margin: 1 });
        const qrCodeImage = await loadImage(qrCodeBuffer);
        const qrCodeX = 1280, qrCodeY = 500, qrCodeSize = 150;
        ctx.drawImage(qrCodeImage, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

        // Save the canvas as an image buffer and upload to S3
        const buffer = canvas.toBuffer('image/png');
        const bucketName = process.env.S3_BUCKET!;
        const timestamp = Date.now();
        const fileName = `tickets/ticket-${passenger.firstName}-${timestamp}.png`;

        const uploadParams = {
          Bucket: bucketName,
          Key: fileName,
          Body: buffer,
          ContentType: 'image/png',
        };
        await s3.send(new PutObjectCommand(uploadParams));

        const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        ticketUrls.push(s3Url);
      }

      const bookingWithTicketUrls = {
        ...filteredBookingInput,
        ticketUrls,
      };

      const variables = {
        input: bookingWithTicketUrls,
        flightModel,
      };

      // Call the GraphQL mutation to create the booking (uncomment when ready)
      await client.request(CREATE_BOOKING_MUTATION, variables);

      res.status(200).json({
        message: 'Tickets generated and uploaded to S3 successfully!',
        ticketUrls,
      });
    } catch (error: any) {
      console.error('Error generating or uploading tickets:', error);
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
