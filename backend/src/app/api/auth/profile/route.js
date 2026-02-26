import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function PUT(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const updates = {};

        if (body.name !== undefined) {
            const name = body.name.trim();
            if (!name) {
                return NextResponse.json(
                    { error: "Name cannot be empty" },
                    { status: 400 }
                );
            }
            updates.name = name;
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(decoded.userId, updates, {
            new: true,
        }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
