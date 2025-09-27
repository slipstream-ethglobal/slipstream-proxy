// export class BaseResponseDto<T = any> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   requestId?: string;
//   timestamp: string;

//   constructor(data?: T, error?: string, requestId?: string) {
//     this.success = !error;
//     this.data = data;
//     this.error = error;
//     this.requestId = requestId;
//     this.timestamp = new Date().toISOString();
//   }

//   static success<T>(data: T, requestId?: string): BaseResponseDto<T> {
//     return new BaseResponseDto(data, undefined, requestId);
//   }

//   static error(error: string, requestId?: string): BaseResponseDto {
//     return new BaseResponseDto(undefined, error, requestId);
//   }
// }
