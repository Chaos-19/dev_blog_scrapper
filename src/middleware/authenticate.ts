import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";

//import type { Session } from "better-auth";

declare module "express-serve-static-core" {
  interface Request {
    session?: any;
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    console.log("Session:", session);
    req.session = session; // attach session to request
    console.log("Test MiddelWare");

    if (!session?.user) {
      res.status(401).json({ error: "Unauthorized" });
    }
    req.session = session; // attach session to request

    next();
  } catch (err) {
    next(err);
  }
}
