import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function EstadoOffline() {
  const [conectado, setConectado] = useState(navigator.onLine);
  const [preparado, setPreparado] = useState(false);
  const [error, setError] = useState(false);
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_url, registro) {
      if (registro?.active && "caches" in window) {
        caches.match(`${import.meta.env.BASE_URL}index.html`, { ignoreSearch: true })
          .then((respuesta) => setPreparado(Boolean(respuesta)))
          .catch(() => setError(true));
      }
    },
    onRegisterError() {
      setError(true);
    },
  });

  useEffect(() => {
    const cambiar = () => setConectado(navigator.onLine);
    window.addEventListener("online", cambiar);
    window.addEventListener("offline", cambiar);
    return () => {
      window.removeEventListener("online", cambiar);
      window.removeEventListener("offline", cambiar);
    };
  }, []);

  const disponible = offlineReady || preparado;

  return (
    <aside className="offline-info" aria-label="Estado de la herramienta">
      <p role="status">
        {import.meta.env.DEV
          ? "Modo de desarrollo: prueba el uso sin conexión con npm run build y npm run preview."
          : error || !("serviceWorker" in navigator)
            ? "No se pudo preparar el modo sin conexión. Vuelve a abrir con internet."
            : disponible
              ? "Lista para usar sin conexión."
              : "Preparando el modo sin conexión. Mantén esta página abierta con internet."}
      </p>
      {!conectado && <p>Sin conexión. Puedes llenar, generar y copiar; envía tu bitácora cuando vuelva internet.</p>}
      {needRefresh && <p>Hay una actualización disponible. Cuando termines, cierra todas las ventanas de TrejoTech y vuelve a abrir.</p>}
    </aside>
  );
}
