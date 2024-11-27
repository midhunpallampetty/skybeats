import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Define the expected response type
type ValidateTokenResponse = {
  success: boolean;
};

// Define the API response type
type ApiResponse = {
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method === "POST") {
    const { token } = req.body;
console.log(req.body,'cdscdsc')
    // Check if token is provided
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    try {
      // Send the GraphQL query to validate the token
      const response = await axios.post<{ data: { validateToken: ValidateTokenResponse } }>(
        process.env.GRAPHQL_ENDPOINT!,
        {
          query: `
            query ValidateToken($token: String!) {
              validateToken(token: $token) {
                success
              }
            }
          `,
          variables: { token },
        }
      );

      // Extract data from the response
      const { success } = response.data.data.validateToken;

      res.status(200).json({ success });
    } catch (err) {
      console.error("Token validation error:", err);
      res.status(500).json({ error: "Failed to validate token" });
    }
  } else {
    // Return an error for non-POST requests
    res.status(405).json({ error: "Method not allowed" });
  }
}
