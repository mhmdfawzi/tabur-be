import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    console.log(`Method: ${method}, URL: ${url}`);
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        Logger.log(
          `${method} ${url} ${Date.now() - now}ms`,
          context.getClass().name,
        ),
          console.log('After...');
        return data;
      }),
    );
  }
}
