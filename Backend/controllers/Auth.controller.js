import { User } from "../model/user.model.js";

const SignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }
    const user = await User.create({ username, email, password });

    if (!user) {
      return res.status(400).json({
        message: "User not created",
      });
    }
    return res.status(200).json({
      message: "User created Successfull",
    });

  } catch (error) {
    console.log("signup error", error);
    return res.status(500).json({
      message: "sign created error",
    });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
 
  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    return res.status(400).json({
      message: "User doesn't exists",
    });
  }

  if (!isUserExists.isAdmin) {
    return res.status(400).json({
      message: "Unauthorized Access",
    });
  }

  const isPasswordMatched = await isUserExists.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(400).json({
      message: "Either email or password is incorrect",
    });
  }

  const token = isUserExists.generateAuthToken();

  return res.status(200).json({
    message: "Login Successfully",
    token,
    email
  });
};


export { SignUp, Login };
