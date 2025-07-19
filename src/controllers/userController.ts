import { Request, Response } from "express";
import { auth } from "../auth";
import logger from "../utils/logger";

/**
 * User registration controller for handling user sign-up requests.
 * This function registers a new user using the better-auth service and creates an API key for them.
 *
 * @param {Request} req - The request object containing user details.
 * @param {Response} res - The response object to send back the result.
 * @returns {Promise<Response>} - Returns a response with the status of the registration.
 */

// POST /api/auth/register
export async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password, topics, readTime } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
  }

  try {
    // Register user with better-auth
    const { user } = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: email.split("@")[0], // Use email prefix as name
      },
    });

    const apiKey = await auth.api.createApiKey({
      body: {
        name: email,
        expiresIn: 60 * 60 * 24 * 365, // 1 year
        prefix: "DailNugget",
        remaining: 100,
        refillAmount: 100,
        //refillInterval: 60 * 60 * 24 * 7, // 7 days
        metadata: {
          tier: "free",
        },
        rateLimitTimeWindow: 1000 * 60 * 60 * 24, // everyday
        rateLimitMax: 100, // every day, they can use up to 100 requests
        rateLimitEnabled: true,
        userId: user.id, // the user ID to create the API key for
      },
    });

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
      apiKey,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Registration failed" });
  }
}

/**
 * User login controller for handling user sign-in requests.
 * This function authenticates a user using the better-auth service.
 *
 * @param {Request} req - The request object containing user credentials.
 * @param {Response} res - The response object to send back the result.
 * @returns {Promise<Response>} - Returns a response with the status of the login.
 */
// POST /api/auth/login
export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    // Authenticate user with better-auth
    const { user } = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    logger.info(`User logged in: ${email}`);

    return res.status(200).json({
      message: "User logged in successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || "Login failed" });
  }
}
