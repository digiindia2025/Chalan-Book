import { Challan } from "../model/challan.model.js";
import { Client } from "../model/client.model.js";

const createClient = async (req, res) => {
  try {
    const { company, name, phoneNumber, whatsappNumber, Address, GSTNumber } =
      req.body;

    if (
      [company, name, phoneNumber, whatsappNumber, Address, GSTNumber].some(
        (field) => !field
      )
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const client = new Client({
      company,
      name,
      phoneNumber,
      whatsappNumber,
      Address,
      GSTNumber,
    });

    await client.save();

    return res.status(200).json({
      message: "Client created successfully",
    });
  } catch (error) {
    console.log("created client error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getClientDetails = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("challan");
    if (!client) {
      return res.status(400).json({
        message: "Client doesn't exits",
      });
    }
    return res.status(200).json({
      client,
    });
  } catch (error) {
    console.log("get client error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllClient = async (req, res) => {
  try {
    const client = await Client.find().populate({path:"challan",populate:{path:"name",select:"name"}});
    return res.status(200).json({
      client,
    });
  } catch (error) {
    console.log("get client error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "client deleted successfully",
    });
  } catch (error) {
    console.log("get client error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const UpdateClient = async (req, res) => {
  const allowedFields = [
    "company",
    "name",
    "phoneNumber",
    "whatsappNumber",
    "Address",
    "GSTNumber",
    "challan",
  ];

  try {
    const {Address,phoneNumber,challan} = req.body
    const updateFields = Object.keys(req.body);
    const invalidFields = updateFields.filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(", ")}`
      });
    }
const client = await Client.findById(req.params.id)

  const updatedClient=  await Client.findByIdAndUpdate(req.params.id, req.body,{new:true});
    if(!updatedClient){
      return res.status(400).json({
        message:"Client doesn't exits"
      })
    }


if( Address && Address!==client.Address || phoneNumber && phoneNumber !== client.phoneNumber){ 
  await Challan.findOneAndUpdate({name:req.params.id},{mobile:phoneNumber,address:Address},{new:true})
}
   
    return res.status(200).json({
      message: "client updated successfully",
    });
  } catch (error) {
    console.log("get client error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createClient,
  getClientDetails,
  getAllClient,
  DeleteClient,
  UpdateClient,
};
