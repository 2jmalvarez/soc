import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authenticate = (
  req: UserRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
};
