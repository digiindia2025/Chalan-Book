import mongoose from "mongoose";
import { Challan } from "../model/challan.model.js";
import { Client } from "../model/client.model.js";

const createChallan = async (req, res) => {
  try {
    const {
      clientId,
      address,
      mobile,
      date,
      driverName,
      challanNumber,
      products,
      totalQuantity,
      totalRollQty,
      basicAmount,
      GSTNumber,
      reciverName,
      totalWeight,
      totalBags,
      tCSOrFARE,
      totalPrice,
      totalAmount,
      invoiceNumber,
      price1,
      price2,
      price3
    } = req.body;


    // if (
    //   [
    //     clientId,
    //     address,
    //     mobile,
    //     date,
    //     driverName,
    //     challanNumber,
    //     products,
    //     totalRollQty,
    //     basicAmount,
    //     reciverName,
    //     totalWeight,
    //     totalBags,
    //     totalPrice,
    //     invoiceNumber,
    //     totalAmount
    //   ].some((field) => !field)
    // ) {
    //   return res.status(400).json({
    //     message: "All fields are required",
    //   });
    // }

    // if(GSTNumber===""){
    //   return res.status(400).json({
    //     message: "GST Number is required",
    //   });
    // }
    // if(tCSOrFARE===""){
    //   return res.status(400).json({
    //     message: "tCSOrFARE is required",
    //   });
    // }

    // if (!Array.isArray(products) || products.length === 0) {
    //   return res.status(400).json({
    //     message: "Invalid product data. Must be a non-empty array",
    //   });
    // }

    // for (const product of products) {
    //   if (
    //     !product.productName ||
    //     !Array.isArray(product.details) ||
    //     product.details.length === 0
    //   ) {
    //     return res.status(400).json({
    //       message:
    //         "Each product must have a productName and valid details array",
    //     });
    //   }

    //   for (const detail of product.details) {
    //     if (
    //       typeof detail.quantity !== "number"
    //     ) {
    //       return res.status(400).json({
    //         message:
    //           "Each product detail must have valid quantity",
    //       });
    //     }
    //   }
    // }

    if (!mongoose.isValidObjectId(clientId)) {
      return res.status(400).json({ message: "Invalid client ID" });
    }
    const isClientExists = await Client.findById(clientId);
    if (!isClientExists) {
      return res.status(400).json({
        Error: "client doesn't exists",
      });
    }

    const createdChallan = await Challan.create({
      name: isClientExists?._id,
      address,
      mobile,
      date,
      driverName,
      challanNumber,
      products,
      totalQuantity,
      totalRollQty,
      totalAmount,
      totalPrice,
      basicAmount,
      GSTNumber,
      reciverName,
      totalWeight,
      totalBags,
      tCSOrFARE,
      invoiceNumber,
      price1,
      price2,
      price3
    });

    if (!createdChallan) {
      return res
        .status(500)
        .json({ message: "Error occurred while creating challan" });
    }

    isClientExists?.challan.push(createdChallan?._id);
    await isClientExists.save();
    return res.status(201).json({
      message: "Challan created successfully",
      challan: createdChallan,
    });
  } catch (error) {
    console.log("Create challan error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getChallanDetails = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id).populate("products name");
    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }
    return res.status(200).json({ challan });
  } catch (error) {
    console.log("Get challan details error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllChallan = async (req, res) => {
  try {
    const challans = await Challan.find().populate("products name").sort({ createdAt: -1 });
    return res.status(200).json({ challans });
    // nitin
  } catch (error) {
    console.log("Get all challan error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteChallan = async (req, res) => {
  try {
    const deletedChallan = await Challan.findByIdAndDelete(req.params.id);
    if (!deletedChallan) {
      return res.status(404).json({ message: "Challan not found" });
    }
    return res.status(200).json({ message: "Challan deleted successfully" });
  } catch (error) {
    console.log("Delete challan error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateChallan = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, products } = req.body;

    const allowedFields = [
      "name",
      "address",
      "mobile",
      "totalPrice",
      "date",
      "driverName",
      "challanNumber",
      "products",
      "totalQuantity",
      "totalRollQty",
      "basicAmount",
      "GSTNumber",
      "reciverName",
      "totalWeight",
      "totalBags",
      "tCSOrFARE",
      "invoiceNumber",
      "totalAmount",
      "price1",
      "price2",
      "price3"
    ];
    const updateFields = Object.keys(req.body);
    const invalidFields = updateFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(", ")} These fields are not allowed`,
      });
    }

    const challan =await Challan.findById(id);
    if (!challan) {
      return res.status(400).json({
        Error: "challan doesn't exists",
      });
    }

    if (name) {
      if (!mongoose.isValidObjectId(name)) {
        return res.status(400).json({
          Error: "Invalid name Id",
        });
      }

      const isClientExists = await Client.findById(name);
      if (!isClientExists) {
        return res.status(400).json({
          Error: "client doesn't exists",
        });
      }

      const newClient=new mongoose.Types.ObjectId(name)

      if (!challan?.name.equals( newClient) ) {
       
        const PrevClient = await Client.findById(challan?.name);
        if (
            PrevClient.challan.length > 0 && 
            PrevClient.challan.some(id => id.equals(challan._id))
        ) {
     await PrevClient.challan.pull(challan?._id);
        }
        await PrevClient.save();
        if(!isClientExists.challan.some((id)=> id.equals(challan?._id))){
            await isClientExists.challan.push(challan?._id);
            await isClientExists.save();
        }
      }
    }

    // if (products) {
    //   if (!Array.isArray(products) || products.length === 0) {
    //     return res.status(400).json({
    //       message: "Invalid product data. Must be a non-empty array",
    //     });
    //   }

    //   for (const product of products) {
    //     if (
    //       !product.productName ||
    //       !Array.isArray(product.details) ||
    //       product.details.length === 0
    //     ) {
    //       return res.status(400).json({
    //         message:
    //           "Each product must have a productName and valid details array",
    //       });
    //     }

    //     for (const detail of product.details) {
    //       if (
    //         typeof detail.quantity !== "number"
    //       ) {
    //         return res.status(400).json({
    //           message:
    //             "Each product detail must have valid quantity and shadeNumber",
    //         });
    //       }
    //     }
    //   }
    // }

    const updatedChallan = await Challan.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedChallan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    return res.status(200).json({
      message: "Challan updated successfully",
      challan: updatedChallan,
    });
  } catch (error) {
    console.log("Update challan error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const ChallanLength=async(req,res)=>{
try {
  const challanlength = await Challan.countDocuments();
  let count = `${challanlength ===0 ? "0" : ""}${challanlength + 1}`
  return res.status(200).json({
    count,
  });
} catch (error) {
  console.log("challan length error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
}
}
export {
  createChallan,
  getChallanDetails,
  getAllChallan,
  DeleteChallan,
  UpdateChallan,
  ChallanLength
};
