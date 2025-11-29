<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Ellipsis } from "lucide-svelte";

  // Props recibidas desde la definición de columnas
  let { id, status, onUpdateStatus } = $props();

  async function handleStatusChange(newStatus: string) {
    // Aquí llamas a tu función para actualizar el estado
    await onUpdateStatus(id, newStatus);
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
        <Button {...props} variant="ghost" size="icon" class="relative h-8 w-8 p-0">
        <span class="sr-only">Abrir menú</span>
        <Ellipsis class="h-4 w-4" />
        </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Acciones</DropdownMenu.Label>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
        Copiar ID
      </DropdownMenu.Item>
      <DropdownMenu.Separator />

      {#if status === 'pending'}
        <DropdownMenu.Item onclick={() => handleStatusChange("completed")}>
            Marcar como Completado
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => handleStatusChange("rejected")} class="text-red-500">
            Rechazar Solicitud
        </DropdownMenu.Item>
      {/if}

    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>


