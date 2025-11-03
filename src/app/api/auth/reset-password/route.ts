import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { redis } from "@/lib/redis";
import bcrypt from "bcrypt";
import { validatePassword } from "@/lib/validation"; // Assuming you have this validation utility

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "Email, code OTP et nouveau mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (!redis) {
      console.error("Redis client is not initialized.");
      return NextResponse.json(
        { message: "Service de réinitialisation de mot de passe indisponible." },
        { status: 500 }
      );
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await redis.get(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      return NextResponse.json(
        { error: "invalid_otp", message: "Code OTP invalide ou expiré." },
        { status: 400 }
      );
    }

    // Validate the new password using your existing utility
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation) {
      return NextResponse.json(
        { error: "password_validation_failed", message: passwordValidation },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await prisma.user.update({
      where: { email },
      data: { hashedPassword },
    });

    // Delete the OTP from Redis after successful password reset
    await redis.del(otpKey);

    return NextResponse.json(
      { message: "Votre mot de passe a été réinitialisé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
}