import mailchimp from "@mailchimp/mailchimp_marketing";
import { NextResponse } from "next/server";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "L'adresse e-mail est requise." }, 
        { status: 400 }
      );
    }

    const res = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!, 
      {
        email_address: email,
        status: "subscribed",
      }
    );

    return NextResponse.json(
      { message: "Inscription réussie !" }, 
      { status: 201 }
    );
  } catch(error: any) {
    console.error("Erreur Mailchimp:", error);
    
    if (error.status === 400) {
      return NextResponse.json(
        { error: "Cette adresse e-mail est déjà inscrite ou invalide." }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur lors de l'inscription. Veuillez réessayer." }, 
      { status: 500 }
    );
  }
}