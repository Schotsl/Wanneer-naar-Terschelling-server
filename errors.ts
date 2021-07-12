export class PropertyError extends Error {
  // Set status error to "Bad Request"
  public statusError = 400;

  constructor(
    type: "missing" | "email" | "length" | "password" | "extension" | "date",
    property: string,
  ) {
    // If type is missing update the error message
    if (type !== "missing") {
      super(`Property '${property}' does not meet the ${type} requirements.`);
      return;
    }

    // Otherwise send the "property is missing" error message
    super(`Property '${property}' is missing.`);
  }
}

export class TypeError extends Error {
  // Set status error to "Bad Request"
  public statusError = 400;

  constructor(
    type: "string" | "number" | "boolean",
    property: string,
  ) {
    // Otherwise send the "property is missing" error message
    super(`Property '${property}' should be a ${type}.`);
  }
}

export class AuthenticationError extends Error {
  // Set status error to "Unauthorized"
  public statusError = 401;

  constructor(error: "expired" | "missing" | "incorrect" | "origin") {
    if (error === "expired") {
      super("JWT token has expired.");
      return;
    }

    if (error === "missing") {
      super("JWT token is missing");
      return;
    }

    if (error === "origin") {
      super("Unauthorized IP address");
      return;
    }

    super("The email address or password is incorrect.");
  }
}

export class BodyError extends Error {
  // Set default status to "Not Found"
  public statusError = 400;

  constructor(error: "missing" | "invalid") {
    if (error === "invalid") {
      super("Request had an invalid (JSON) body.");
      return;
    }
    
    super("Request is missing a valid JSON body.");
  }
}
