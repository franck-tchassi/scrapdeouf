// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "email_password_required", message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "invalid_credentials", message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (!user.hashedPassword) {
      return NextResponse.json(
        { error: "no_password_set", message: "Veuillez utiliser la méthode de connexion originale" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "invalid_credentials", message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Créer une session avec NextAuth
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: name,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "server_error", message: "Erreur serveur lors de la connexion" },
      { status: 500 }
    );
  }
}