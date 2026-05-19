import React from "react";
import { createRoot } from "react-dom/client";
import { Smartphone, Wrench, ShoppingBag, ShieldCheck, Camera, Copy, MessageCircle, MapPin, Star, CreditCard, BatteryCharging, Cable, PackageCheck } from "lucide-react";
import "./style.css";

function SimCard(props) {
  return <CreditCard {...props} />;
}

const products = [
  { title: "Samsung Galaxy A56 5G", category: "Neue Smartphones", price: "349 \u20ac", image: "/showcase/samsung-a56.svg", info: "128 GB \u00b7 5G \u00b7 Beratung vor Ort" },
  { title: "Samsung Galaxy A17 5G", category: "Neue Smartphones", price: "239 \u20ac", image: "/showcase/samsung-a17.svg", info: "128 GB \u00b7 Dual SIM \u00b7 sofort verf\u00fcgbar" },
  { title: "iPhone 15", category: "Neue Smartphones", price: "699 \u20ac", image: "/showcase/iphone15.svg", info: "128 GB \u00b7 5G \u00b7 Super Retina" },
  { title: "iPhone 13 gepr\u00fcft", category: "Gebrauchte Ger\u00e4te", price: "449 \u20ac", image: "/showcase/used-phone.svg", info: "Sehr guter Zustand \u00b7 getestet" },
  { title: "20W Schnelllade-Set", category: "Zubeh\u00f6r", price: "19,90 \u20ac", image: "/showcase/accessories.svg", info: "Adapter + USB-C Kabel" },
  { title: "SIM-Karten Beratung", category: "SIM-Karten & Tarife", price: "ab 9,99 \u20ac", image: "/showcase/simcards.svg", info: "Ayyildiz \u00b7 Lyca \u00b7 Ortel" }
];

function App() {
  return <main className="site">
    <header className="topbar">
      <span><MapPin size={16} /> Badstra\u00dfe 6, 58095 Hagen</span>
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
        <a className="cart" href="#checkout">Warenkorb <b>0</b></a>
      </div>
    </nav>

    <section className="hero">
      <div className="heroText">
        <div className="pill">Handyreparatur \u00b7 Smartphone Shop \u00b7 SIM \u00b7 Passfotos</div>
        <h1>Ihr moderner Technik-Shop in Hagen</h1>
        <p>Sun-TEL verbindet schnelle Handyreparatur, neue und gebrauchte Smartphones, Zubeh\u00f6r, SIM-Karten, biometrische Passbilder und Kopierservice in einem starken lokalen Shop-Erlebnis.</p>
        <div className="heroActions">
          <a href="#shop" className="btn primary">Jetzt shoppen</a>
          <a href="#reparatur" className="btn secondary">Reparatur anfragen</a>
        </div>
        <div className="trustRow">
          <span><ShieldCheck size={18}/> Pers\u00f6nlicher Service</span>
          <span><PackageCheck size={18}/> Abholung im Shop</span>
          <span><CreditCard size={18}/> PayPal \u00b7 Karte \u00b7 Bar</span>
        </div>
      </div>
      <div className="heroGallery">
        <img src="/showcase/iphone15.svg" alt="iPhone 15"/>
        <img src="/showcase/samsung-a56.svg" alt="Samsung Galaxy"/>
        <img src="/showcase/repair.svg" alt="Reparatur"/>
        <img src="/showcase/accessories.svg" alt="Zubeh\u00f6r"/>
      </div>
    </section>

    <section className="categories">
      <Category icon={<Smartphone/>} title="Neue Smartphones"/>
      <Category icon={<ShoppingBag/>} title="Gebrauchte Ger\u00e4te"/>
      <Category icon={<Cable/>} title="Zubeh\u00f6r & H\u00fcllen"/>
      <Category icon={<SimCard/>} title="SIM-Karten & Tarife"/>
      <Category icon={<Wrench/>} title="Handyreparatur"/>
      <Category icon={<Camera/>} title="Passfotos & Kopie"/>
    </section>

    <section id="shop" className="section">
      <div className="sectionHead">
        <div>
          <h2>Beliebte Produkte</h2>
          <p>Neue Modelle, gepr\u00fcfte gebrauchte Ger\u00e4te und Zubeh\u00f6r direkt vor Ort.</p>
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
        <select><option>Marke w\u00e4hlen</option><option>Apple iPhone</option><option>Samsung Galaxy</option><option>Xiaomi / Redmi</option></select>
        <select><option>Reparaturart w\u00e4hlen</option><option>Display Reparatur</option><option>Akkuwechsel</option><option>Ladebuchse</option></select>
        <button>Reparaturanfrage senden</button>
      </div>
    </section>

    <section id="sim" className="section simSection">
      <div>
        <h2>SIM-Karten & Tarife</h2>
        <p>Ayyildiz, Lyca und Ortel inklusive Aktivierung, Aufladung und pers\u00f6nlicher Tarifberatung.</p>
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

    <section id="checkout" className="section checkoutPreview">
      <h2>Warenkorb & Checkout</h2>
      <p>Der neue Shop wird Warenkorb, Abholung, Versand, PayPal, Stripe, \u00dcberweisung und Barzahlung unterst\u00fctzen.</p>
      <div className="paymentRow"><span>PayPal</span><span>VISA</span><span>Mastercard</span><span>Stripe</span><span>\u00dcberweisung</span><span>Bar</span></div>
    </section>

    <footer className="footer">
      <div>
        <h3>Sun-TEL</h3>
        <p>Badstra\u00dfe 6 \u00b7 58095 Hagen \u00b7 Seit 24 Jahren in Hagen</p>
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
