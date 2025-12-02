<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import * as Table from "$lib/components/ui/table/index"; // Importar componentes visuales de tabla
  import {
    createSvelteTable,
    FlexRender,
  } from "$lib/components/ui/data-table/index";
  import { toast } from "svelte-sonner";

  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";

  let withdrawals = $state<any[]>([]);
  let serverUrl = $state<string>("");

  let page = $state<number>(1);
  let limit = 10;
  let itemsCount = $state<number>(0);
  let totalPages = $state<number>(1);

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

  // Definición de Columnas
  const columns: ColumnDef<Withdrawal>[] = [
    {
      accessorKey: "walletId",
      header: "Tienda (Wallet ID)",
      cell: ({ row }) => {
        const walletId = row.original.walletId as string;
        return walletId.substring(walletId.length - 8).toUpperCase();
      },
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount") as any);
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
        return `${name} (${type})`;
      },
    },
    {
      accessorKey: "bankAccountNumber",
      header: "Nro. Cuenta",
      cell: ({ row }) => {
        return row.original.bankAccountNumber || "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return status.toUpperCase();
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
  ];

  // Configuración de la Tabla
  const table = createSvelteTable({
    get data() {
      return withdrawals;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  async function fetchWithdrawalHistory() {
    try {
      if (!serverUrl) await getServerUrl();
      if (!serverUrl) return;

      const response = await fetch(
        `${serverUrl}/wallet/withdrawals/history?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const { data, meta } = await response.json();

      withdrawals = data || [];

      itemsCount = meta.itemCount || 0;
      totalPages = meta.pageCount || 1;
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      toast.error("Error al cargar el historial de retiros.");
    }
  }

  // FUNCIONES DE PAGINACIÓN
  function goToPreviousPage() {
    if (page > 1) {
      page -= 1;
      fetchWithdrawalHistory();
    }
  }

  function goToNextPage() {
    if (page < totalPages) {
      page += 1;
      fetchWithdrawalHistory();
    }
  }

  $effect(() => {
    fetchWithdrawalHistory();
  });
</script>

<div class="flex justify-between h-20 m-5 py-6">
  <h2 class="text-xl font-semibold dark:text-gray-200">
    Historial de Retiros (Completados y Rechazados)
  </h2>
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
          <Table.Row
            data-state={row.getIsSelected() && "selected"}
            class="border-[#353535]"
          >
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
            No hay resultados en el historial.
          </Table.Cell>
        </Table.Row>
      {/if}
    </Table.Body>
  </Table.Root>
</div>

<div class="flex justify-between items-center px-5 mx-5 mt-4 mb-8">
  <div class="text-sm text-gray-500 dark:text-gray-400">
    <span class="font-semibold">{itemsCount ?? 0}</span> solicitudes en
    total.

    <span class="ml-4">
      Página <span class="font-semibold">{page}</span> de
      <span class="font-semibold">{totalPages}</span>
    </span>
  </div>

  <div class="space-x-2">
    <Button
      variant="outline"
      size="sm"
      onclick={goToPreviousPage}
      disabled={page <= 1}
    >
      Anterior
    </Button>

    <Button
      variant="outline"
      size="sm"
      onclick={goToNextPage}
      disabled={page >= totalPages}
    >
      Siguiente
    </Button>
  </div>
</div>
