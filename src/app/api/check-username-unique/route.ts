import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {
    await dbConnect()

    // localhost:3000/api/checkuserunique?username=nk?phone=android
    try {

        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        console.log("searchParams", searchParams)

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log('resultQueryParams', result);
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError.length > 0 ? usernameError.join(', ') : 'invalid QUery parameters',
            }, { status: 400 })
        }

        const { username } = result.data;
        const existingVerifyUser = await UserModel.findOne({ username, isVerified: true })

        console.log("existingVerifyUser", existingVerifyUser)
        if (!existingVerifyUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }
        return Response.json({
            success: false,
            message: "Username is unique"
        }, { status: 201 })

    } catch (error) {
        console.error("Error cecking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {
            status: 500
        })
    }

}