/**
 * Helper to send messages via Fonnte WhatsApp/SMS API
 * @param target Formatted international phone number (e.g. 628xxx)
 * @param message Message body to send
 */
export async function sendWhatsApp(
  target: string,
  message: string
): Promise<{ success: boolean; mocked: boolean; code?: string }> {
  const fonnteToken = process.env.FONNTE_TOKEN;

  // Check if token is configured. Fallback to mock for local testing/demo convenience.
  if (!fonnteToken || fonnteToken === "your_fonnte_token_here") {
    console.warn(
      `[FONNTE MOCK] To: ${target} | Message: ${message}`
    );
    
    // Extract OTP code if present in the message for demo helper
    const codeMatch = message.match(/\b\d{6}\b/);
    const code = codeMatch ? codeMatch[0] : undefined;

    return {
      success: true,
      mocked: true,
      code,
    };
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: fonnteToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target,
        message,
      }),
    });

    const resJson = await response.json();
    if (!response.ok || !resJson.status) {
      throw new Error(resJson.reason || "Fonnte API returned failure status");
    }

    return {
      success: true,
      mocked: false,
    };
  } catch (err: any) {
    console.error("[FONNTE ERROR]:", err);
    throw new Error(
      `Gagal mengirim pesan WhatsApp ke ${target}: ${err.message || "Provider error"}`
    );
  }
}
