import Booking from "@/models/Booking";

/**
 * Marks any Confirmed bookings whose end time has already passed as Completed.
 * Call this before reading bookings or stats so the data is always up-to-date.
 */
export async function autoCompleteExpiredBookings() {
    const now = new Date();

    // Build date/time strings in the same format the bookings store (YYYY-MM-DD / HH:MM)
    // Use local time consistently — toISOString() is UTC and would mismatch getHours()/getMinutes()
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`; // "2026-02-26" in local time
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const nowTime = `${hours}:${minutes}`; // "14:35"

    await Booking.updateMany(
        {
            status: "Confirmed",
            $or: [
                { date: { $lt: todayStr } },                          // any past date
                { date: todayStr, endTime: { $lte: nowTime } },       // today, but slot ended
            ],
        },
        { $set: { status: "Completed" } }
    );
}
