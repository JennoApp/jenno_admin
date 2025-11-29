<script lang="ts">
  import House from "@lucide/svelte/icons/house";
  import Inbox from "@lucide/svelte/icons/inbox";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  // Menu items
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Solicitudes Retiros",
      url: "/withdrawals",
      icon: Inbox,
    },
  ];

  // logout function
  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      // Redirige a la pagina principal si la ruta actual es "restringida"
      const restrictedPaths = ["/dashboard", "/withdrawals"];
      const currentPath = page.url.pathname;

      if (restrictedPaths.some((path) => currentPath.startsWith(path))) {
        setTimeout(() => {
          goto("/", { replaceState: true }).then(() => {
            location.reload();
          });
        }, 100);
      } else {
        location.reload();
      }
    }
  };
</script>

<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Jenno Admin</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>

    <!-- Cerrar sesión -->
    <Sidebar.Group class="mt-auto">
      <Sidebar.GroupContent>
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded"
          onclick={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          🚪 Cerrar sesión
        </button>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
