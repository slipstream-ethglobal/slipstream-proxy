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

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.makeRequest<T>('GET', endpoint, undefined, headers);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data, headers);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data, headers);
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, headers);
  }

  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
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
      data: data !== undefined ? data : undefined,
      validateStatus: () => true,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.request(axiosConfig),
      );
      const status = response.status;

      if (status < 200 || status >= 300) {
        const errorText =
          typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data);
        this.logger.error(
          `[${requestId}] Relayer error: ${status} - ${errorText}`,
        );

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
        const errorText =
          typeof error.response.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response.data);

        this.logger.error(
          `[${requestId}] Relayer error (caught): ${status} - ${errorText}`,
        );

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
