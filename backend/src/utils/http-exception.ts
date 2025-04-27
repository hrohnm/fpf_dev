/**
 * Custom HTTP Exception class
 */
export class HttpException extends Error {
  status: number;
  message: string;
  details?: Record<string, any>;

  /**
   * Create a new HTTP Exception
   * @param status HTTP status code
   * @param message Error message
   * @param details Additional error details
   */
  constructor(status: number, message: string, details?: Record<string, any>) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
    this.name = 'HttpException';
  }
}
