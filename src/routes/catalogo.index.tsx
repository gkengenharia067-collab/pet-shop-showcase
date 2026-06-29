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

const FALLBACK_IMG = "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80";
const FALLBACK_CAPA = "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=2000&q=80";

function getFazenda() {
  try {
    const saved = localStorage.getItem('@mr/fazenda');
    return saved ? JSON.parse(saved) : { 
      nome: 'PetMania', 
      cidade: 'Campo Grande - MS', 
      descricao: '', 
      whatsapp: '',
      logo: '',
      capa: ''
    };
  } catch {
    return { 
      nome: 'PetMania', 
      cidade: 'Campo Grande - MS', 
      descricao: '', 
      whatsapp: '',
      logo: '',
      capa: ''
    };
  }
}

function getShortDescription(categoria: string) {
  const map: Record<string, string> = {
    "Cães": "Produtos de alta qualidade para cães.",
    "Gatos": "O melhor para o seu felino.",
    "Aves": "Acessórios e alimentação para aves.",
    "Peixes": "Aquários, rações e acessórios.",
    "Roedores": "Pequenos animais, grande carinho.",
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
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {fazenda.logo ? (
              <img src={fazenda.logo} alt="Logo" className="h-9 w-auto object-contain" />
            ) : (
              <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <PawPrint className="size-5" />
              </div>
            )}
            <div className="font-display font-bold text-xl text-foreground tracking-tight">{fazenda.nome}</div>
          </div>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-all">
              <ArrowLeft className="size-4" />
              Voltar ao painel
            </Link>
            <Link to="/catalogo" className="text-primary font-semibold">Início</Link>
            <a href="#produtos" className="hover:text-foreground cursor-pointer transition-colors">Produtos</a>
            <Link to="/produtor/fazenda-boa-terra" className="hover:text-foreground cursor-pointer transition-colors">Sobre a Loja</Link>
            <a href="#contato" className="hover:text-foreground cursor-pointer transition-colors">Contato</a>
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
            <Link to="/" className="flex items-center gap-2 text-primary font-semibold" onClick={() => setMenuAberto(false)}>
              <ArrowLeft className="size-4" />
              Voltar ao painel
            </Link>
            <Link to="/catalogo" className="text-primary font-semibold" onClick={() => setMenuAberto(false)}>Início</Link>
            <a href="#produtos" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>Produtos</a>
            <Link to="/produtor/fazenda-boa-terra" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>Sobre a Loja</Link>
            <a href="#contato" className="hover:text-foreground transition-colors" onClick={() => setMenuAberto(false)}>Contato</a>
          </div>
        )}
      </header>

      <CartDrawer onOpenChange={setCartOpen} />

      <main>
        {/* Hero Section */}
        <section className="relative bg-card border-b border-border overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={fazenda.capa || FALLBACK_CAPA} 
              alt="Capa da loja" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              Loja Verificada
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
              {fazenda.nome}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {fazenda.descricao || "Tudo para o seu pet com qualidade e preço justo. Entrega rápida e atendimento especializado."}
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm text-foreground font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                {fazenda.cidade || "Campo Grande - MS"}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Produtos Autênticos
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-5 text-primary" />
                Entrega Rápida
              </div>
            </div>

            <div className="mt-10">
              <Link 
                to="/produtor/fazenda-boa-terra"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Conhecer a Loja
              </Link>
            </div>
          </div>
        </section>

        <section id="produtos" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Nossos Produtos</h2>
              <p className="text-muted-foreground mt-2">Qualidade que seu pet merece.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {mounted && produtos.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 bg-muted overflow-hidden">
                  <img 
                    src={p.imagem || FALLBACK_IMG} 
                    alt={p.nome} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.estoque === 0 && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                        Esgotado
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                      {p.categoria}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {p.nome}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {getShortDescription(p.categoria)}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-end gap-1 mb-4">
                      <span className="text-2xl font-display font-bold text-primary">
                        {formatBRL(p.preco)}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium mb-1">
                        / {p.unidade}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to="/catalogo/$id"
                        params={{ id: p.id }}
                        className="flex-1 inline-flex items-center justify-center px-3 py-3 rounded-xl font-semibold border border-border hover:bg-muted transition-all text-sm"
                      >
                        Detalhes
                      </Link>
                      <button
                        type="button"
                        disabled={p.estoque === 0}
                        onClick={() => addToCart(p, 1)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl font-semibold transition-all text-sm ${
                          p.estoque > 0
                            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm hover:shadow-md"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        <Plus className="size-4" />
                        {p.estoque > 0 ? "Sacola" : "Indisponível"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contato" className="bg-card border-t border-border mt-10 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Entre em Contato</h2>
              <p className="text-muted-foreground mt-2">Fale diretamente com a loja para dúvidas ou encomendas especiais.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a href={`https://wa.me/55${fazenda.whatsapp || '67999222720'}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center p-8 rounded-3xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer">
                <div className="size-14 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">WhatsApp</h3>
                <p className="text-muted-foreground">{fazenda.whatsapp ? `+55 ${fazenda.whatsapp}` : '+55 67 99922-2720'}</p>
                <p className="text-sm text-[#25D366] font-medium mt-2">Respostas em até 2 horas</p>
              </a>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-muted/30 border border-border">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <MapPin className="size-7" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">Localização</h3>
                <p className="text-muted-foreground">{fazenda.cidade || "Campo Grande - MS"}</p>
                <p className="text-sm text-muted-foreground mt-2">Av. Principal, 123</p>
              </div>

              <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-muted/30 border border-border">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="font-bold text-lg text-foreground mb-1">Atendimento</h3>
                <p className="text-muted-foreground">Segunda a Sexta: 08h às 18h</p>
                <p className="text-sm text-muted-foreground mt-2">Sábados: 08h às 12h</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {!cartOpen && <FloatingWhatsApp />}
    </div>
  );
}
