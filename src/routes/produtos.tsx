import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Camera } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useStore, type Produto } from "@/lib/store";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Meus Produtos — PetMania" },
      { name: "description", content: "Gerencie os produtos da sua loja PetMania." },
    ],
  }),
  component: ProdutosPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ===== CATEGORIAS PARA PET SHOP =====
const CATEGORIAS = [
  "Ração",
  "Brinquedos",
  "Acessórios",
  "Higiene",
  "Medicamentos",
  "Roupas",
  "Casinhas",
  "Petiscos",
  "Coleiras e Guias",
  "Transporte",
];

// ===== IMAGENS DE EXEMPLO PARA PET SHOP =====
const galeriaImagens: { nome: string; url: string }[] = [
  {
    nome: "Ração Premium",
    url: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80",
  },
  {
    nome: "Brinquedo Interativo",
    url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
  },
  {
    nome: "Cama Confortável",
    url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80",
  },
  {
    nome: "Coleira Antipulgas",
    url: "https://images.unsplash.com/photo-1556742049-0a3f6ec3e33f?w=800&q=80",
  },
  {
    nome: "Shampoo Hipoalergênico",
    url: "https://images.unsplash.com/photo-1583947215251-f0b2c6e85019?w=800&q=80",
  },
  {
    nome: "Petisco Natural",
    url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
  },
  {
    nome: "Casinha Pet",
    url: "https://images.unsplash.com/photo-1583509141647-6b5d70a7df54?w=800&q=80",
  },
  {
    nome: "Roupa para Cães",
    url: "https://images.unsplash.com/photo-1551739440-5e3e7d6ff8e3?w=800&q=80",
  },
];

type FormState = {
  nome: string;
  preco: string;
  estoque: string;
  unidade: string;
  categoria: string;
  imagem: string;
};

const emptyForm: FormState = {
  nome: "",
  preco: "",
  estoque: "",
  unidade: "un",
  categoria: CATEGORIAS[0],
  imagem: "",
};

function ProdutosPage() {
  const { produtos, addProduto, updateProduto, deleteProduto } = useStore();
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  function abrirModal(produto?: Produto) {
    if (produto) {
      setEditandoId(produto.id);
      setForm({
        nome: produto.nome,
        preco: String(produto.preco),
        estoque: String(produto.estoque || 0),
        unidade: produto.unidade || "un",
        categoria: produto.categoria || CATEGORIAS[0],
        imagem: produto.imagem || "",
      });
    } else {
      setEditandoId(null);
      setForm(emptyForm);
    }
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const preco = parseFloat(form.preco.replace(",", "."));
    const estoque = parseInt(form.estoque) || 0;

    if (!form.nome || isNaN(preco) || preco <= 0) {
      alert("Preencha o nome e o preço corretamente.");
      return;
    }

    const dados = {
      nome: form.nome,
      preco,
      estoque,
      unidade: form.unidade,
      categoria: form.categoria,
      imagem: form.imagem || galeriaImagens[0].url,
    };

    if (editandoId) {
      updateProduto(editandoId, dados);
    } else {
      addProduto(dados);
    }
    fecharModal();
  }

  function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduto(id);
    }
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Meus Produtos
          </h1>
          <button
            onClick={() => abrirModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="size-5" />
            Novo Produto
          </button>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhum produto cadastrado ainda.</p>
            <p className="text-sm">Clique em "Novo Produto" para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={p.imagem || galeriaImagens[0].url}
                  alt={p.nome}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h3 className="font-bold text-foreground">{p.nome}</h3>
                <p className="text-sm text-muted-foreground">{p.categoria}</p>
                <p className="text-lg font-bold text-primary mt-1">
                  {formatBRL(p.preco)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Estoque: {p.estoque || 0} {p.unidade || "un"}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => abrirModal(p)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-border rounded-xl hover:bg-muted transition-all text-sm"
                  >
                    <Pencil className="size-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm"
                  >
                    <Trash2 className="size-4" />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 border border-border shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold text-foreground">
                {editandoId ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button
                onClick={fecharModal}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nome do produto *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                  placeholder="Ex: Ração Premium para Cães"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="text"
                  value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Estoque
                </label>
                <input
                  type="number"
                  value={form.estoque}
                  onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                  className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Unidade
                </label>
                <input
                  type="text"
                  value={form.unidade}
                  onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                  className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                  placeholder="kg, un, g, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Categoria
                </label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                >
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  URL da imagem
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.imagem}
                    onChange={(e) => setForm({ ...form, imagem: e.target.value })}
                    className="flex-1 border border-border rounded-xl bg-background px-4 py-3 outline-none focus:border-primary"
                    placeholder="https://... ou deixe vazio para usar uma de exemplo"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {galeriaImagens.slice(0, 6).map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setForm({ ...form, imagem: img.url })}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        form.imagem === img.url
                          ? "border-primary"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.nome}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
                >
                  {editandoId ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
