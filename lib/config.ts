export const siteConfig = {
  name: "China2Ghana Motors",
  url: "https://china2ghana-motors.com",
  tagline: "China to Ghana. Driven by Trust.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233208284220",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "quotes@china2ghana-motors.com",
};

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
