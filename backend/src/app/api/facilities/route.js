import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Facility from "@/models/Facility";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const facilities = await Facility.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ facilities });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const { name, type, location, capacity, status } = await request.json();

    const validTypes = ["Snooker", "Football", "Badminton"];
    const validStatuses = ["Active", "Maintenance"];

    if (!name || !type || !location || capacity == null) {
      return NextResponse.json(
        { error: "Name, type, location, and capacity are required" },
        { status: 400 }
      );
    }

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    if (typeof capacity !== "number" || capacity < 1) {
      return NextResponse.json(
        { error: "Capacity must be a positive number" },
        { status: 400 }
      );
    }

    const facility = await Facility.create({ name, type, location, capacity, status });
    return NextResponse.json({ facility }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
