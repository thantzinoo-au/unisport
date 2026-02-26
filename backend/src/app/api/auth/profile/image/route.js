import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(request) {
    try {
        const decoded = verifyToken(request);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("image");

        if (!file || typeof file === "string") {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "Image is too large. Maximum size is 2 MB." },
                { status: 400 }
            );
        }

        // Ensure the upload directory exists
        if (!existsSync(UPLOAD_DIR)) {
            await mkdir(UPLOAD_DIR, { recursive: true });
        }

        // Generate a UUID-based filename with the correct extension
        const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
        const filename = `${randomUUID()}.${ext}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        await dbConnect();

        // Delete the previous image file if it exists
        const existing = await User.findById(decoded.userId).select("profileImage");
        if (existing?.profileImage) {
            const oldPath = path.join(UPLOAD_DIR, existing.profileImage);
            if (existsSync(oldPath)) {
                await unlink(oldPath).catch(() => { });
            }
        }

        // Persist only the filename in MongoDB
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { profileImage: filename },
            { new: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
