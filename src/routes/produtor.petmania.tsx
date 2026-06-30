import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ShieldCheck, Star, CalendarDays, ThumbsUp, MessageSquare, ArrowLeft, PawPrint, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/produtor/petmania")({
  component: ProdutorPerfilPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80";

function getFazenda() {
  try {
    const saved = localStorage.getItem('@mr/fazenda');
    return saved ? JSON.parse(saved) : { 
      nome: 'PetMania', 
      telefone: '', 
      cidade: 'Campo Grande - MS', 
      descricao: '', 
      whatsapp: '',
      logo: '',
      capa: ''
    };
  } catch {
    return { 
      nome: 'PetMania', 
      telefone: '', 
      cidade: 'Campo Grande - MS', 
      descricao: '', 
      whatsapp: '',
      logo: '',
      capa: ''
    };
  }
}

function ProdutorPerfilPage() {
  const { produtos } = useStore();
  const [produtosLocal, setProdutosLocal] = useState<Produto[]>([]);
  const [mounted, setMounted] = useState(false);
  const fazenda = getFazenda();

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('@mr/produtos.v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProdutosLocal(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Erro ao carregar produtos do localStorage:", e);
    }
    setProdutosLocal(produtos);
  }, [produtos]);

  const produtosExibir = mounted ? produtosLocal : [];

  if (!produtosExibir || produtosExibir.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/catalogo" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
              <ArrowLeft className="size-4" />
              Voltar ao Catálogo
            </Link>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <PawPrint className="size-4" />
              </div>
              <div className="font-display font-semibold text-lg text-foreground tracking-tight">{fazenda.nome}</div>
            </div>
          </div>
        </header>
        <div className="h-64 md:h-80 w-full overflow-hidden bg-muted">
          <img src={fazenda.capa || "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=2000&q=80"} alt="Capa da Loja" className="w-full h-full object-cover opacity-90" />
        </div>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
          <div className="text-center text-muted-foreground">Carregando produtos...</div>
        </main>
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/catalogo" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium text-sm">
            <ArrowLeft className="size-4" />
            Voltar ao Catálogo
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
              <PawPrint className="size-4" />
            </div>
            <div className="font-display font-semibold text-lg text-foreground tracking-tight">{fazenda.nome}</div>
          </div>
        </div>
      </header>

      <div className="relative bg-card border-b border-border">
        <div className="h-64 md:h-80 w-full overflow-hidden bg-muted">
          <img 
            src={fazenda.capa || "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=2000&q=80"} 
            alt="Capa da Loja" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 -mt-20 md:-mt-24 relative z-10 mb-6">
            <img 
              src={fazenda.logo || "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop&q=80"} 
              alt="Logo da Loja"
              className="size-36 md:size-48 rounded-3xl border-4 border-background shadow-xl object-cover bg-muted"
            />
            <div className="flex-1 pb-2 mt-4 md:mt-0">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="size-4" />
                Loja Verificada
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                {fazenda.nome}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-3 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-5 text-primary" /> {fazenda.cidade || "Campo Grande - MS"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-5" /> Na plataforma desde 2024
                </span>
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star className="size-5 fill-yellow-500" />
                  <span className="text-foreground font-bold">4.9</span>
                  <span className="text-muted-foreground font-normal">(128 avaliações)</span>
                </span>
              </div>
            </div>
            <div className="md:pb-4 flex w-full md:w-auto mt-4 md:mt-0">
              <Link to="/catalogo" className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm">
                Ver todos os produtos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">Nossa História</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{fazenda.descricao || "A PetMania nasceu da paixão por animais e do desejo de oferecer produtos de qualidade para quem cuida com carinho. Nossa missão é proporcionar o melhor para os pets, com atendimento especializado e produtos selecionados."}</p>
              <p>Estamos no mercado desde 2024, oferecendo rações, petiscos, acessórios e muito mais. Nossa equipe está sempre pronta para ajudar você a escolher o melhor para o seu companheiro.</p>
              <p>Acreditamos que o cuidado com os pets reflete o cuidado com a vida. Por isso, trabalhamos apenas com marcas confiáveis e produtos que realmente fazem a diferença.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="size-6 text-primary" /> O que os clientes dizem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex text-yellow-500 mb-3">
                  <Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" />
                </div>
                <p className="text-foreground italic mb-4">"Ração de excelente qualidade! Meu cachorro adorou e a entrega foi super rápida. Recomendo a todos."</p>
                <div className="text-sm text-muted-foreground font-medium flex items-center justify-between">
                  <span>Mariana Costa</span>
                  <span className="flex items-center gap-1 text-primary"><ThumbsUp className="size-3" /> Recomenda</span>
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex text-yellow-500 mb-3">
                  <Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" /><Star className="size-4 fill-yellow-500" />
                </div>
                <p className="text-foreground italic mb-4">"A melhor loja de pets que já comprei! Produtos de qualidade e atendimento excelente. Meus gatos amaram os petiscos."</p>
                <div className="text-sm text-muted-foreground font-medium flex items-center justify-between">
                  <span>Carlos Almeida</span>
                  <span className="flex items-center gap-1 text-primary"><ThumbsUp className="size-3" /> Recomenda</span>
                </div>
              </div>
            </div>
          </section>

          <section id="produtos" className="pt-4">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Produtos Disponíveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {produtosExibir.map((p) => (
                <Link
                  key={p.id}
                  to="/catalogo/$id"
                  params={{ id: p.id }}
                  className="group flex gap-4 bg-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="size-24 rounded-xl overflow-hidden shrink-0 bg-muted">
                    <img
                      src={p.imagem || FALLBACK_IMG}
                      alt={p.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{p.nome}</h3>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider my-1">{p.categoria}</div>
                    <div className="font-display font-bold text-primary text-lg">
                      {formatBRL(p.preco)} <span className="text-sm text-muted-foreground font-normal">/ {p.unidade}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/catalogo" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-border text-foreground font-bold hover:bg-muted transition-colors">
                Explorar catálogo completo da PetMania
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
            <h3 className="font-bold text-foreground text-lg mb-4">Informações da Loja</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <Truck className="size-5 text-primary shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Entregas Rápidas</div>
                  <div className="text-muted-foreground mt-0.5">Entregamos todos os dias úteis na região metropolitana.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-primary shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Produtos Autênticos</div>
                  <div className="text-muted-foreground mt-0.5">Trabalhamos apenas com marcas confiáveis e originais.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <PawPrint className="size-5 text-primary shrink-0" />
                <div>
                  <div className="font-semibold text-foreground">Atendimento Especializado</div>
                  <div className="text-muted-foreground mt-0.5">Nossa equipe está pronta para ajudar você a escolher o melhor para seu pet.</div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </main>
      <FloatingWhatsApp />
    </div>
  );
}