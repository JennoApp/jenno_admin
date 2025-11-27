import { json } from '@sveltejs/kit'

export async function POST({ cookies }) {

  const cookieOptions = {
    path: '/',
  }

  cookies.delete('session', cookieOptions)

  return json({
    status: 'success'
  })
}
