import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const number = "5567999222720";
  const message = "Olá, encontrei os produtos da Fazenda Boa Terra e gostaria de saber mais.";
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
