import {resend} from '../src/lib/resend'
import {EmailTemplate} from '../emails/VerificationEmail.js'
import { ApiResponse } from '../src/types/ApiResponse'
export async function sendVerificationEmail(email: string, username: string, otp: string):Promise<ApiResponse> {
    try {
          const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Hello world',
      react: EmailTemplate({ username: username,otp:otp }),
    });

    

    return {success:true,message:"Successfully send Verification email"}
    } catch (error) {
        console.error('Error sending verification email',error)
        return {success:false,message:"Failed to send Verification email"}
    }

}