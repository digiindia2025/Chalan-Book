import jwt from "jsonwebtoken";
export const VerifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    
    if(!decodedToken?.isAdmin){
      return res.status(400).json({
        message: "Unauthorized Access",
      });
    }
    req.user = {
      _id: decodedToken?.id,
      isAdmin: decodedToken?.isAdmin,
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
