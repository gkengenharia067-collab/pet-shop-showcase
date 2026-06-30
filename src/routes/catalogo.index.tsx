import { createFileRoute, Link } from "@tanstack/react-router";
import { PawPrint, MapPin, ShieldCheck, Truck, Plus, ArrowLeft, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CartDrawer } from "@/components/CartDrawer";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/catalogo/")({
  component: CatalogoPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80";
const FALLBACK_CAPA =
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=2000&q=80";

function getFazenda() {
  try {
    const saved = localStorage.getItem("@mr/fazenda");
    return saved
      ? JSON.parse(saved)
      : { nome: "PetMania", cidade: "Campo Grande - MS", descricao: "", whatsapp: "", logo: "", capa: "" };
  } catch {
    return { nome: "PetMania", cidade: "Campo Grande - MS", descricao: "", whatsapp: "", logo: "", capa: "" };
  }
}

function getShortDescription(categoria: string) {
  const map: Record<string, string> = {
    "Ração": "Alimentação completa e balanceada para seu pet.",
    "Brinquedos": "Diversão e estímulo para seu animal.",
    "Acessórios": "Tudo o que seu pet precisa no dia a dia.",
    "Higiene": "Cuidados e limpeza para o bem-estar.",
    "Medicamentos": "Saúde e prevenção para seu companheiro.",
    "Roupas": "Estilo e conforto para todas as estações.",
    "Casinhas": "Conforto e segurança para o descanso.",
    "Petiscos": "Recompensas saborosas e saudáveis.",
    "Coleiras e Guias": "Segurança e estilo nos passeios.",
    "Transporte": "Mobilidade segura para seu pet.",
  };
  return map[categoria] || "Produto para seu pet com qualidade e cuidado.";
}

function CatalogoPage() {
  const { produtos, addToCart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => setMounted(true), []);

  const fazenda = getFazenda();

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {fazenda.logo ? (
              <img src={fazenda.logo} alt="Logo" className="h-9 w-9 rounded-xl object-cover" />
            ) : (
              <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <PawPrint className="size-5" />
              </div>
            )}
            <div className="font-display font-bold text-xl text-foreground tracking-tight">
              {fazenda.nome}
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Voltar ao painel
            </Link>
            <Link to="/catalogo" className="text-primary font-semibold">
              Início
            </Link>
            <Link to="/catalogo" className="hover:text-foreground transition-colors">
              Produtos
            </Link>
            <a href="#sobre" className="hover:text-foreground transition-colors">
              Sobre a Loja
            </a>
            <a
              href={`https://wa.me/55${fazenda.whatsapp || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Contato
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {menuAberto && (
          <div className="sm:hidden bg-card border-t border-border p-4 flex flex-col gap-3 text-sm font-medium">
            <Link to="/" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>
              Voltar ao painel
            </Link>
            <Link to="/catalogo" className="text-primary font-semibold" onClick={() => setMenuAberto(false)}>
              Início
            </Link>
            <Link to="/catalogo" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>
              Produtos
            </Link>
            <a href="#sobre" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>
              Sobre a Loja
            </a>
            <a
              href={`https://wa.me/55${fazenda.whatsapp || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              onClick={() => setMenuAberto(false)}
            >
              Contato
            </a>
          </div>
        )}
      </header>

      {/* CAPA */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden">
        <img
          src={fazenda.capa || FALLBACK_CAPA}
          alt="Capa da loja"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* INFORMAÇÕES DA LOJA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="flex items-end gap-4 flex-wrap">
          {fazenda.logo ? (
            <img
              src={fazenda.logo}
              alt="Logo"
              className="w-24 h-24 rounded-2xl border-4 border-background object-cover bg-card shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl border-4 border-background bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <PawPrint className="size-12" />
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                {fazenda.nome}
              </h1>
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <ShieldCheck className="size-3" />
                Loja Verificada
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {fazenda.descricao || "Tudo para o seu pet com qualidade e preço justo. Entrega rápida e atendimento especializado."}
            </p>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {fazenda.cidade || "Campo Grande - MS"}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-4" />
                Produtos Autênticos
              </span>
              <span className="flex items-center gap-1">
                <Truck className="size-4" />
                Entrega Rápida
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE PRODUTOS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Nossos Produtos</h2>
          <button
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
          >
            <ShoppingBag className="size-5" />
            Sacola
          </button>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhum produto disponível no momento.</p>
            <p className="text-sm">Volte em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <Link to={`/catalogo/${produto.id}`} className="block">
                  <img
                    src={produto.imagem || FALLBACK_IMG}
                    alt={produto.nome}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/catalogo/${produto.id}`}>
                    <h3 className="font-bold text-foreground hover:text-primary transition-colors">
                      {produto.nome}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {getShortDescription(produto.categoria)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-display font-bold text-primary">
                      {formatBRL(produto.preco)}
                    </span>
                    <button
                      onClick={() => addToCart(produto)}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-sm"
                    >
                      + Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FloatingWhatsApp />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
