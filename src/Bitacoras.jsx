import "./Bitacoras.css";
import { useRef, useState } from "react";

const tiposDeServicio = [
  "Instalación de fibra óptica",
  "Instalación de fibra óptica + TV",
  "Cambio a fibra óptica",
  "Alineación",
  "Cambio de ONU",
  "Visita técnica",
  "Retiro de equipos",
  "Corte de fibra óptica",
];

const titulos = [
  "INSTALACIÓN", "INSTALACIÓN F.O + TV", "CAMBIO A FO", "ALINEACIÓN",
  "CAMBIO DE ONU", "VISITA TÉCNICA", "RETIRO DE EQUIPOS", "CORTE DE F.O",
];

export function generarTexto(tipo, datos) {
  const valor = (nombre) => String(datos[nombre] ?? "").trim();
  const fecha = (nombre) => {
    const texto = valor(nombre);
    return /^\d{4}-\d{2}-\d{2}$/.test(texto)
      ? texto.split("-").reverse().join("/")
      : texto;
  };
  const lineas = [
    `BITÁCORA PARA ${titulos[tiposDeServicio.indexOf(tipo)] ?? tipo.toUpperCase()}`,
    `Fecha de solicitud: ${fecha("fechaSolicitud")}`,
    `Fecha de visita: ${fecha("fechaVisita")}`,
    "",
    `TIPO DE SERVICIO: ${tipo}`,
    `Hora de llegada: ${valor("horaLlegada")}`,
    `Hora de salida: ${valor("horaSalida")}`,
  ];
  const seccion = (titulo, campos) => {
    lineas.push("", titulo);
    campos.forEach(([nombre, etiqueta]) => lineas.push(`${etiqueta}: ${valor(nombre)}`));
  };
  const instalacion = tiposDeServicio.slice(0, 2).includes(tipo);
  const cambioFo = tipo === "Cambio a fibra óptica";
  const cambioOnu = tipo === "Cambio de ONU";
  const retiro = tipo === "Retiro de equipos";
  const alineacion = tipo === "Alineación";
  const corte = tipo === "Corte de fibra óptica";

  if (retiro) seccion("DATOS DE LA CANCELACIÓN", [
    ["napCancelacion", "Número de NAP"], ["etiquetaCancelacion", "Número de etiqueta"],
  ]);
  seccion("DATOS DEL CLIENTE", retiro ? [
    ["nombreCliente", "Nombre"], ["direccion", "Dirección"],
    ["coordenadas", "Coordenadas"], ["municipio", "Municipio"],
  ] : [
    ["nombreCliente", "Nombre"], ["coordenadas", "Coordenadas"],
    ["municipio", "Municipio"], ["direccion", "Dirección"], ["paquete", "Plan/Paquete"],
  ]);
  seccion(retiro ? "DATOS DEL TÉCNICO" : "DATOS DEL TÉCNICO/CUADRILLA", [
    ["tecnico", "Nombre"], ["vehiculo", "Vehículo"],
  ]);
  if (retiro) seccion("RETIRO", [
    ["materialRetirado", "Material retirado"], ["depuracionNap", "Depuración de NAP"],
  ]);
  if (cambioFo || cambioOnu) seccion("RETIRO", [
    ["equipoRetirado", "Equipo retirado"], ["materialesRetirados", "Materiales retirados"],
  ]);
  if (instalacion || cambioFo || cambioOnu) seccion(
    cambioOnu ? "DATOS DE LA ONU NUEVA" : "DATOS DE LA ONU",
    [["marcaOnu", "Marca"], ["numeroOnu", "No. de ONU"]],
  );
  if (instalacion || cambioFo) seccion("DATOS DE LA ACOMETIDA", [
    ["numeroNap", "No. de NAP"], ["etiqueta", "Etiqueta"],
    ["potenciaNap", "Potencia de NAP (dBm)"], ["potenciaCasa", "Potencia en la casa (dBm)"],
    ["puertosOcupados", "Puertos ocupados en NAP"],
    ["puertoAsignado", "Puerto asignado"], ["puertosDisponibles", "Puertos disponibles"],
  ]);
  if (tipo === "Instalación de fibra óptica") seccion("DATOS DE LA UNIFIBRA", [
    ["unifibraInicio", "Metraje de inicio FO"], ["unifibraFin", "Metraje de fin FO"],
    ["unifibraTotal", "Metraje total de FO"],
  ]);
  if (tipo === "Instalación de fibra óptica + TV") seccion("DATOS TV", [
    ["canalesAnalogicos", "Canales analógicos"], ["canalesDigitales", "Canales digitales"],
    ["pruebaDecodificador", "Se probó decodificador"],
  ]);
  if (alineacion) {
    seccion("DATOS DE LA ANTENA", [["tipoAntena", "Tipo de antena"]]);
    seccion("DATOS DE LA ALINEACIÓN", [
      ["alineacionInicial", "Alineación inicial (H y V)"],
      ["alineacionFinal", "Alineación final (H y V)"],
      ["capacityInicial", "Capacity inicial"], ["capacityFinal", "Capacity final"],
      ["ccqInicial", "CCQ inicial"], ["ccqFinal", "CCQ final"],
      ["velocidadNavegacion", "Velocidad de navegación"],
    ]);
  }
  if (instalacion || cambioFo || cambioOnu || alineacion) seccion("MATERIAL", [
    ["inicioFo", "Inicio FO"], ["finFo", "Fin FO"], ["totalFo", "Total de FO (metros)"],
    ["tensores", "Tensores"], ["rosetas", "Rosetas"], ["jumper", "Jumper APC/APC"],
    ["grapasFo", "Grapas FO"], ["grapasUtp", "Grapas UTP"],
    ...(cambioFo ? [] : [
      ["cableCoaxial", "Cable coaxial (metros)"], ["conectorCoaxial", "Conector coaxial"],
      ["miniNodo", "Mini nodo"],
    ]),
  ]);
  if (corte) lineas.push("", "MATERIAL", valor("materialCorte"));
  if (instalacion || cambioFo || cambioOnu || corte) {
    lineas.push("", "COSTOS");
    if (instalacion) lineas.push(
      `Instalación (${valor("formaPago")}): $ ${valor("costoInstalacion")}`,
      `Mensualidad: $ ${valor("mensualidad")}`,
    );
    lineas.push(`Total: $ ${valor("costoTotal")}`);
  }
  lineas.push("", "DESCRIPCIÓN Y/O ANOTACIONES EXTRAS", valor("anotaciones"));
  const evidencias = retiro
    ? "Fotos de visita al domicilio, NAP y evidencia de equipos retirados."
    : alineacion
      ? "Fotos de visita al domicilio, parámetros de alineación, ponchado en ambas puntas, tendido, instalación panorámica y prueba de velocidad."
      : corte
        ? "Fotos de visita al domicilio, inicio y fin de drop, tendido, instalación panorámica, prueba de velocidad, evidencia de provisión y captura de la parte de trabajo cerrada."
        : "Fotos de visita al domicilio, NAP, potencias en NAP y domicilio, puerto y etiqueta, inicio y fin de drop, tendido, instalación panorámica, prueba de velocidad, evidencia de provisión y captura de la parte de trabajo cerrada.";
  lineas.push("", "EVIDENCIAS POR ANEXAR", evidencias);
  return lineas.join("\n");
}

export default function Bitacoras() {
  const [tipo, setTipo] = useState("");
  const [texto, setTexto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const salidaRef = useRef(null);

  function invalidarTexto() {
    setTexto("");
    setMensaje("");
  }

  function generar(event) {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(event.currentTarget));
    setTexto(generarTexto(tipo, datos));
    setMensaje("Bitácora generada. Revisa el texto antes de copiarlo.");
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setMensaje("Bitácora copiada. Ya puedes pegarla en Telegram o WhatsApp.");
    } catch {
      salidaRef.current?.focus();
      salidaRef.current?.select();
      setMensaje("No se pudo copiar automáticamente. El texto está seleccionado: usa ⌘ + C, Ctrl + C o la opción Copiar del teléfono.");
    }
  }


  return (
    <section id="bitacoras" className="bitacoras-page">

      <p className="eyebrow">TREJOTECH · HERRAMIENTAS</p>

      <h2>Bitácoras de campo</h2>

      <p>
        Selecciona el servicio para comenzar tu bitácora.
      </p>

      <label htmlFor="tipo-servicio">
        Tipo de servicio
      </label>

      <select
        id="tipo-servicio"
        value={tipo}
        onChange={(event) => {
          setTipo(event.target.value);
          invalidarTexto();
        }}
      >
        <option value="">Selecciona una opción</option>

        {tiposDeServicio.map((servicio) => (
          <option key={servicio} value={servicio}>
            {servicio}
          </option>
        ))}
      </select>

      {tipo && (
        <div>
          <h2 className="bitacoras-service-title">{tipo}</h2>

          <form onSubmit={generar} onChange={invalidarTexto}>
            <label>
              Fecha de solicitud
              <input
                type="date"
                name="fechaSolicitud"
              />
            </label>

            <label>
              Fecha de visita
              <input
                type="date"
                name="fechaVisita"
              />
            </label>

            <label>
              Hora de llegada
              <input
                type="time"
                name="horaLlegada"
              />
            </label>

            <label>
              Hora de salida
              <input
                type="time"
                name="horaSalida"
              />
            </label>

            {tipo === "Retiro de equipos" && (
              <>
                <h3>Datos de la cancelación</h3>

                {[
                  ["napCancelacion", "Número de NAP"],
                  ["etiquetaCancelacion", "Número de etiqueta"],
                ].map(([nombre, etiqueta]) => (
                  <label key={nombre}>
                    {etiqueta}
                    <input
                      type="text"
                      name={nombre}
                    />
                  </label>
                ))}
              </>
            )}

            <h3>Datos del cliente</h3>

            <label>
              Nombre
              <input
                type="text"
                name="nombreCliente"
              />
            </label>

            <label>
              Coordenadas
              <input
                type="text"
                name="coordenadas"
                placeholder="Ejemplo: 20.377480, -99.647011"
              />
            </label>

            <label>
              Municipio
              <input
                type="text"
                name="municipio"
              />
            </label>

            <label>
              Dirección
              <textarea
                name="direccion"
                rows={3}
              />
            </label>

            {tipo !== "Retiro de equipos" && (
              <label>
                Plan / Paquete
                <input
                  type="text"
                  name="paquete"
                  placeholder="Ejemplo: 150 MB"
                />
              </label>
            )}

            <h3>Datos del técnico / cuadrilla</h3>

            <label>
              Nombre
              <input
                type="text"
                name="tecnico"
                placeholder="Ejemplo: Jhony / Heber"
              />
            </label>

            <label>
              Vehículo
              <input
                type="text"
                name="vehiculo"
                placeholder="Ejemplo: Spark / Green"
              />
            </label>

            {tipo === "Alineación" && (
              <>
                <h3>Datos de la antena</h3>

                <label>
                  Tipo de antena
                  <input
                    type="text"
                    name="tipoAntena"
                  />
                </label>

                <h3>Datos de la alineación</h3>

                {[
                  ["alineacionInicial", "Alineación inicial (H y V)"],
                  ["alineacionFinal", "Alineación final (H y V)"],
                  ["capacityInicial", "Capacity inicial"],
                  ["capacityFinal", "Capacity final"],
                  ["ccqInicial", "CCQ inicial"],
                  ["ccqFinal", "CCQ final"],
                  ["velocidadNavegacion", "Velocidad de navegación"],
                ].map(([nombre, etiqueta]) => (
                  <label key={nombre}>
                    {etiqueta}
                    <input
                      type="text"
                      name={nombre}
                    />
                  </label>
                ))}
              </>
            )}

            {tipo === "Retiro de equipos" && (
              <>
                <h3>Retiro</h3>

                <label>
                  Material retirado
                  <textarea
                    name="materialRetirado"
                    rows={3}
                  />
                </label>

                <label>
                  Depuración de NAP
                  <textarea
                    name="depuracionNap"
                    rows={3}
                    placeholder="Describe la depuración realizada."
                  />
                </label>
              </>
            )}

            {[
              "Cambio a fibra óptica",
              "Cambio de ONU",
            ].includes(tipo) && (
              <>
                <h3>Retiro</h3>

                <label>
                  Equipo retirado
                  <textarea
                    name="equipoRetirado"
                    rows={2}
                    placeholder={
                      tipo === "Cambio a fibra óptica"
                        ? "Antena, POE, mástil..."
                        : "Marca y número de la ONU retirada..."
                    }
                  />
                </label>

                <label>
                  Materiales retirados
                  <textarea
                    name="materialesRetirados"
                    rows={2}
                    placeholder="Describe los materiales retirados."
                  />
                </label>
              </>
            )}

            {[
              "Instalación de fibra óptica",
              "Instalación de fibra óptica + TV",
              "Cambio a fibra óptica",
              "Cambio de ONU",
            ].includes(tipo) && (
              <>
                <h3>
                  {tipo === "Cambio de ONU"
                    ? "Datos de la ONU nueva"
                    : "Datos de la ONU"}
                </h3>

                <label>
                  Marca
                  <input
                    type="text"
                    name="marcaOnu"
                    placeholder="Marca de la ONU"
                  />
                </label>

                <label>
                  No. de ONU
                  <input
                    type="text"
                    name="numeroOnu"
                    placeholder="Número de la ONU"
                  />
                </label>
              </>
            )}
            {[
              "Instalación de fibra óptica",
              "Instalación de fibra óptica + TV",
              "Cambio a fibra óptica",
            ].includes(tipo) && (
              <>
                <h3>Datos de la acometida</h3>

                {[
                  ["numeroNap", "No. de NAP"],
                  ["etiqueta", "Etiqueta"],
                  ["potenciaNap", "Potencia de NAP (dBm)"],
                  ["potenciaCasa", "Potencia en la casa (dBm)"],
                  ["puertosOcupados", "Puertos ocupados en NAP"],
                  ["puertoAsignado", "Puerto asignado"],
                  ["puertosDisponibles", "Puertos disponibles"],
                ].map(([nombre, etiqueta]) => (
                  <label key={nombre}>
                    {etiqueta}
                    <input
                      type="text"
                      name={nombre}
                    />
                  </label>
                ))}
              </>
            )}

            {tipo === "Instalación de fibra óptica + TV" && (
              <>
                <h3>Datos de TV</h3>

                <label>
                  Canales analógicos
                  <input
                    type="number"
                    name="canalesAnalogicos"
                    min="0"
                    step="1"
                  />
                </label>

                <label>
                  Canales digitales
                  <input
                    type="number"
                    name="canalesDigitales"
                    min="0"
                    step="1"
                  />
                </label>

                <label>
                  ¿Se probó el decodificador?
                  <select
                    name="pruebaDecodificador"
                    defaultValue=""
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </label>
              </>
            )}

            {[
              "Instalación de fibra óptica",
              "Instalación de fibra óptica + TV",
              "Cambio a fibra óptica",
              "Alineación",
              "Cambio de ONU",
            ].includes(tipo) && (
              <>

                  {tipo === "Instalación de fibra óptica" && (
                  <>
                    <h3>Datos de la UNIFIBRA</h3>

                    {[
                      ["unifibraInicio", "Metraje de inicio FO"],
                      ["unifibraFin", "Metraje de fin FO"],
                      ["unifibraTotal", "Metraje total de FO"],
                    ].map(([nombre, etiqueta]) => (
                      <label key={nombre}>
                        {etiqueta}
                        <input
                          type="number"
                          name={nombre}
                          min="0"
                          step="any"
                        />
                      </label>
                    ))}
                  </>
                )}
                <h3>Material utilizado</h3>

                {[
                  ["inicioFo", "Inicio FO"],
                  ["finFo", "Fin FO"],
                  ["totalFo", "Total de FO (metros)"],
                  ["tensores", "Tensores"],
                  ["rosetas", "Rosetas"],
                  ["jumper", "Jumper APC/APC"],
                  ["grapasFo", "Grapas FO"],
                  ["grapasUtp", "Grapas UTP"],
                  ...(tipo === "Cambio a fibra óptica"
                    ? []
                    : [
                        ["cableCoaxial", "Cable coaxial (metros)"],
                        ["conectorCoaxial", "Conector coaxial"],
                        ["miniNodo", "Mini nodo"],
                      ]),
                ].map(([nombre, etiqueta]) => (
                  <label key={nombre}>
                    {etiqueta}
                    <input
                      type="number"
                      name={nombre}
                      min="0"
                      step={
                        ["inicioFo", "finFo", "totalFo", "cableCoaxial"]
                          .includes(nombre)
                          ? "any"
                          : "1"
                      }
                    />
                  </label>
                ))}
              </>
            )}

            {tipo === "Corte de fibra óptica" && (
              <label>
                Material utilizado
                <textarea
                  name="materialCorte"
                  rows={4}
                  placeholder="Escribe los materiales y las cantidades utilizadas."
                />
              </label>
            )}

            {[
              "Instalación de fibra óptica",
              "Instalación de fibra óptica + TV",
              "Cambio a fibra óptica",
              "Cambio de ONU",
              "Corte de fibra óptica",
            ].includes(tipo) && (
              <>
                <h3>Costos</h3>

                {[
                  "Instalación de fibra óptica",
                  "Instalación de fibra óptica + TV",
                ].includes(tipo) && (
                  <>
                    <label>
                      Forma de pago de instalación
                      <input
                        type="text"
                        name="formaPago"
                        placeholder="Ejemplo: 1 de 2 pagos"
                      />
                    </label>

                    <label>
                      Instalación ($)
                      <input
                        type="number"
                        name="costoInstalacion"
                        min="0"
                        step="0.01"
                      />
                    </label>

                    <label>
                      Mensualidad ($)
                      <input
                        type="number"
                        name="mensualidad"
                        min="0"
                        step="0.01"
                      />
                    </label>
                  </>
                )}

                <label>
                  Total ($)
                  <input
                    type="number"
                    name="costoTotal"
                    min="0"
                    step="0.01"
                  />
                </label>
              </>
            )}

            <label>
              Descripción y/o anotaciones extras
              <textarea
                name="anotaciones"
                rows={6}
                placeholder="Describe el trabajo realizado, las pruebas y cualquier pendiente."
              />
            </label>
            <button type="submit" className="button">
              Generar bitácora
            </button>
          </form>

          {texto && (
            <div className="bitacoras-preview">
              <label htmlFor="texto-bitacora">Vista previa de la bitácora</label>
              <textarea
                id="texto-bitacora"
                ref={salidaRef}
                value={texto}
                readOnly
                rows={22}
              />
              <button type="button" className="button" onClick={copiar}>
                Copiar bitácora
              </button>
            </div>
          )}
          <p role="status" aria-live="polite">{mensaje}</p>
        </div>
      )}
    </section>
  );
}