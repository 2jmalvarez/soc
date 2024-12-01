export class ParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParamsError";
  }
}

export class BodyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BodyError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
