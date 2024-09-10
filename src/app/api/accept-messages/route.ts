import { error } from 'console';
import { authOptions } from "@/app/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(resuest: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not aAuthenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessages } = await resuest.json()
    try {


        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user staus to accept"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "message acceptence status updated successfully",
            updatedUser
        }, { status: 200 })

    } catch (error) {
        console.log("failed to update user staus to accept", error)
        return Response.json({
            success: false,
            message: "failed to update user staus to accept"
        }, { status: 500 })
    }
}


export async function GET(requesr: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not aAuthenticated"
        }, { status: 401 })
    }

    const userId = user._id;


    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "User not found",
            isAcceptingmessages: foundUser.isAcceptingMessage,
        }, { status: 200 })

    } catch (error) {
        console.log("failed to get user", error)
        return Response.json({
            success: false,
            message: "Error in getting message acceptence"
        }, { status: 500 })
    }

}