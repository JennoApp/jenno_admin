import { json } from "@sveltejs/kit";
import { PRIVATE_SERVER_URL } from '$env/static/private'

export async function GET({ url }) {
	try {
		const accountType = url.searchParams.get("accountType");

		if (!accountType) {
			return json({ error: "Missing accountType" }, { status: 400 });
		}

		// Llama al backend de NestJS
		const response = await fetch(
			`${PRIVATE_SERVER_URL}/users/count/ByAccountType?accountType=${accountType}`
		);

		if (!response.ok) {
			return json({ error: "Backend error" }, { status: response.status });
		}

		const data = await response.json();
		return json(data)

	} catch (error) {
		console.error("Error in countByAccountType endpoint:", error);
		return json({ error: "Internal server error" }, { status: 500 });
	}
}
