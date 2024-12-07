import { Response } from "express";
import Joi from "joi";
import { BodyError, ErrorType, ParamsError } from "./error.service";

const RoutesService = {
  validationBody: <T>(body: T, schema: Joi.ObjectSchema<T>) => {
    const { error } = schema.validate(body);
    if (error)
      throw new BodyError(error.details.map((e) => e.message).join(", "));
  },
  validationParams: <T>(params: T, schema: Joi.ObjectSchema<T>) => {
    const { error } = schema.validate(params);
    if (error)
      throw new ParamsError(error.details.map((e) => e.message).join(", "));
  },
  responseError: (
    res: Response,
    { message = "Error desconocido", status = 500, name }: ErrorType
  ) => {
    console.log({ message, status, name });

    res.status(status).json({ message, error: name });
  },
  responseSuccess: (res: Response, data: any, status = 200) => {
    res.status(status).json({ data, error: false });
  },
  getUserId: (req: any) => {
    return req.user.id;
  },
};

export default RoutesService;
