import { verifySchema } from './../../../schemas/verifySchema';
import { error } from 'console';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerifiationEmail";


export async function POST(request: Request) {

    await dbConnect()
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerifiesd: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"

                }, {
                status: 400
            })
        }
        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exists with this emal'
                }, { status: 400 })

            } else {
                const hashpassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashpassword;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }


        } else {
            const hashpassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashpassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }
        // send verification email
        const emailresponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailresponse.success) {
            return Response.json({
                success: false,
                message: emailresponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "Usr Register successfully please verify your email"
        }, { status: 201 })

    } catch (error) {
        console.error("error registring user", error);
        return Response.json(
            {
                success: false,
                message: "Error regstring user",
            },
            {
                status: 500
            }
        )
    }
}