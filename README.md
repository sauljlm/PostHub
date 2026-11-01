# PostHub

Frontend de PostHub, desarrollado con React y Create React App.

## Desarrollo local

Requiere Node.js 22.

```sh
npm ci
npm run dev
```

La aplicación abre en `http://localhost:3000` y usa `http://localhost:8080` como API local. Para usar otra API, crea `.env.local` con `REACT_APP_API_URL=https://tu-api.example.com` y reinicia el servidor.

## Producción y Railway

```sh
npm ci
npm run build
npm start
```

`npm start` sirve los archivos compilados de `build` con soporte para las rutas de React Router. Escucha en `0.0.0.0` y usa el puerto `PORT` asignado por Railway, o `3000` por defecto. El servidor de desarrollo se ejecuta con `npm run dev`.

`railway.json` configura la compilación, el arranque y la comprobación HTTP de disponibilidad. El servicio `PostHub` de Railway está conectado a la rama `master` de este repositorio.

En producción, la API predeterminada es `https://posthub-server.up.railway.app`. Puedes cambiarla definiendo `REACT_APP_API_URL` en las variables de Railway **antes de compilar**. Estas variables se incorporan al JavaScript del navegador; no deben contener secretos. Después de cambiarlas, vuelve a desplegar para generar una nueva compilación.

No uses `localhost` como API de producción: apuntaría al equipo del visitante. El backend se administra por separado en el repositorio `PostHub-Server`.
