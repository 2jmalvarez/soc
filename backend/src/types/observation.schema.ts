import Joi from "joi";

export const observationSchema = Joi.object({
  id: Joi.string().uuid().required(),
  code: Joi.string().min(3).max(100).required(),
  value: Joi.string().min(1).max(500).required(),
  date: Joi.date().iso().required(),
  patient_id: Joi.string().uuid().required(),
  user_id: Joi.string().uuid().required(),
});

export const baseObservationSchema = Joi.object({
  code: Joi.string().min(3).max(100).required(),
  value: Joi.string().min(1).max(500).required(),
  date: Joi.date().iso().required(),
});
