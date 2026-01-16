import dbConnect from "@/lib/dbconnect";
import UserModel from "@/app/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../../../helpers/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ check username
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    // ✅ check email
    const existingEmail = await UserModel.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    let user;

    if (existingEmail) {
      if (existingEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email already registered" },
          { status: 400 }
        );
      }

      // update unverified user
      existingEmail.password = hashedPassword;
      existingEmail.verifyCode = verifyCode;
      existingEmail.verifyCodeExpiry = expiryDate;
      existingEmail.username = username;

      user = await existingEmail.save();
    } else {
      user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        message: [],
      });
    }

    console.log("User saved:", user._id);

    // ✅ send email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      console.error("Email failed:", emailResponse.message);

      return Response.json(
        { success: false, message: "User created but email failed" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Verification email sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
