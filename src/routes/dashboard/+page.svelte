<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { onMount } from "svelte";

    let totalTiendas = $state<number | null>(null);
    let totalUsuarios = $state<number | null>(null);

    const fetchCounts = async () => {
        try {
            // Total de tiendas
            const resBusiness = await fetch('api/users/countByAccountType?accountType=business');
            const { count: countTiendas } = await resBusiness.json();
            totalTiendas = countTiendas;


            const resPersonal = await fetch('api/users/countByAccountType?accountType=personal');
            const { count: countPersonal }= await resPersonal.json();
            totalUsuarios = countPersonal;

        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    }


    onMount(async () => {
        await fetchCounts();
    })
</script>


<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 m-5">

	<!-- Total de tiendas -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Total de tiendas</Card.Title>
			<Card.Description>Cantidad de tiendas</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-3xl font-bold">
        {totalTiendas ?? 'Cargando...'}
      </p>
		</Card.Content>
	</Card.Root>

  <!-- Total de tiendas -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Total de usuarios</Card.Title>
			<Card.Description>Cantidad de usuarios</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-3xl font-bold">
        {totalUsuarios ?? 'Cargando...'}
      </p>
		</Card.Content>
	</Card.Root>

	<!-- Total de ventas -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Total de ventas</Card.Title>
			<Card.Description>Transacciones completadas</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-3xl font-bold">3,452</p>
		</Card.Content>
	</Card.Root>

	<!-- GMV (valor bruto) -->
	<Card.Root>
		<Card.Header>
			<Card.Title>GMV (Total)</Card.Title>
			<Card.Description>Ingresos generados por vendedores</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-3xl font-bold">$ 89,540,000</p>
		</Card.Content>
	</Card.Root>

	<!-- Ganancias de Jenno -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Ganancias de Jenno</Card.Title>
			<Card.Description>10% del GMV total</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-3xl font-bold">$ 8,954,000</p>
		</Card.Content>
	</Card.Root>

</div>


