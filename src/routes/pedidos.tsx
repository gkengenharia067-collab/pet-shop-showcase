import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore, type StatusPedido } from "@/lib/store";

export const Route = createFileRoute("/pedidos")({
  head: () => ({
    meta: [
      { title: "Pedidos — Terra Viva" },
      { name: "description", content: "Acompanhe os pedidos dos seus clientes." },
    ],
  }),
  component: PedidosPage,
});

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function PedidosPage() {
  const { pedidos, alterarStatusPedido } = useStore();
  const pendentes = pedidos.filter((p) => p.status === "Pendente").length;
  const entregues = pedidos.length - pendentes;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold">Pedidos</h1>
        <p className="text-muted-foreground mt-2">
          {pendentes} pendente{pendentes === 1 ? "" : "s"} · {entregues} entregue{entregues === 1 ? "" : "s"}
        </p>
      </div>

      {/* Tabela desktop */}
      <div className="hidden md:block rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/60 text-sm text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Produto</th>
              <th className="px-5 py-3 font-medium">Quantidade</th>
              <th className="px-5 py-3 font-medium">Valor</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p, i) => (
              <tr key={p.id} className={i !== 0 ? "border-t border-border" : ""}>
                <td className="px-5 py-4 font-medium">
                  <div>{p.cliente}</div>
                  {p.whatsapp && <div className="text-xs text-muted-foreground mt-0.5">WhatsApp: {p.whatsapp}</div>}
                  {p.observacao && <div className="text-xs text-muted-foreground mt-0.5 italic">"{p.observacao}"</div>}
                </td>
                <td className="px-5 py-4">{p.produto}</td>
                <td className="px-5 py-4">{p.quantidade}</td>
                <td className="px-5 py-4 font-semibold">{formatBRL(p.valor)}</td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4 text-right">
                  <select
                    value={p.status}
                    onChange={(e) => alterarStatusPedido(p.id, e.target.value as StatusPedido)}
                    className="border border-border rounded-lg bg-background text-sm px-2 py-1.5 focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Pendente">Mover para Pendente</option>
                    <option value="Em preparação">Em preparação</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden space-y-3">
        {pedidos.map((p) => (
          <div key={p.id} className="rounded-2xl bg-card border border-border p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{p.cliente}</div>
                <div className="text-sm text-muted-foreground">{p.data}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            {p.whatsapp && <div className="text-sm text-muted-foreground mt-1">WhatsApp: {p.whatsapp}</div>}
            {p.observacao && <div className="text-sm text-muted-foreground mt-1 italic">"{p.observacao}"</div>}
            
            <div className="mt-3 text-sm border-t border-border pt-3">
              <div><span className="text-muted-foreground">Produto:</span> {p.produto}</div>
              <div><span className="text-muted-foreground">Qtd:</span> {p.quantidade}</div>
              <div className="mt-1 text-lg font-semibold text-primary">{formatBRL(p.valor)}</div>
            </div>
            
            <div className="mt-4">
              <select
                value={p.status}
                onChange={(e) => alterarStatusPedido(p.id, e.target.value as StatusPedido)}
                className="w-full border border-border rounded-lg bg-background text-sm px-3 py-2.5 focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="Pendente">Marcar como Pendente</option>
                <option value="Em preparação">Marcar como Em preparação</option>
                <option value="Entregue">Marcar como Entregue</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: StatusPedido }) {
  const cls =
    status === "Entregue"
      ? "bg-green-100 text-green-800 border-green-200"
      : status === "Em preparação"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  return (
    <span className={"inline-block text-xs font-semibold px-2.5 py-1 rounded-full border " + cls}>
      {status}
    </span>
  );
}
