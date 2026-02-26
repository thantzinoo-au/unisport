import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Snooker", "Football", "Badminton"],
      required: true,
    },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Active", "Maintenance"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Facility ||
  mongoose.model("Facility", facilitySchema);
