export interface ApiError {
  status?: number;
  message: string;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "An unknown API error occurred",
  };
}
