import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import RoutesService from "../services/routes.service";
import { UnauthorizedError } from "../services/error.service";

interface UserRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authenticate = (
  req: UserRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log({ token });

    if (!token) throw new UnauthorizedError("No autorizado");

    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    next();
  } catch (error) {
    RoutesService.responseError(res, error as any);
  }
};
