import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const GET = async () => {
  // await prisma.user.create({
  //   data: {
  //     email: "asd@gmail.com",
  //     name: "adsads",
  //     number: "123123",
  //     password: "123123",
  //   },
  // });
  return NextResponse.json({
    message: "hi there",
  });
};
