import type { Actions } from './$types'
import { PRIVATE_SERVER_URL } from '$env/static/private'
import { redirect } from '@sveltejs/kit'

export const actions: Actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData()
    const email = data.get('email')
    const password = data.get('password')

    const response = await fetch(`${PRIVATE_SERVER_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        errorMessage: result.message ?? 'Credenciales inválidas'
      }
    }

    cookies.set('session', result.acces_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 45
    })

    throw redirect(303, '/dashboard');
  }
}
