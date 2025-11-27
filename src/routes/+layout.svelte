<script lang="ts">
  import "../app.css";
  import "iconify-icon";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/appSidebar.svelte";
  import { page } from "$app/state";

  let { children } = $props();

  const rutasExcluidas = ["/"];
</script>

{#if !rutasExcluidas.includes(page.url.pathname)}
  <Sidebar.Provider>
    <AppSidebar />
    <main class="w-full">
      <Sidebar.Trigger />
      {@render children?.()}
    </main>
  </Sidebar.Provider>
{:else}
  {@render children?.()}
{/if}
