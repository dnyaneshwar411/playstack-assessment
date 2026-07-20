import { buildToastMessage } from "@/lib/catchAsync";
import { makeRequest } from "@/network";
import { NextRequest, NextResponse } from "next/server";

export const POST = async function (req: NextRequest) {
  try {
    const body = await req.json()
    const response = await makeRequest("/api/v1/auth/login", {
      method: "POST",
      body,
      early: true
    })
    const data = await response.json();
    if (response.status !== 200) throw new Error(data.message)

    const cookieHeader = response.headers.get('set-cookie');
    if (!cookieHeader) throw new Error("Something went wrong!")

    const nextResponse = NextResponse.json({ code: 200, data: data.data }, { status: 200 });
    nextResponse.headers.append('Set-Cookie', cookieHeader);
    return nextResponse
  } catch (error) {
    return NextResponse.json({ code: 500, message: buildToastMessage(error) }, { status: 500 })
  }
}