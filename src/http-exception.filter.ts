import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly configService: ConfigService
    ) { }

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const exceptionResponse: any = exception.getResponse();

        response.status(status).json({
            status: 'error',
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exceptionResponse.message || exception.message,
            stack: this.configService.get<string>('NODE_ENV') !== 'production' ? exception?.cause : null,
            method: request.method,
        });
    }
}
