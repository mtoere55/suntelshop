import React from "react";
import { createRoot } from "react-dom/client";
import { Smartphone, Wrench, ShoppingBag, ShieldCheck, Camera, Copy, MessageCircle, MapPin, Star, CreditCard, BatteryCharging, Cable, PackageCheck } from "lucide-react";
import "./style.css";

function SimCard(props) {
  return <CreditCard {...props} />;
}

const products = [
  { title: "Samsung Galaxy A56 5G", category: "Neue Smartphones", price: "349 €", image: "/showcase/samsung-a56.svg", info: "128 GB · 5G · Beratung vor Ort" },
  { title: "Samsung Galaxy A17 5G", category: "Neue Smartphones", price: "239 €", image: "/showcase/samsung-a17.svg", info: "128 GB · Dual SIM · sofort verfügbar" },
  { title: "iPhone 15", category: "Neue Smartphones", price: "699 €", image: "/showcase/iphone15.svg", info: "128 GB · 5G · Super Retina" },
  { title: "iPhone 13 geprüft", category: "Gebrauchte Geräte", price: "449 €", image: "/showcase/used-phone.svg", info: "Sehr guter Zustand · getestet" },
  { title: "20W Schnelllade-Set", category: "Zubehör", price: "19,90 €", image: "/showcase/accessories.svg", info: "Adapter + USB-C Kabel" },
  { title: "SIM-Karten Beratung", category: "SIM-Karten & Tarife", price: "ab 9,99 €", image: "/showcase/simcards.svg", info: "Ayyildiz · Lyca · Ortel" }
];

function App() {
  return <main className="site">
    <header className="topbar">
      <span><MapPin size={16} /> Badstraße 6, 58095 Hagen</span>
      <a href="tel:023313484182">02331 3484182</a>
      <a href="https://wa.me/4915739684985">WhatsApp</a>
    </header>

    <nav className="navbar">
      <a className="brand" href="/"><span>Sun-TEL</span><small>Seit 24 Jahren in Hagen</small></a>
      <div className="navlinks">
        <a href="#reparatur">Reparatur</a>
        <a href="#shop">Shop</a>
        <a href="#sim">SIM-Karten</a>
        <a href="#passfoto">Passfotos</a>
        <a href="#cidenbridge">CidenBridge</a>
        <a className="cart" href="#checkout">Warenkorb <b>0</b></a>
      </div>
    </nav>

    <section className="hero">
      <div className="heroText">
        <div className="pill">Handyreparatur · Smartphone Shop · SIM · Passfotos</div>
        <h1>Ihr moderner Technik-Shop in Hagen</h1>
        <p>Sun-TEL verbindet schnelle Handyreparatur, neue und gebrauchte Smartphones, Zubehör, SIM-Karten, biometrische Passbilder und Kopierservice in einem starken lokalen Shop-Erlebnis.</p>
        <div className="heroActions">
          <a href="#shop" className="btn primary">Jetzt shoppen</a>
          <a href="#reparatur" className="btn secondary">Reparatur anfragen</a>
        </div>
        <div className="trustRow">
          <span><ShieldCheck size={18}/> Persönlicher Service</span>
          <span><PackageCheck size={18}/> Abholung im Shop</span>
          <span><CreditCard size={18}/> PayPal · Karte · Bar</span>
        </div>
      </div>
      <div className="heroGallery">
        <img src="/showcase/iphone15.svg" alt="iPhone 15"/>
        <img src="/showcase/samsung-a56.svg" alt="Samsung Galaxy"/>
        <img src="/showcase/repair.svg" alt="Reparatur"/>
        <img src="/showcase/accessories.svg" alt="Zubehör"/>
      </div>
    </section>

    <section className="categories">
      <Category icon={<Smartphone/>} title="Neue Smartphones"/>
      <Category icon={<ShoppingBag/>} title="Gebrauchte Geräte"/>
      <Category icon={<Cable/>} title="Zubehör & Hüllen"/>
      <Category icon={<SimCard/>} title="SIM-Karten & Tarife"/>
      <Category icon={<Wrench/>} title="Handyreparatur"/>
      <Category icon={<Camera/>} title="Passfotos & Kopie"/>
    </section>

    <section id="shop" className="section">
      <div className="sectionHead">
        <div>
          <h2>Beliebte Produkte</h2>
          <p>Neue Modelle, geprüfte gebrauchte Geräte und Zubehör direkt vor Ort.</p>
        </div>
        <a href="#checkout">Zum Warenkorb</a>
      </div>
      <div className="productGrid">{products.map(p => <ProductCard key={p.title} product={p}/>)}</div>
    </section>

    <section id="reparatur" className="split section">
      <div className="panel">
        <h2>Handyreparatur in Hagen</h2>
        <p>Display kaputt, Akku schwach, Ladebuchse defekt oder Wasserschaden? Sun-TEL bietet schnelle Diagnose, transparente Beratung und saubere Reparatur.</p>
        <div className="repairGrid">
          <Mini icon={<Smartphone/>} title="Display"/>
          <Mini icon={<BatteryCharging/>} title="Akku"/>
          <Mini icon={<Cable/>} title="Ladebuchse"/>
          <Mini icon={<Wrench/>} title="Diagnose"/>
        </div>
      </div>
      <div className="formCard">
        <h3>Reparatur anfragen</h3>
        <input placeholder="Name"/>
        <input placeholder="Telefon"/>
        <select><option>Marke wählen</option><option>Apple iPhone</option><option>Samsung Galaxy</option><option>Xiaomi / Redmi</option></select>
        <select><option>Reparaturart wählen</option><option>Display Reparatur</option><option>Akkuwechsel</option><option>Ladebuchse</option></select>
        <button>Reparaturanfrage senden</button>
      </div>
    </section>

    <section id="sim" className="section simSection">
      <div>
        <h2>SIM-Karten & Tarife</h2>
        <p>Ayyildiz, Lyca und Ortel inklusive Aktivierung, Aufladung und persönlicher Tarifberatung.</p>
        <div className="heroActions"><a className="btn primary" href="https://wa.me/4915739684985">Tarifberatung per WhatsApp</a></div>
      </div>
      <img src="/showcase/simcards.svg" alt="SIM-Karten"/>
    </section>

    <section id="passfoto" className="section passSection">
      <img src="/showcase/passfoto.svg" alt="Passfotos"/>
      <div>
        <h2>Passfotos & Kopierservice</h2>
        <p>Biometrische Passbilder, Bewerbungsfotos und Fotokopien direkt im Shop - schnell und unkompliziert.</p>
        <div className="passItems">
          <span><Camera size={18}/> Biometrische Passbilder</span>
          <span><Copy size={18}/> Fotokopie</span>
          <span><Camera size={18}/> Bewerbungsfotos</span>
        </div>
      </div>
    </section>

    <section className="section reviews">
      <h2>Warum Kunden zu Sun-TEL kommen</h2>
      <div className="reviewGrid">
        <Review name="Markus K." text="Schnelle Reparatur, freundlicher Kontakt und faire Beratung. Genau so stellt man sich einen lokalen Handyshop vor."/>
        <Review name="Aylin T." text="SIM-Karte direkt bekommen und aktivieren lassen. Sehr unkompliziert und hilfsbereit."/>
        <Review name="S. Demir" text="Passfotos und Kopien sofort erledigt. Alles sauber, schnell und freundlich."/>
      </div>
    </section>

    <section className="section cidenbridgePilot" id="cidenbridge">
      <div className="bridgeIntro">
        <span className="bridgeKicker">Web2 to Secure Web3 Bridge</span>
        <h2>Sun-TEL wird der erste lokale CidenBridgeDB Pilot-Shop.</h2>
        <p>Diese Verbindung zeigt, wie ein bestehender Web2-Shop mit Cidentia Login, CidenCard, Reparatur-Proof und Garantie-Proof in eine sichere Web3-ready Vertrauensschicht wechseln kann.</p>
        <div className="bridgeActions">
          <a className="btn primary" href="https://cidentiaapp.vercel.app/login">Login with Cidentia</a>
          <a className="btn secondary" href="https://bridge-db.cidenbridge.com/verify/preview">CidenBridgeDB Verify</a>
        </div>
      </div>

      <div className="bridgeCards">
        <article>
          <ShieldCheck size={24}/>
          <strong>Verified by CidenBridgeDB</strong>
          <p>Shop, Kunde und Servicefall werden später über eine kontrollierte Trust-Verbindung verknüpft.</p>
          <small>Trust layer ready</small>
        </article>
        <article>
          <CreditCard size={24}/>
          <strong>CidenCard Customer</strong>
          <p>Kunden können sich mit Cidentia anmelden und eine shopbezogene Kundenkarte erhalten.</p>
          <small>Identity ready</small>
        </article>
        <article>
          <PackageCheck size={24}/>
          <strong>Repair Proof</strong>
          <p>Reparaturannahme, Diagnose, Abschluss und Garantie können als Proof-Kette sichtbar werden.</p>
          <small>Proof ready</small>
        </article>
      </div>

      <div className="bridgeFlow">
        <span>Web2 Shop</span>
        <b>{'->'}</b>
        <span>Cidentia Login</span>
        <b>{'->'}</b>
        <span>CidenBridgeDB</span>
        <b>{'->'}</b>
        <span>Proof / Warranty</span>
      </div>
    </section>

    <section id="checkout" className="section checkoutPreview">
      <h2>Warenkorb & Checkout</h2>
      <p>Der neue Shop wird Warenkorb, Abholung, Versand, PayPal, Stripe, Überweisung und Barzahlung unterstützen.</p>
      <div className="paymentRow"><span>PayPal</span><span>VISA</span><span>Mastercard</span><span>Stripe</span><span>Überweisung</span><span>Bar</span></div>
    </section>

    <footer className="footer">
      <div>
        <h3>Sun-TEL</h3>
        <p>Badstraße 6 · 58095 Hagen · Seit 24 Jahren in Hagen</p>
      </div>
      <div>
        <a href="tel:023313484182">02331 3484182</a>
        <a href="mailto:suntel58135@gmail.com">suntel58135@gmail.com</a>
        <a href="https://wa.me/4915739684985"><MessageCircle size={16}/> WhatsApp</a>
      </div>
    </footer>
  </main>;
}

function Category({icon, title}) {
  return <a className="category" href="#"><span>{icon}</span><b>{title}</b></a>;
}

function Mini({icon, title}) {
  return <div className="mini">{icon}<b>{title}</b></div>;
}

function ProductCard({ product }) {
  return <article className="productCard">
    <div className="productImage"><img src={product.image} alt={product.title}/></div>
    <div className="productBody">
      <span>{product.category}</span>
      <h3>{product.title}</h3>
      <p>{product.info}</p>
      <strong>{product.price}</strong>
      <div className="productActions"><button>Details</button><button className="orange">In den Warenkorb</button></div>
    </div>
  </article>;
}

function Review({name, text}) {
  return <div className="reviewCard"><div className="stars"><Star/><Star/><Star/><Star/><Star/></div><b>{name}</b><p>{text}</p></div>;
}

createRoot(document.getElementById("root")).render(<App />);
