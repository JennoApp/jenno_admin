import { json } from "@sveltejs/kit";
import { PRIVATE_SERVER_URL } from '$env/static/private';

export async function GET() {
	try {
		// Llama al backend NestJS
		const response = await fetch(`${PRIVATE_SERVER_URL}/orders/count/completed`);

		if (!response.ok) {
			return json({ error: "Backend error" }, { status: response.status });
		}

		const data = await response.json();
		return json(data);

	} catch (error) {
		console.error("Error in count completed orders endpoint:", error);
		return json({ error: "Internal server error" }, { status: 500 });
	}
}
