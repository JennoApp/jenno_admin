<script lang="ts">
  import "../app.css";
  import "iconify-icon";

  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/appSidebar.svelte";

  let { children } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <main class="w-full">
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
