import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Facility from "@/models/Facility";
import { verifyToken } from "@/lib/auth";
import { autoCompleteExpiredBookings } from "@/lib/autoComplete";

export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await autoCompleteExpiredBookings();

    const filter =
      decoded.role === "Admin" ? {} : { userId: decoded.userId };

    const bookings = await Booking.find(filter)
      .populate("facilityId")
      .populate("userId", "-password")
      .sort({ date: -1, startTime: -1 });

    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { facilityId, date, startTime, endTime } = await request.json();

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!facilityId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!dateRegex.test(date) || isNaN(new Date(date).getTime())) {
      return NextResponse.json(
        { error: "Invalid date format (expected YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: "Invalid time format (expected HH:MM)" },
        { status: 400 }
      );
    }

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    if (startTime < "08:00" || endTime > "22:00") {
      return NextResponse.json(
        { error: "Bookings must be between 08:00 and 22:00" },
        { status: 400 }
      );
    }

    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return NextResponse.json(
        { error: "Facility not found" },
        { status: 404 }
      );
    }
    if (facility.status === "Maintenance") {
      return NextResponse.json(
        { error: "Facility is under maintenance" },
        { status: 400 }
      );
    }

    const session = await Booking.startSession();
    let newBooking;
    try {
      await session.withTransaction(async () => {
        const conflict = await Booking.findOne({
          facilityId,
          date,
          status: "Confirmed",
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        }).session(session);

        if (conflict) {
          throw new Error("CONFLICT");
        }

        const [created] = await Booking.create(
          [{ userId: decoded.userId, facilityId, date, startTime, endTime }],
          { session }
        );
        newBooking = created;
      });
    } catch (err) {
      if (err.message === "CONFLICT") {
        return NextResponse.json(
          { error: "Time slot is already booked" },
          { status: 409 }
        );
      }
      throw err;
    } finally {
      await session.endSession();
    }

    const populated = await Booking.findById(newBooking._id)
      .populate("facilityId")
      .populate("userId", "-password");

    return NextResponse.json({ booking: populated }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
