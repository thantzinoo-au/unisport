import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Facility from "@/models/Facility";
import { requireAdmin } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await dbConnect();
    const facility = await Facility.findById(id);
    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ facility });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();
    const { name, type, location, capacity, status } = await request.json();

    const validTypes = ["Snooker", "Football", "Badminton"];
    const validStatuses = ["Active", "Maintenance"];

    if (type && !validTypes.includes(type)) {
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

    if (capacity != null && (typeof capacity !== "number" || capacity < 1)) {
      return NextResponse.json(
        { error: "Capacity must be a positive number" },
        { status: 400 }
      );
    }

    const updates = {};
    if (name) updates.name = name;
    if (type) updates.type = type;
    if (location) updates.location = location;
    if (capacity != null) updates.capacity = capacity;
    if (status) updates.status = status;

    const facility = await Facility.findByIdAndUpdate(id, updates, { new: true });
    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ facility });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await dbConnect();
    const facility = await Facility.findByIdAndDelete(id);
    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Facility deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
