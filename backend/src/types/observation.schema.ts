import Joi from "joi";

export const baseObservationSchema = Joi.object({
  observation_code: Joi.string().min(3).max(100).required().messages({
    "string.base": "El código de la observación debe ser un texto",
    "string.empty": "El código de la observación no debe estar vacío",
    "string.min":
      "El código de la observación debe tener al menos {#limit} caracteres",
    "string.max":
      "El código de la observación no debe tener más de {#limit} caracteres",
    "any.required": "El código de la observación es un campo requerido",
  }),
  value: Joi.string().min(1).max(500).required().messages({
    "string.base": "El valor de la observación debe ser un texto",
    "string.empty": "El valor de la observación no debe estar vacío",
    "string.min":
      "El valor de la observación debe tener al menos {#limit} caracteres",
    "string.max":
      "El valor de la observación no debe tener más de {#limit} caracteres",
    "any.required": "El valor de la observación es un campo requerido",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "La fecha de la observación debe ser una fecha",
    "date.empty": "La fecha de la observación no debe estar vacía",
    "date.iso":
      "La fecha de la observación debe ser una fecha ISO 8601 ( YYYY-MM-DD )",
    "any.required": "La fecha de la observación es un campo requerido",
    "date.format":
      "La fecha de la observación debe tener el formato YYYY-MM-DD",
  }),
});
