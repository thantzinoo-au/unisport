import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Facility from "@/models/Facility";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { autoCompleteExpiredBookings } from "@/lib/autoComplete";

export async function GET(request) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    await autoCompleteExpiredBookings();

    const [
      totalBookings,
      confirmedCount,
      cancelledCount,
      completedCount,
      totalUsers,
      totalFacilities,
      activeFacilities,
      bookingsByType,
      bookingsByFacility,
      peakHours,
      recentBookings,
      dailyBookings,
      bookingsByDayOfWeek,
      mostActiveUsers,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "Confirmed" }),
      Booking.countDocuments({ status: "Cancelled" }),
      Booking.countDocuments({ status: "Completed" }),
      User.countDocuments({ role: "Student" }),
      Facility.countDocuments(),
      Facility.countDocuments({ status: "Active" }),
      Booking.aggregate([
        {
          $lookup: {
            from: "facilities",
            localField: "facilityId",
            foreignField: "_id",
            as: "facility",
          },
        },
        { $unwind: "$facility" },
        {
          $group: {
            _id: "$facility.type",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Booking.aggregate([
        {
          $lookup: {
            from: "facilities",
            localField: "facilityId",
            foreignField: "_id",
            as: "facility",
          },
        },
        { $unwind: "$facility" },
        {
          $group: {
            _id: { id: "$facilityId", name: "$facility.name" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Booking.aggregate([
        { $match: { status: "Confirmed" } },
        {
          $group: {
            _id: "$startTime",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Booking.find()
        .populate("facilityId")
        .populate("userId", "-password")
        .sort({ createdAt: -1 })
        .limit(10),
      Booking.aggregate([
        {
          $group: {
            _id: "$date",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 14 },
      ]),
      // Bookings by day of week (0=Sun … 6=Sat)
      Booking.aggregate([
        {
          $addFields: {
            parsedDate: { $dateFromString: { dateString: "$date" } },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$parsedDate" }, // 1=Sun, 2=Mon … 7=Sat
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Most active users (top 5 students by booking count)
      Booking.aggregate([
        {
          $group: {
            _id: "$userId",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            name: "$user.name",
            studentId: "$user.studentId",
            count: 1,
          },
        },
      ]),
    ]);

    const cancellationRate =
      totalBookings > 0
        ? ((cancelledCount / totalBookings) * 100).toFixed(1)
        : 0;

    const completionRate =
      totalBookings > 0
        ? ((completedCount / totalBookings) * 100).toFixed(1)
        : 0;

    const avgBookingsPerUser =
      totalUsers > 0 ? (totalBookings / totalUsers).toFixed(1) : 0;

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const bookingsByDayOfWeekFormatted = bookingsByDayOfWeek.map((d) => ({
      label: dayNames[d._id - 1] ?? `Day ${d._id}`,
      count: d.count,
    }));

    return NextResponse.json({
      overview: {
        totalBookings,
        confirmedCount,
        cancelledCount,
        completedCount,
        totalUsers,
        totalFacilities,
        activeFacilities,
        cancellationRate: Number(cancellationRate),
        completionRate: Number(completionRate),
        avgBookingsPerUser: Number(avgBookingsPerUser),
      },
      bookingsByType,
      topFacilities: bookingsByFacility.map((f) => ({
        name: f._id.name,
        count: f.count,
      })),
      peakHours,
      recentBookings,
      dailyBookings: dailyBookings.reverse(),
      bookingsByDayOfWeek: bookingsByDayOfWeekFormatted,
      mostActiveUsers,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
