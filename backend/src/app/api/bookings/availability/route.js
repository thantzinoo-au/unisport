import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

const OPERATING_HOURS = { start: 8, end: 22 };

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const facilityId = searchParams.get("facilityId");
    const date = searchParams.get("date");

    if (!facilityId || !date) {
      return NextResponse.json(
        { error: "facilityId and date are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const bookings = await Booking.find({
      facilityId,
      date,
      status: "Confirmed",
    });

    const allSlots = [];
    for (let hour = OPERATING_HOURS.start; hour < OPERATING_HOURS.end; hour++) {
      const startTime = `${String(hour).padStart(2, "0")}:00`;
      const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
      allSlots.push({ startTime, endTime });
    }

    const available = allSlots.filter((slot) => {
      return !bookings.some(
        (b) => b.startTime < slot.endTime && b.endTime > slot.startTime
      );
    });

    return NextResponse.json({ slots: available, allSlots });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
