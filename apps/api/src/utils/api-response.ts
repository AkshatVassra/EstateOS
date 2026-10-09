import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(message: string, data?: T, status = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data: data || {},
      },
      { status }
    );
  }

  static error(message: string, errors: unknown[] = [], status = 400) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status }
    );
  }
}
