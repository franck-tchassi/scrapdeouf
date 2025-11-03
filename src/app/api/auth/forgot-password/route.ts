import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { redis } from "@/lib/redis";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "L'adresse email est requise." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, we don't reveal if the email exists or not.
      // We still send a success message but don't send an email.
      console.warn(`Forgot password request for non-existent email: ${email}`);
      return NextResponse.json(
        { message: "Si cet email existe, un code de vérification a été envoyé." },
        { status: 200 }
      );
    }

    if (!redis) {
      console.error("Redis client is not initialized.");
      return NextResponse.json(
        { message: "Service de réinitialisation de mot de passe indisponible." },
        { status: 500 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    const otpExpirationSeconds = 10 * 60; // 10 minutes

    // Store OTP in Redis with an expiration
    await redis.setex(otpKey, otpExpirationSeconds, otp);

    // Send OTP to user's email
    const subject = "Votre code de réinitialisation de mot de passe Scrapdeouf";
    const text = `Votre code de vérification pour réinitialiser votre mot de passe est : ${otp}. Ce code est valide pendant 10 minutes.`;
    const  html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fc; padding: 40px 0;">
      <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #eee;">
          <img src="https://scrapdeouf.com/s-logo.png" alt="Scrapdeouf" width="70" height="70" style="margin-bottom: 10px;">
          <h1 style="font-size: 20px; color: #2a2a2a; margin: 0;">L’équipe <span style="color: #6c63ff; font-weight: 700;">Scrapdeouf</span></h1>
        </div>
  
        <!-- Body -->
        <div style="padding: 30px 40px;">
          <p style="font-size: 16px; color: #333;">Bonjour 👋,</p>
  
          <p style="font-size: 15px; color: #444; line-height: 1.6;">
            Vous avez demandé à réinitialiser votre mot de passe pour votre compte <strong>Scrapdeouf</strong>.
            <br><br>
            Voici votre code de vérification :
          </p>
  
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background: #6c63ff; color: #fff; font-size: 28px; letter-spacing: 6px; padding: 14px 28px; border-radius: 8px; font-weight: bold;">
              ${otp}
            </span>
          </div>
  
          <p style="font-size: 14px; color: #666;">
            ⏱ Ce code est valide pendant <strong>10 minutes</strong>.
          </p>
  
          <p style="font-size: 14px; color: #888; margin-top: 30px;">
            Si vous n’avez pas demandé cette réinitialisation, ignorez simplement cet e-mail.  
          </p>
  
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
          <p style="font-size: 13px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} Scrapdeouf — Tous droits réservés.<br>
            L’équipe Scrapdeouf ❤️
          </p>
        </div>
      </div>
    </div>
  `;
  

    await sendEmail(email, subject, text, html);

    return NextResponse.json(
      { message: "Un code de vérification a été envoyé à votre adresse email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la demande de réinitialisation." },
      { status: 500 }
    );
  }
}