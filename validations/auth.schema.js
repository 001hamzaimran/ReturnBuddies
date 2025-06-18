
import z from 'zod'

const authSchema = z.object({
    name: z.string({required_error:"Name is required"}).min(3, "Name must be at least 3 characters long"),
    email: z.string({required_error:"Email is required"}).email("Invalid email address"),
    password: z.string({required_error:"Password is required"}).min(8, "Password must be at least 8 characters long")
});
const loginSchema = z.object({
    email: z.string({required_error:"Email is required"}).email("Invalid email address"),
    password: z.string({required_error:"Password is required"})
});
const EmailSchema_validation = z.object({
    email: z.string({required_error:"Email is required"}).email("Invalid email address"),
    otp: z.string({required_error:"OTP is required"}).min(4, "OTP must be at least 4 characters long")
});

export {
    authSchema,
    EmailSchema_validation,
    loginSchema
};
