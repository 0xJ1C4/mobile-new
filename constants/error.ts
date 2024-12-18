export class PublicError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

export class AuthenticationError extends PublicError {
    constructor() {
      super("Invalid Email or Password");
      this.name = "AuthenticationError";
    }
  }