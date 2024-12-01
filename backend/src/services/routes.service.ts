import { Response, Request } from "express";
import Joi from "joi";
import { BodyError } from "./error.service";

const RoutesService = {
  validationBody: <T>(body: T, schema: Joi.ObjectSchema<T>) => {
    const { error } = schema.validate(body);
    if (error)
      throw new BodyError(error.details.map((e) => e.message).join(", "));
  },
  validationParams: <T>(
    req: Request,
    res: Response,
    schema: Joi.ObjectSchema<T>
  ) => {
    const { error } = schema.validate(req.params);
    if (error) {
      res.status(400).json({
        message: "Parámetros inválidos",
        error: error.details.map((e) => e.message),
      });
    }
    return error;
  },
  responseError: (res: Response, message: string, status = 500) => {
    res.status(status).json({ message });
  },
  responseSuccess: (res: Response, data: any, status = 200) => {
    res.status(status).json({ data });
  },
};

export default RoutesService;
