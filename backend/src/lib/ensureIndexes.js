import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Facility from "@/models/Facility";
import Booking from "@/models/Booking";

export async function ensureIndexes() {
  await dbConnect();
  await User.ensureIndexes();
  await Facility.ensureIndexes();
  await Booking.ensureIndexes();
}
