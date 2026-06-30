import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, PawPrint, MapPin, ShieldCheck, Truck, ChevronRight, Info, Plus, Minus, ShoppingBag, CheckCircle2, Menu, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CartDrawer } from "@/components/CartDrawer";

export const Route = createFileRoute("/catalogo/$id")({
  component: ProdutoDetalhesPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200&q=80";

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

function getFullDescription(nome: string, categoria: string) {
  const map: Record<string, string> = {
    "Ração Premium para Cães 10kg":
      "Ração completa e balanceada para cães de todas as raças. Fórmula com proteínas de alta qualidade, vitaminas e minerais essenciais para a saúde do seu pet.",
    "Petisco Saudável para Gatos":
      "Petisco natural e saboroso, perfeito para agradar seu felino. Livre de corantes e conservantes artificiais.",
    "Cama Confortável para Cães":
      "Cama macia e acolchoada, ideal para o descanso do seu cão. Disponível em diversos tamanhos e cores.",
    "Coleira Antipulgas":
      "Coleira eficaz contra pulgas e carrapatos, com proteção de longa duração. Segura para cães e gatos.",
    "Shampoo Hipoalergênico":
      "Shampoo suave e hipoalergênico, indicado para pets com pele sensível. pH balanceado e fragrância suave.",
    "Brinquedo Interativo para Cães":
      "Brinquedo divertido que estimula a mente e o instinto natural do seu cão. Perfeito para gastar energia.",
  };
  return map[nome] || `Produto de alta qualidade para o seu pet, da categoria ${categoria.toLowerCase()}. Ideal para quem cuida com carinho.`;
}

function ProdutoDetalhesPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { produtos, addToCart, cart } = useStore();
  const produto = produtos.find((p) => p.id === id);
  const fazenda = getFazenda();
  const [menuAberto, setMenuAberto] = useState(false);

  const goBackToCatalogo = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/catalogo" });
    }
  };

  const [qtd, setQtd] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const itemNoCarrinho = cart.find((c) => c.id === id);

  if (!produto) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Produto não encontrado.</p>
          <Link to="/catalogo" className="text-primary hover:underline mt-2 inline-block">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qtd; i++) {
      addToCart(produto);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
            <button onClick={goBackToCatalogo} className="hover:text-foreground transition-colors cursor-pointer">
              Voltar
            </button>
            <Link to="/catalogo" className="hover:text-foreground transition-colors">
              Catálogo
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Painel
            </Link>
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
            <button onClick={() => { goBackToCatalogo(); setMenuAberto(false); }} className="text-left hover:text-foreground transition-colors">
              Voltar
            </button>
            <Link to="/catalogo" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>
              Catálogo
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>
              Painel
            </Link>
          </div>
        )}
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Imagem */}
          <div className="lg:w-1/2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm sticky top-24">
              <img
                src={produto.imagem || FALLBACK_IMG}
                alt={produto.nome}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Detalhes */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <span className="inline-block text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full mb-2">
                {produto.categoria || "Pet"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                {produto.nome}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-display font-bold text-primary">
                {formatBRL(produto.preco)}
              </span>
              {itemNoCarrinho && (
                <span className="text-sm text-muted-foreground">
                  ({itemNoCarrinho.quantidade} no carrinho)
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {getFullDescription(produto.nome, produto.categoria || "pet")}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQtd(Math.max(1, qtd - 1))}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Minus className="size-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                  {qtd}
                </span>
                <button
                  onClick={() => setQtd(qtd + 1)}
                  className="px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="size-5" />
                    Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-5" />
                    Adicionar à sacola
                  </>
                )}
              </button>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="size-5 text-green-600" />
                <span>Produto original com garantia de qualidade</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="size-5 text-blue-600" />
                <span>Entrega rápida e segura para todo o Brasil</span>
              </div>
            </div>

            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              Voltar ao catálogo
            </Link>
          </div>
        </div>
      </main>

      <FloatingWhatsApp />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
