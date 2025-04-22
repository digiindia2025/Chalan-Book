import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    name: { type: String, required: true},
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    Address: { type: String, required: true },
    GSTNumber: { type: String, required: true },
    challan: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challan" }],
  },
  { timestamps: true }
);

export const Client = mongoose.model("Client", clientSchema);
