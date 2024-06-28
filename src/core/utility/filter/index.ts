import { ERROR_CODES } from '@errors';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const errorResponse: any = exception.getResponse();
    const error = errorResponse?.error;
    if (Array.isArray(errorResponse.message)) {
      const validationErrorMessage: any = this.retrieveValidationErrorMessage(
        errorResponse.message,
      );
      exception.message = validationErrorMessage;
    }

    if (typeof exception.message === 'string') {
      let message = exception.message;
      // let error = exception.
      message = message.charAt(0).toUpperCase() + message.slice(1);
      exception.message = message;
    }
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: error ? error : ERROR_CODES.USER_NOT_FOUND,
    });
  }

  retrieveValidationErrorMessage(message: [ValidationError]) {
    let response = [];
    message.forEach((m) => {
      const msg = {};
      if (m.constraints) {
        const constraints = Object.values(m.constraints);
        msg[m.property] = constraints;
        response.push(constraints);
      } else {
        response = message;
      }
    });

    return [].concat(...response);
  }
}
