/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);
  private readonly relayerBaseUrl: string;
  private readonly timeout: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.relayerBaseUrl = this.configService.get<string>(
      'RELAYER_BASE_URL',
      'http://localhost:8080',
    );
    this.timeout = this.configService.get<number>('RELAYER_TIMEOUT', 30000);
  }

  async get<T>(
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.makeRequest<T>('GET', endpoint, undefined, params, headers);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    params?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data, params, headers);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    params?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data, params, headers);
  }

  async delete<T>(
    endpoint: string,
    params?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, params, headers);
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    params?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    const url = `${this.relayerBaseUrl}${endpoint}`;
    const requestId = Math.random().toString(36).substring(2, 9);

    this.logger.log(`[${requestId}] ${method} ${url}`);

    const axiosConfig: AxiosRequestConfig = {
      url,
      method,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SlipstreamProxy/1.0',
        ...headers,
      },
      params: params !== undefined ? params : undefined,
      data: data !== undefined ? data : undefined,
      validateStatus: () => true,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.request(axiosConfig),
      );
      const status = response.status;

      if (status < 200 || status >= 300) {
        // response.data may be object or string. Try to preserve structured data.
        let errorPayload: any = null;
        if (response.data && typeof response.data === 'object') {
          errorPayload = response.data;
        } else if (typeof response.data === 'string') {
          // try to parse JSON string (the relayer sometimes embeds JSON in a string)
          try {
            errorPayload = JSON.parse(response.data);
          } catch {
            // not JSON, keep raw string
            errorPayload = response.data;
          }
        } else {
          errorPayload = response.data;
        }

        const errorText =
          typeof errorPayload === 'string'
            ? errorPayload
            : JSON.stringify(errorPayload);

        this.logger.error(
          `[${requestId}] Relayer error: ${status} - ${errorText}`,
        );

        // If we have a parsed object, forward it as response body; otherwise forward a message
        if (errorPayload && typeof errorPayload === 'object') {
          throw new HttpException(errorPayload, this.mapHttpStatus(status));
        }

        throw new HttpException(
          `Relayer error: ${status} - ${errorText}`,
          this.mapHttpStatus(status),
        );
      }

      this.logger.log(`[${requestId}] Relayer response received`);
      return response.data as T;
    } catch (err) {
      // Axios error handling
      const error = err;

      // Timeout
      if (error?.code === 'ECONNABORTED') {
        this.logger.error(
          `[${requestId}] Request timeout after ${this.timeout}ms`,
        );
        throw new HttpException('Request timeout', HttpStatus.REQUEST_TIMEOUT);
      }

      // If the error comes with a response (HTTP error forwarded)
      if (error?.response && typeof error.response.status === 'number') {
        const status = error.response.status;
        // response.data might be string containing JSON; try parse
        let errorPayload: any = null;
        if (error.response.data && typeof error.response.data === 'object') {
          errorPayload = error.response.data;
        } else if (typeof error.response.data === 'string') {
          try {
            errorPayload = JSON.parse(error.response.data);
          } catch {
            // not JSON => the service sometimes wraps JSON inside strings like:
            // "Relayer error: 400 - {\"success\":false,...}"
            // try to extract first {...} or [...]
            const jsonMatch = error.response.data.match(
              /(\{[\s\S]*\}|\[[\s\S]*\])/,
            );
            if (jsonMatch) {
              try {
                errorPayload = JSON.parse(jsonMatch[0]);
              } catch {
                errorPayload = error.response.data;
              }
            } else {
              errorPayload = error.response.data;
            }
          }
        } else {
          errorPayload = error.response.data;
        }

        const errorText =
          typeof errorPayload === 'string'
            ? errorPayload
            : JSON.stringify(errorPayload);

        this.logger.error(
          `[${requestId}] Relayer error (caught): ${status} - ${errorText}`,
        );

        if (errorPayload && typeof errorPayload === 'object') {
          throw new HttpException(errorPayload, this.mapHttpStatus(status));
        }

        throw new HttpException(
          `Relayer error: ${status} - ${errorText}`,
          this.mapHttpStatus(status),
        );
      }

      // If it's already an HttpException, rethrow
      if (error instanceof HttpException) {
        throw error;
      }

      // Network or unexpected error
      this.logger.error(`[${requestId}] Network error:`, error);
      throw new HttpException(
        'Failed to communicate with relayer service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private mapHttpStatus(relayerStatus: number): HttpStatus {
    switch (relayerStatus) {
      case 400:
        return HttpStatus.BAD_REQUEST;
      case 401:
        return HttpStatus.UNAUTHORIZED;
      case 403:
        return HttpStatus.FORBIDDEN;
      case 404:
        return HttpStatus.NOT_FOUND;
      case 429:
        return HttpStatus.TOO_MANY_REQUESTS;
      case 500:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.BAD_GATEWAY;
    }
  }
}
