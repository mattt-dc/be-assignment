import { ErrorDetail } from "./error_detail.interface";

export interface ErrorResponse {
    status: 'error';
    error: ErrorDetail;
}