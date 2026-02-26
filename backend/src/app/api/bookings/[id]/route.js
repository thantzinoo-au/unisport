import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/auth";
import { autoCompleteExpiredBookings } from "@/lib/autoComplete";

export async function GET(request, { params }) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    await autoCompleteExpiredBookings();
    const booking = await Booking.findById(id)
      .populate("facilityId")
      .populate("userId", "-password");

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      decoded.role !== "Admin" &&
      booking.userId._id?.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      decoded.role !== "Admin" &&
      booking.userId.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await request.json();

    const validStatuses = ["Confirmed", "Cancelled", "Completed"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const allowedTransitions = {
      Confirmed: ["Cancelled", "Completed"],
      Cancelled: [],
      Completed: [],
    };

    if (!allowedTransitions[booking.status].includes(status)) {
      return NextResponse.json(
        { error: `Cannot change status from ${booking.status} to ${status}` },
        { status: 400 }
      );
    }

    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true })
      .populate("facilityId")
      .populate("userId", "-password");

    return NextResponse.json({ booking: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (
      decoded.role !== "Admin" &&
      booking.userId.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ message: "Booking deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
