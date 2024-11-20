import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { gql, GraphQLClient } from 'graphql-request';
import { createCanvas, loadImage,registerFont } from 'canvas';

import path from 'path';
import QRCode from 'qrcode';
const endpoint = process.env.GRAPHQL_ENDPOINT!;
const fontPath = path.join(process.cwd(), 'pages', 'api', 'Arial.ttf');

// Register the font
registerFont(fontPath, { family: 'Arial' });

console.log('Font registered from path:', fontPath);
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
        ctx.font = 'bold 22px sans-serif';
        ctx.fillStyle = '#000';
        ctx.fillText(`${passenger.firstName} ${passenger.lastName}`, 173, 157);
        ctx.fillText(`${passenger.firstName} ${passenger.lastName}`, 1050, 68);
        ctx.fillText(`${filteredBookingInput.flightNumber}`, 77, 450);
        ctx.fillText(`${filteredBookingInput.departureAirport}`, 115, 350);
        ctx.fillText('→ ', 175, 348);
        ctx.fillText(`${filteredBookingInput.arrivalAirport}`, 247, 350);
        ctx.fillText(`${filteredBookingInput.DateofJourney}`, 763, 344);

        // Generate the QR code with passenger details
        const qrData = JSON.stringify({
          passengerName: `${passenger.firstName} ${passenger.lastName}`,
          flightNumber: filteredBookingInput.flightNumber,
          departureAirport: filteredBookingInput.departureAirport,
          arrivalAirport: filteredBookingInput.arrivalAirport,
          DateofJourney: filteredBookingInput.DateofJourney,
          seat: filteredBookingInput.seatNumber,
        });
        console.log('QR Data:', qrData);
        const qrCodeBuffer = await QRCode.toBuffer(qrData, { width: 100, margin: 1 });
        console.log('QR Code Buffer Length:', qrCodeBuffer.length); // Debug buffer length
        const qrCodeImage = await loadImage(qrCodeBuffer);
        const qrCodeX = 640, qrCodeY = 30, qrCodeSize = 120;
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

