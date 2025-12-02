// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session'); // Asegúrate del nombre correcto

  // Rutas
  const isLoginRoute = event.url.pathname === '/';
  const isProtectedRoute = event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/admin');

  if (token) {
    // Aquí podrías decodificar el JWT simple para obtener info básica
    // O simplemente asumir que es válido por ahora.

    // Guardamos la info en locals para usarla en +page.server.ts o +layout.server.ts
    event.locals.user = { token }; // Puedes guardar más datos aquí si decodificas el JWT
  }

  //Lógica de Redirección

  // Si estoy en Login y tengo usuario -> Dashboard
  if (isLoginRoute && event.locals.user) {
    throw redirect(303, '/dashboard');
  }

  // Si voy a Dashboard y NO tengo usuario -> Login
  if (isProtectedRoute && !event.locals.user) {
    throw redirect(303, '/');
  }

  return await resolve(event);
};
