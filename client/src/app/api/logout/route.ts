import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async function (request: NextRequest) {
  try {
    const cookieList = await cookies();
    cookieList.delete("access")
    cookieList.delete("refresh")
    return NextResponse.json({ code: 200, message: "Successfully Logged Out!" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ code: 500, message: error instanceof Error ? error.message : "Something went wrong!" }, { status: 500 })
  }
}