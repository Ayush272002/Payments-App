"use server";

import prisma from "@repo/db/client";
import userSchema, { User } from "../zodSchema/userSchema";
import bcrypt from "bcrypt";

export async function createUser({ name, email, number, password }: User) {
  const validatedData = userSchema.safeParse({ name, email, number, password });

  if (!validatedData.success) {
    return {
      status: 400,
      message: validatedData.error.errors.map((err) => err.message).join(", "),
    };
  }

  const userExist = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          number,
        },
      ],
    },
  });

  if (userExist) {
    return {
      status: 409, // Conflict
      message: "Email or number already taken",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        number,
        password: hashedPassword,
      },
    });

    if (newUser) {
      return {
        status: 201, // Created
        message: "User created successfully",
      };
    }
  } catch (e) {
    console.error(e); // Log error for debugging
    return {
      status: 500, // Internal Server Error
      message: "Error creating user",
    };
  }
}
