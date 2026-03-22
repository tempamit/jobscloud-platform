import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, role, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // 1. Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    // 2. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the User and their specific Profile in one transaction
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        role: role === "EMPLOYER" ? "EMPLOYER" : "SEEKER",
        
        // Dynamically create the correct profile based on the role
        ...(role === "EMPLOYER"
          ? { employerProfile: { create: { companyName: name } } }
          : { seekerProfile: { create: { fullName: name } } }),
      },
    });

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
  }
}