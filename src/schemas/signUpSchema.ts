import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "Usrname must be atleast 2 characters")
    .max(20, "Usrname must be no more  20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    usernamae: usernameValidation,
    email: z.string().email({ message: "Invalid email addressed" }),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" })
    
})