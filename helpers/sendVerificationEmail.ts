import {resend} from '../src/lib/resend'
import {EmailTemplate} from '../emails/VerificationEmail'
import { ApiResponse } from '../src/types/ApiResponse'
import { getMaxListeners } from 'events';
export async function sendVerificationEmail(email: string, username: string, otp: string):Promise<ApiResponse> {
    try {
          const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['riyaaggarwal2204@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ username: username,otp:otp }),
    });

    

    return {success:true,message:"Successfully send Verification email"}
    } catch (error) {
        console.error('Error sending verification email',error)
        return {success:false,message:"Failed to send Verification email"}
    }

}