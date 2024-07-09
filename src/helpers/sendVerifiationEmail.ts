import { error } from 'console';
import { verifySchema } from './../schemas/verifySchema';
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        console.log("email",email)
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'My Project | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "verification email send successfully." }


    } catch (error) {
        console.error("error sending verificai=tion emial", error);
        return { success: false, message: "Faild to send verification email." }
    }
}
