export function isRealtimeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_REALTIME === "true";
}

export function isEmailDeliveryConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}
