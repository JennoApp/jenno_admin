<script lang="ts">
  import { enhance } from "$app/forms";
  import { form } from "$app/server";

  let errorMessage = $state<string>("");

  $effect(() => {
    if (form?.errorMessage) {
      errorMessage = form.errorMessage;
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center">
  <form
    method="POST"
    action="?/login"
    use:enhance
    class="bg-[#202020] p-6 rounded-lg shadow-md w-80 space-y-4"
  >
    <h1 class="text-xl font-semibold text-center">Jenno Admin</h1>

    {#if errorMessage}
      <p class="text-red-600 text-sm">{errorMessage}</p>
    {/if}

    <input
      name="email"
      type="email"
      placeholder="Email"
      class="w-full text-black border rounded px-3 py-2"
      required
    />

    <input
      name="password"
      type="password"
      placeholder="Contraseña"
      class="w-full text-black border rounded px-3 py-2"
      required
    />

    <button
      type="submit"
      class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Entrar
    </button>
  </form>
</div>
