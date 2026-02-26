import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, studentId, email, password } = await request.json();

    const existing = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email or student ID already exists" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, studentId, email, password: hashed });
    const token = signToken({ userId: user._id, role: user.role });

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          name: user.name,
          studentId: user.studentId,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || "",
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
