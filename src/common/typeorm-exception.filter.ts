import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

/**
 * Turns raw MySQL errors into proper HTTP responses instead of a generic 500.
 *   1062 duplicate value          -> 409 Conflict
 *   1451 row is referenced (FK)   -> 409 Conflict
 *   1452 parent row not found (FK)-> 400 Bad Request
 *   others (bad/too-long values)  -> 400 Bad Request
 */
@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Database');

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const driver: any = (exception as any).driverError ?? exception;
    const errno: number | undefined = driver?.errno ?? (exception as any).errno;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Unexpected database error';

    switch (errno) {
      case 1062:
        status = HttpStatus.CONFLICT;
        message = 'A record with the same unique value already exists';
        break;
      case 1451:
        status = HttpStatus.CONFLICT;
        message = 'Cannot delete this record because other records still reference it. Delete the dependent records first';
        break;
      case 1452:
        status = HttpStatus.BAD_REQUEST;
        message = 'Referenced record does not exist. Check the foreign-key id(s) in your request';
        break;
      case 1048:
        status = HttpStatus.BAD_REQUEST;
        message = 'A required field is missing';
        break;
      case 1406:
        status = HttpStatus.BAD_REQUEST;
        message = 'A value is too long for its column';
        break;
      case 1264:
      case 1265:
      case 1292:
      case 1366:
        status = HttpStatus.BAD_REQUEST;
        message = 'A value has an invalid format or is out of range';
        break;
      default:
        this.logger.error(driver?.sqlMessage || (exception as any).message);
    }

    const error = status === 400 ? 'Bad Request' : status === 409 ? 'Conflict' : 'Internal Server Error';
    response.status(status).json({ statusCode: status, error, message });
  }
}
