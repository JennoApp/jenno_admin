<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index";
  import * as Table from "$lib/components/ui/table/index"; // Importar componentes visuales de tabla
  import {
    createSvelteTable,
    renderComponent,
    FlexRender,
  } from "$lib/components/ui/data-table/index";

  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";

  import DataTableActions from "./DataTableActions.svelte";

  let withdrawals = $state<any[]>([]);
  let metaInfo = $state<any>();
  let serverUrl = $state<string>("");

  let page = 1;
  let limit = 10;

  // Obtener url del servidor
  async function getServerUrl() {
    try {
      const response = await fetch(`/api/server`);
      const data = await response.json();

      serverUrl = data.server_url;
    } catch (error) {
      console.error("Error al solicitar Url del servidor");
    }
  }

  type Withdrawal = {
    withdrawalId: string;
    walletId: string;
    amount: number;
    status: "pending" | "completed" | "rejected";
    requestDate: string;

    // Información bancaria adjunta
    bankAccountName: string;
    bankAccountNumber: string;
    bankAccountType: string;
  };

  // 1. Definición de Columnas
  const columns: ColumnDef<Withdrawal>[] = [
    {
      accessorKey: "walletId",
      header: "Tienda (Wallet ID)",
      cell: ({ row }) => {
        // Muestra solo el final del ID de la Wallet como identificador de la tienda
        const walletId = row.original.walletId as string;
        return walletId.substring(walletId.length - 8).toUpperCase();
      },
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount") as any);
        // Formatear a moneda
        return new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }).format(amount);
      },
    },
    {
      accessorKey: "bankAccountName",
      header: "Bank Info (Titular & Tipo)",
      cell: ({ row }) => {
        const name = row.original.bankAccountName || "N/A";
        const type = row.original.bankAccountType || "";
        // Combina el nombre del titular y el tipo de banco
        return `${name} (${type})`;
      },
    },
    {
      accessorKey: "bankAccountNumber",
      header: "Nro. Cuenta",
      cell: ({ row }) => {
        // Muestra el número de cuenta bancaria
        return row.original.bankAccountNumber || "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return status.toUpperCase();
        // Si necesitas el span con color, crea un StatusBadge.svelte y usa renderComponent(StatusBadge, { status: status })
      },
    },
    {
      accessorKey: "requestDate",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(row.getValue("requestDate")).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Acciones",
      cell: ({ row }) => {
        // Renderizamos el componente de acciones pasando el withdrawalId
        return renderComponent(DataTableActions, {
          id: row.original.withdrawalId, // <-- CAMBIO CLAVE: USAR withdrawalId
          status: row.original.status,
          onUpdateStatus: changeWithdrawalStatus, // Pasamos la función del padre
        });
      },
    },
  ];

  // 2. Configuración de la Tabla (Svelte 5 + TanStack)
  const table = createSvelteTable({
    get data() {
      return withdrawals;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  async function fetchPendingWithdrawals() {
    try {
      if (!serverUrl) await getServerUrl();
      if (!serverUrl) return;

      const response = await fetch(
        `${serverUrl}/wallet/withdrawals/pending?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const { data, meta } = await response.json();

      console.log("Respuesta API Withdrawals:", data);

      // Reemplazamos los datos o los propagamos
      withdrawals = data || [];
      metaInfo = meta || {};
    } catch (error) {
      console.error("Error fetching pending withdrawals:", error);
    }
  }

  async function changeWithdrawalStatus(id: string, newStatus: string) {
    try {
      if (!serverUrl) await getServerUrl();

      const response = await fetch(
        `${serverUrl}/wallet/withdrawals/${id}/status`,
        {
          method: "PATCH", // O PUT, depende de tu backend
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        await fetchPendingWithdrawals();

        alert("Estado actualizado correctamente");
      } else {
        console.error("Error al actualizar estado");
      }
    } catch (e) {
      console.error(e);
    }
  }

  $effect(() => {
    fetchPendingWithdrawals();
  });

  $inspect(withdrawals, metaInfo);
</script>

<div class="flex justify-between h-20 m-5 py-6">
  <h2 class="text-xl font-semibold dark:text-gray-200">Retiros Pendientes</h2>
  <Button variant="secondary" onclick={() => goto("/admin/sales/history")}>
    <iconify-icon icon="material-symbols:history" class=""> </iconify-icon>
    Historial
  </Button>
</div>

<div class="px-5 mx-5 border border-[#353535] rounded-md">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row class="border-[#353535]">
          {#each headerGroup.headers as header (header.id)}
            <Table.Head class="text-gray-200 border-[#353535]">
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header}
                  context={header.getContext()}
                />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#if table.getRowModel().rows?.length}
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && "selected"} class="border-[#353535]">
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell class="text-gray-300">
                <FlexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {/each}
      {:else}
        <Table.Row class="border-[#353535]">
          <Table.Cell colspan={columns.length} class="h-24 text-center">
            No hay resultados.
          </Table.Cell>
        </Table.Row>
      {/if}
    </Table.Body>
  </Table.Root>
</div>
