import { API_URL } from "@/constants/authConstants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the search parameters from the request URL
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward the request to the actual API
    const apiUrl = `${API_URL}/users?name=${encodeURIComponent(
      name
    )}&page=${page}&limit=${limit}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in proxy API:", error);
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }
}
