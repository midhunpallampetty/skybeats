import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & { io?: IOServer };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Initializing new Socket.io server...");
    
    // Create a new instance of the socket.io server
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    // Handle client connection
    io.on("connection", (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Listen to client messages
      socket.on("client_message", (message: { userId: string; text: string }) => {
        console.log(`Received message from user: ${message.userId}: ${message.text}`);
        // Admin can receive this message and respond
        io.emit("admin_message", message);
      });

      // Listen for admin messages
      socket.on("admin_message", (message: { adminId: string; text: string }) => {
        console.log(`Admin message: ${message.text}`);
        // Send message to all clients
        io.emit("client_message", message);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  res.end();
}
