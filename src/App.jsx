import { useMemo, useState } from 'react';

const menuCategories = [
  { id: 'clasicas', label: 'Clasicas' },
  { id: 'especiales', label: 'Especiales' },
  { id: 'premium', label: 'Premium' },
  { id: 'combos', label: 'Combos' }
];

const menuItems = [
  { id: 'pizza-1', category: 'clasicas', name: 'Margarita Napoletana', description: 'Salsa artesanal, mozzarella, tomate fresco y albahaca.', price: 'Q72.00', badge: 'Top ventas' },
  { id: 'pizza-2', category: 'clasicas', name: 'Pepperoni Crunch', description: 'Doble pepperoni, queso fundido y borde sazonado.', price: 'Q79.00', badge: 'Entrega rapida' },
  { id: 'pizza-3', category: 'especiales', name: 'Chicken BBQ Smoke', description: 'Pollo ahumado, cebolla morada, salsa BBQ y maiz.', price: 'Q88.00', badge: 'Nuevo' },
  { id: 'pizza-4', category: 'especiales', name: 'Hawaiana Deluxe', description: 'Jamon, pinia caramelizada y mix extra de quesos.', price: 'Q85.00', badge: 'Favorita' },
  { id: 'pizza-5', category: 'premium', name: 'Truffle Supremo', description: 'Salsa blanca, hongos, parmesano y aceite trufado.', price: 'Q109.00', badge: 'Premium' },
  { id: 'pizza-6', category: 'combos', name: 'Combo Familiar Nova', description: '2 pizzas familiares, pan de ajo y gaseosas.', price: 'Q189.00', badge: 'Ahorro' }
];

const stories = [
  {
    id: 'HU-01',
    title: 'Explorar el menu de pizzas',
    summary: 'Como cliente nuevo de PizzaNova, quiero ver el catalogo de pizzas por categorias para decidir que producto comprar segun mi antojo y presupuesto.',
    businessRules: [
      'El menu debe mostrar nombre, precio, tamano y etiqueta comercial.',
      'Las categorias deben poder cambiarse sin recargar la aplicacion.',
      'Los productos agotados deben verse bloqueados o marcados.'
    ],
    acceptance: [
      'Dado que ingreso al menu, cuando selecciono una categoria, entonces veo solo los productos asociados.',
      'Dado que un producto esta agotado, cuando lo visualizo, entonces aparece como no disponible.',
      'Dado que reviso el catalogo, cuando observo una pizza, entonces veo su precio y descripcion.'
    ]
  },
  {
    id: 'HU-02',
    title: 'Personalizar una pizza',
    summary: 'Como cliente que desea un pedido a medida, quiero personalizar tamano, masa e ingredientes extra para comprar una pizza ajustada a mis preferencias.',
    businessRules: [
      'Cada pizza debe permitir al menos tres tamanos.',
      'Los extras modifican el total automaticamente.',
      'No se permite agregar al carrito sin elegir tamano.'
    ],
    acceptance: [
      'Dado que estoy en el configurador, cuando elijo tamano y extras, entonces el total se actualiza en tiempo real.',
      'Dado que no he elegido tamano, cuando intento agregar al carrito, entonces el sistema solicita completar ese dato.',
      'Dado que selecciono una pizza, cuando cambio la masa, entonces el resumen refleja mi eleccion.'
    ]
  },
  {
    id: 'HU-03',
    title: 'Gestionar el carrito',
    summary: 'Como cliente listo para comprar, quiero revisar mi carrito y editar cantidades para confirmar que mi pedido coincide con lo que deseo recibir.',
    businessRules: [
      'El carrito debe mostrar subtotal, costo de entrega y total.',
      'Las cantidades no pueden ser menores a uno.',
      'Eliminar un producto recalcula el total inmediatamente.'
    ],
    acceptance: [
      'Dado que tengo productos en el carrito, cuando modifico una cantidad, entonces el total se recalcula.',
      'Dado que elimino un producto, cuando confirmo la accion, entonces desaparece del carrito.',
      'Dado que reviso mi pedido, cuando abro el carrito, entonces visualizo el resumen economico.'
    ]
  },
  {
    id: 'HU-04',
    title: 'Finalizar pedido',
    summary: 'Como cliente que desea recibir su comida sin demoras, quiero ingresar mis datos de entrega y metodo de pago para completar el pedido de forma segura.',
    businessRules: [
      'La direccion es obligatoria para entrega a domicilio.',
      'Debe existir opcion de efectivo y tarjeta.',
      'El sistema debe mostrar un resumen final antes de confirmar.'
    ],
    acceptance: [
      'Dado que estoy en checkout, cuando completo mis datos validos, entonces puedo confirmar el pedido.',
      'Dado que selecciono entrega a domicilio, cuando no ingreso direccion, entonces no se permite avanzar.',
      'Dado que elijo metodo de pago, cuando reviso el resumen final, entonces visualizo el total a pagar.'
    ]
  },
  {
    id: 'HU-05',
    title: 'Dar seguimiento al pedido',
    summary: 'Como cliente que ya compro, quiero ver el estado del pedido en tiempo real para saber cuando preparar la recepcion de mi pizza.',
    businessRules: [
      'El seguimiento debe manejar estados minimo: recibido, en preparacion, en camino y entregado.',
      'Cada pedido debe mostrar un codigo visible.',
      'La pantalla debe resaltar claramente el estado actual.'
    ],
    acceptance: [
      'Dado que confirme mi compra, cuando ingreso al seguimiento, entonces veo el codigo del pedido.',
      'Dado que el pedido avanza, cuando cambia de estado, entonces la linea de progreso marca la etapa activa.',
      'Dado que el pedido fue entregado, cuando consulto el seguimiento, entonces aparece como completado.'
    ]
  }
];

const traceability = [
  { story: 'HU-01', screen: 'Pantalla 1', module: 'Landing comercial', detail: 'Promociones, CTA principal y acceso al menu.' },
  { story: 'HU-01', screen: 'Pantalla 2', module: 'Catalogo de pizzas', detail: 'Listado por categorias con tarjetas de productos.' },
  { story: 'HU-02', screen: 'Pantalla 3', module: 'Configurador', detail: 'Tamano, masa, extras y precio dinamico.' },
  { story: 'HU-03', screen: 'Pantalla 4', module: 'Carrito', detail: 'Resumen editable del pedido y costos.' },
  { story: 'HU-04', screen: 'Pantalla 5', module: 'Checkout', detail: 'Entrega, pago, confirmacion y resumen final.' },
  { story: 'HU-05', screen: 'Pantalla 6', module: 'Tracking', detail: 'Seguimiento con codigo, estado y ETA.' }
];

const prototypeScreens = [
  { id: 1, name: 'Home Store', kicker: 'Pantalla 1', title: 'Descubre promociones y ordena en segundos', subtitle: 'Una portada comercial con banners, categorias rapidas, productos estrella y beneficios.', metrics: ['Entrega 25-35 min', '4.8 rating', 'Pedidos en linea 24/7'] },
  { id: 2, name: 'Catalogo', kicker: 'Pantalla 2', title: 'Explora el menu completo', subtitle: 'Vista de tienda con filtros, tarjetas de producto y etiquetas para apoyar la decision de compra.', metrics: ['4 categorias', 'Top ventas', 'Promos activas'] },
  { id: 3, name: 'Personalizacion', kicker: 'Pantalla 3', title: 'Arma tu pizza ideal', subtitle: 'Configurador detallado con tamano, borde, salsa, extras y resumen del precio en vivo.', metrics: ['3 tamanos', '6 extras', 'Precio dinamico'] },
  { id: 4, name: 'Carrito', kicker: 'Pantalla 4', title: 'Revisa el pedido antes de pagar', subtitle: 'Modulo para editar cantidades, aplicar cupones y revisar subtotal, envio y total.', metrics: ['Cupones', 'Resumen fiscal', 'Boton checkout'] },
  { id: 5, name: 'Checkout', kicker: 'Pantalla 5', title: 'Completa entrega y pago', subtitle: 'Flujo con direccion, referencias, metodo de pago, horario y confirmacion del pedido.', metrics: ['Efectivo/Tarjeta', 'Entrega o retiro', 'Resumen final'] },
  { id: 6, name: 'Seguimiento', kicker: 'Pantalla 6', title: 'Sigue el estado del pedido', subtitle: 'Timeline del pedido con codigo, repartidor, ETA y confirmacion de entrega.', metrics: ['Codigo visible', 'Estado en vivo', 'ETA 12 min'] }
];

const checkoutSteps = ['Datos', 'Entrega', 'Pago', 'Confirmacion'];
const trackingStates = ['Recibido', 'En preparacion', 'Horneando', 'En camino', 'Entregado'];

function MenuCard({ item }) {
  return (
    <article className="menu-card">
      <div className="menu-card-top">
        <span className="product-badge">{item.badge}</span>
        <span className="product-price">{item.price}</span>
      </div>
      <div className="pizza-visual" />
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <button type="button">Agregar al carrito</button>
    </article>
  );
}

function PrototypePreview({ screen, category, setCategory }) {
  const filteredItems = useMemo(() => menuItems.filter((item) => item.category === category).slice(0, 3), [category]);

  if (screen.id === 1) {
    return (
      <div className="phone-screen">
        <div className="app-top">
          <div>
            <strong>PizzaNova</strong>
            <p>La noche pide pizza</p>
          </div>
          <span className="pill dark">2x1 Hoy</span>
        </div>
        <div className="promo-banner">
          <p className="mini-label">Promo central</p>
          <h3>2 pizzas medianas + soda</h3>
          <p>Q129.00 con entrega gratis en zonas seleccionadas.</p>
          <button type="button">Ordenar ahora</button>
        </div>
        <div className="quick-grid">
          <div className="quick-card">Clasicas</div>
          <div className="quick-card">Premium</div>
          <div className="quick-card">Combos</div>
          <div className="quick-card">Bebidas</div>
        </div>
        <div className="status-strip">
          {screen.metrics.map((metric) => <span key={metric}>{metric}</span>)}
        </div>
      </div>
    );
  }

  if (screen.id === 2) {
    return (
      <div className="phone-screen">
        <div className="app-top compact">
          <strong>Menu completo</strong>
          <span className="pill">24 productos</span>
        </div>
        <div className="category-pills">
          {menuCategories.map((item) => (
            <button key={item.id} type="button" className={item.id === category ? 'active' : ''} onClick={() => setCategory(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="product-stack">
          {filteredItems.map((item) => (
            <div key={item.id} className="product-row">
              <div className="product-thumb" />
              <div>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
              </div>
              <span>{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen.id === 3) {
    return (
      <div className="phone-screen">
        <div className="app-top compact">
          <strong>Configura tu pizza</strong>
          <span className="pill accent">Q96.00</span>
        </div>
        <div className="builder-card">
          <h4>Pepperoni Crunch</h4>
          <p>Elige tamano, masa y extras.</p>
          <div className="option-group">
            <span>Tamano</span>
            <div className="selector-row">
              <button type="button" className="active">M</button>
              <button type="button">L</button>
              <button type="button">XL</button>
            </div>
          </div>
          <div className="option-group">
            <span>Masa</span>
            <div className="selector-row">
              <button type="button">Tradicional</button>
              <button type="button" className="active">Delgada</button>
            </div>
          </div>
          <div className="extras-list">
            <label><input type="checkbox" defaultChecked readOnly /> Queso extra +Q10</label>
            <label><input type="checkbox" defaultChecked readOnly /> Jalapeno +Q6</label>
            <label><input type="checkbox" readOnly /> Tocino +Q12</label>
          </div>
        </div>
      </div>
    );
  }

  if (screen.id === 4) {
    return (
      <div className="phone-screen">
        <div className="app-top compact">
          <strong>Tu carrito</strong>
          <span className="pill">3 items</span>
        </div>
        <div className="cart-item">
          <div className="product-thumb small" />
          <div>
            <strong>Chicken BBQ Smoke</strong>
            <p>Grande · Masa tradicional</p>
          </div>
          <span>Q88</span>
        </div>
        <div className="cart-item">
          <div className="product-thumb small" />
          <div>
            <strong>Pan de ajo</strong>
            <p>1 unidad</p>
          </div>
          <span>Q18</span>
        </div>
        <div className="summary-card">
          <div><span>Subtotal</span><strong>Q106</strong></div>
          <div><span>Envio</span><strong>Q12</strong></div>
          <div><span>Cupon</span><strong>-Q10</strong></div>
          <div className="total-row"><span>Total</span><strong>Q108</strong></div>
        </div>
      </div>
    );
  }

  if (screen.id === 5) {
    return (
      <div className="phone-screen">
        <div className="app-top compact">
          <strong>Checkout</strong>
          <span className="pill accent">Paso 3/4</span>
        </div>
        <div className="steps-row">
          {checkoutSteps.map((step, index) => <span key={step} className={index < 3 ? 'done' : ''}>{step}</span>)}
        </div>
        <div className="form-card">
          <div className="fake-input">Nombre completo</div>
          <div className="fake-input">Zona 10, Ciudad de Guatemala</div>
          <div className="selector-row wide">
            <button type="button" className="active">Tarjeta</button>
            <button type="button">Efectivo</button>
          </div>
          <div className="fake-input">Referencia: Casa blanca porton negro</div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-screen">
      <div className="app-top compact">
        <strong>Seguimiento</strong>
        <span className="pill dark">PN-240315</span>
      </div>
      <div className="tracking-card">
        <h4>Pedido en camino</h4>
        <p>Repartidor: Carlos M. · ETA 12 min</p>
        <div className="timeline">
          {trackingStates.map((state, index) => (
            <div key={state} className={`timeline-step ${index < 4 ? 'done' : ''}`}>
              <span />
              <small>{state}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="status-strip single">
        {screen.metrics.map((metric) => <span key={metric}>{metric}</span>)}
      </div>
    </div>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [activeCategory, setActiveCategory] = useState('clasicas');

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Serie III · PizzaNova Store</p>
          <h1>Tienda web de pizzas con experiencia completa de compra</h1>
          <p className="lead">
            Este artefacto integra la propuesta academica y al mismo tiempo presenta un prototipo mucho mas cercano a una tienda real: descubrimiento de productos, personalizacion, carrito, checkout y tracking.
          </p>
          <div className="hero-actions">
            <a href="#prototipo">Ver prototipo</a>
            <a href="#historias" className="secondary">Ver backlog</a>
          </div>
        </div>
        <div className="hero-dashboard">
          <div className="dashboard-top">
            <div>
              <p className="mini-label">Resumen del producto</p>
              <h3>PizzaNova Ecommerce</h3>
            </div>
            <span className="pill dark">Listo para Vercel</span>
          </div>
          <div className="dashboard-stats">
            <div><strong>6</strong><span>Pantallas</span></div>
            <div><strong>5</strong><span>Historias</span></div>
            <div><strong>4</strong><span>Criterios</span></div>
          </div>
          <div className="dashboard-menu">
            {menuItems.slice(0, 3).map((item) => (
              <div key={item.id} className="dashboard-item">
                <div className="product-thumb small" />
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="top-nav">
        <a href="#propuesta">Propuesta</a>
        <a href="#historias">Historias</a>
        <a href="#criterios">Criterios</a>
        <a href="#prototipo">Prototipo</a>
        <a href="#matriz">Matriz</a>
      </nav>

      <main className="content">
        <section id="propuesta" className="section-card">
          <div className="section-heading">
            <div>
              <p className="section-label">Punto 5</p>
              <h2>Descripcion breve de la propuesta</h2>
            </div>
            <span className="pill accent">Tienda completa</span>
          </div>
          <div className="proposal-grid">
            <p>
              PizzaNova es una tienda digital especializada en venta de pizzas, combos y complementos. El producto permite al cliente descubrir promociones, explorar un catalogo por categorias, personalizar cada pizza, administrar su carrito, completar el pago y monitorear la entrega desde cualquier dispositivo.
            </p>
            <p>
              La propuesta se enfoca en una experiencia clara y comercial, pensada para aumentar conversiones y reducir friccion en el proceso de compra. Todo el recorrido esta conectado con historias de usuario, criterios de aceptacion verificables y una matriz de trazabilidad entre backlog y pantallas.
            </p>
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading">
            <div>
              <p className="section-label">Vista comercial</p>
              <h2>Catalogo inicial del negocio</h2>
            </div>
            <span className="pill">Productos ejemplo</span>
          </div>
          <div className="menu-grid">
            {menuItems.map((item) => <MenuCard key={item.id} item={item} />)}
          </div>
        </section>

        <section id="historias" className="section-card">
          <p className="section-label">Punto 1</p>
          <h2>5 historias de usuario completas</h2>
          <div className="story-list">
            {stories.map((story) => (
              <article key={story.id} className="story-card">
                <div className="story-header">
                  <span>{story.id}</span>
                  <h3>{story.title}</h3>
                </div>
                <p>{story.summary}</p>
                <h4>Reglas de negocio</h4>
                <ul>
                  {story.businessRules.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="criterios" className="section-card">
          <p className="section-label">Punto 2</p>
          <h2>4 historias con criterios de aceptacion</h2>
          <div className="criteria-grid">
            {stories.slice(0, 4).map((story) => (
              <article key={story.id} className="criteria-card">
                <div className="story-header">
                  <span>{story.id}</span>
                  <h3>{story.title}</h3>
                </div>
                <ul>
                  {story.acceptance.map((criterion) => <li key={criterion}>{criterion}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="prototipo" className="section-card prototype-section">
          <div className="prototype-copy">
            <p className="section-label">Punto 3</p>
            <h2>Prototipo de la tienda con 6 pantallas</h2>
            <p>
              El flujo cubre la experiencia principal de una pizzeria ecommerce: portada comercial, menu, configurador, carrito, checkout y seguimiento del pedido.
            </p>
            <div className="screen-tabs">
              {prototypeScreens.map((screen, index) => (
                <button key={screen.id} type="button" className={index === activeScreen ? 'active' : ''} onClick={() => setActiveScreen(index)}>
                  {screen.kicker}
                </button>
              ))}
            </div>
            <div className="screen-summary">
              <p className="mini-label">{prototypeScreens[activeScreen].name}</p>
              <h3>{prototypeScreens[activeScreen].title}</h3>
              <p>{prototypeScreens[activeScreen].subtitle}</p>
              <div className="metric-row">
                {prototypeScreens[activeScreen].metrics.map((metric) => <span key={metric}>{metric}</span>)}
              </div>
            </div>
          </div>
          <div className="phone-shell">
            <div className="phone-bar">
              <span />
              <span />
              <span />
            </div>
            <PrototypePreview screen={prototypeScreens[activeScreen]} category={activeCategory} setCategory={setActiveCategory} />
          </div>
        </section>

        <section id="matriz" className="section-card">
          <p className="section-label">Punto 4</p>
          <h2>Matriz de trazabilidad entre historias y pantallas</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Historia</th>
                  <th>Pantalla</th>
                  <th>Modulo</th>
                  <th>Relacion</th>
                </tr>
              </thead>
              <tbody>
                {traceability.map((row) => (
                  <tr key={`${row.story}-${row.screen}`}>
                    <td>{row.story}</td>
                    <td>{row.screen}</td>
                    <td>{row.module}</td>
                    <td>{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
