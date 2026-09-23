import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const services = [
  [
    "Desarrollo web",
    "Sitios y herramientas sencillas que resuelven necesidades reales.",
  ],
  [
    "Fibra óptica",
    "Instalación, diagnóstico y mantenimiento de enlaces de fibra óptica.",
  ],
  [
    "Redes y CCTV",
    "Conectividad y videovigilancia para hogares y negocios.",
  ],
  [
    "Soporte técnico",
    "Diagnóstico y solución de problemas en equipos y sistemas.",
  ],
];


export default function App() {
  return (
    <main>
      <header className="wrap header">
        <a className="brand" href="#inicio">
          <b>T.</b> Trejo<span>Tech</span>
        </a>

        <nav>
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#servicios">Servicios</a>
          <a href="#herramientas">Herramientas</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section id="inicio" className="wrap hero">
  <div>
    <p className="eyebrow">
      INGENIERÍA · TECNOLOGÍA · SOLUCIONES
    </p>

    <h1>
      Tecnología útil.
      <br />
      <em>Soluciones reales.</em>
    </h1>

    <p className="intro">
      Soy Jhony Trejo Hurtado, Ingeniero en Sistemas Computacionales. Trabajo
      con desarrollo web, fibra óptica, redes, CCTV y soporte técnico.
    </p>

    <div className="actions">
      <a className="button" href="#herramientas">
        Ver herramientas ↗
      </a>
      <a href="#sobre-mi">Conoce mi trabajo ↓</a>
    </div>
  </div>
</section>

      <section id="sobre-mi" className="about">
        <div className="wrap about-grid">
          <span className="index">01 / SOBRE MÍ</span>

          <div>
            <h2>
              Tecnología que funciona
              <br />
              en el mundo real.
            </h2>

            <p>
              Mi experiencia une el trabajo en campo con el desarrollo de
              software. Me gusta entender el problema, encontrar una solución
              práctica y mejorarla con cada proyecto.
            </p>
          </div>
        </div>
      </section>

      <section id="servicios" className="wrap block">
        <div className="heading">
          <div>
            <span className="index">02 / SERVICIOS</span>
            <h2>En qué puedo ayudarte</h2>
          </div>

          <p>
            Del cableado a la pantalla: experiencia técnica y soluciones
            digitales.
          </p>
        </div>

        <div className="services">
          {services.map(([title, description], i) => (
            <article key={title} className="service">
              <span>0{i + 1}</span>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>

              <span>↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="herramientas" className="tools block">
        <div className="wrap">
          <div className="heading">
            <div>
              <span className="index">03 / HERRAMIENTAS</span>
              <h2>Proyectos en uso</h2>
            </div>

            <p>Herramientas nacidas de necesidades del día a día.</p>
          </div>

          <article className="tool">
            <div className="tool-mark">⌁</div>

            <div>
              <span className="index">
                FIBRA ÓPTICA · TRABAJO EN CAMPO
              </span>
              <h3>Bitácoras de campo</h3>
              <p>
                Elige el tipo de servicio, llena los datos y copia tu
                bitácora lista para compartir.
              </p>
            </div>

            <a
              className="button"
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir herramienta ↗
            </a>
          </article>
        </div>
      </section>

      <footer id="contacto">
        <div className="wrap footer-main">
          <div>
            <span className="index">04 / CONTACTO</span>
            <h2>Sigamos construyendo.</h2>
              <p>
              ¿Tienes un proyecto o necesitas apoyo técnico? Escríbeme y lo platicamos.
            </p>

            <div className="actions">
              <a
              className="button"
              href="https://wa.me/527731298035"
              target="_blank"
              rel="noopener noreferrer"
              style={{ gap: "10px" }}
            >
              <FaWhatsapp aria-hidden="true" />
              Escribirme por WhatsApp
            </a>


              <a
              href="mailto:trejojhony9876@gmail.com"
              style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
            >
              <FaEnvelope aria-hidden="true" />
              Enviar correo
            </a>
            </div>
          </div>

          <a href="#inicio">Volver arriba ↑</a>
        </div>

        <div className="wrap footer-bottom">
          <span>© {new Date().getFullYear()} TrejoTech · Jhony Trejo</span>
          <span>Hecho en Hidalgo, México</span>
        </div>
      </footer>
    </main>
  );
}