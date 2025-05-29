<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button/index";
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import {
    FlexRender,
    createSvelteTable,
    renderComponent,
  } from "$lib/components/ui/data-table/index";

  const withdrawals: any[] = $state([]);
  const metaInfo: any = $state();

  let page = 1;
  let limit = 10;

  let serverUrl: string;

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

  async function fetchPendingWithdrawals() {
    try {
      if (!serverUrl) {
        await getServerUrl();
      }
      const response = await fetch(
        `${serverUrl}/wallet/withdrawals/pending?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      withdrawals.push(data.items);
      metaInfo.push(data.meta);
    } catch (error) {
      console.error("Error fetching pending withdrawals:", error);
    }
  }

  $effect(() => {
    fetchPendingWithdrawals();
  });


  $inspect(withdrawals, metaInfo);
</script>

<div class="flex justify-between w-full h-20 px-5 m-5 py-6 flex-shrink">
  <h2 class="text-xl font-semibold dark:text-gray-200">Ventas</h2>
  <Button
    class="bg-gray-200 dark:bg-[#252525] dark:hover:bg-[#353535] hover:bg-gray-300 text-black dark:text-gray-200"
    onclick={() => {
      goto("/admin/sales/history");
    }}
  >
    <iconify-icon
      icon="material-symbols:history"
      height="1.1rem"
      width="1.1rem"
      class="text-black dark:text-gray-200 flex justify-center items-center"
    ></iconify-icon>
    <span class="ml-3">Historial</span></Button
  >
</div>
