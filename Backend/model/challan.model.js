import mongoose from "mongoose";

const productDetailSchema = new mongoose.Schema({
  quantity: { type: Number},
  shadeNumber: { type: String },
});

const productSchema = new mongoose.Schema({
  productName: { type: String},
  details: [productDetailSchema],
});

const challanSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    address: { type: String },
    mobile: { type: String },
    date: { type: String },
    driverName: { type: String },
    challanNumber: { type: String },
    products: [productSchema],
    totalQuantity: { type: Number },
    totalRollQty: { type: Number },
    basicAmount: { type: Number },
    GSTNumber: { type: Number },
    reciverName: { type: String },
    totalWeight: { type: String },
    totalBags: { type: Number },
    totalPrice: { type: Number },
    totalAmount: { type: Number, default: 0 },
    tCSOrFARE: { type: Number },
    invoiceNumber: { type: Number },
    price1:{type: Number},
    price2:{type: Number },
    price3:{type: Number },
  },
  { timestamps: true }
);

challanSchema.pre("save", async function (next) {
  if (
    this.isModified("GSTNumber") ||
    this.isModified("tCSOrFARE") ||
    this.isModified("basicAmount")
  ) {
    this.totalAmount = this.basicAmount + this.tCSOrFARE + this.GSTNumber;
    next();
  } else {
    next();
  }
});

export const Challan = mongoose.model("Challan", challanSchema);
