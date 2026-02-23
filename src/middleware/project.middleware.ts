class ThrowError extends Error {
  code: number;
  title: string;

  constructor(statusCode: number, title: string, message: string) {
    super(message);
    this.code = statusCode;
    this.title = title;
    Object.setPrototypeOf(this, ThrowError.prototype);
  }
}


export default ThrowError