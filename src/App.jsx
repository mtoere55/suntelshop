import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Google", "Motorola", "Oppo", "Huawei", "Honor", "Nokia", "OnePlus", "Sony"];
const ISSUE_TYPES = ["Display kaputt", "Akku schwach", "Ladebuchse defekt", "Kamera defekt", "Lautsprecher / Mikrofon", "Wasserschaden", "Softwareproblem", "Datenübertragung", "Sonstiges"];

const REAL_IMAGES = {
  hero: "/assets/repair/repair-hero.png",
  repair: "/assets/repair/repair-hero.png",
  repairCounter: "/assets/repair/repair-counter.png",
  repairWorkbench: "/assets/repair/repair-workbench.png",
  repairDiagnostics: "/assets/repair/repair-diagnostics.png",
  repairServiceCard: "/assets/repair/repair-service-card.png",
  repairPremiumCard: "/assets/repair/repair-premium-card.png",
  repairCustomer: "/assets/repair/repair-customer-service.png",
  accessory: "https://loremflickr.com/1200/700/phone,accessories,store?lock=90103",
  sim: "https://loremflickr.com/1200/700/sim,card,telecom?lock=90104",
  passfoto: "https://loremflickr.com/1200/700/passport,photo,printer?lock=90105",
  used: "https://loremflickr.com/1200/700/used,smartphone,store?lock=90106"
};
const REPAIR_MODELS = {
  Apple: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone SE"],
  Samsung: ["Galaxy S25 Ultra", "Galaxy S25", "Galaxy S24", "Galaxy S23", "Galaxy S22", "Galaxy A56", "Galaxy A36", "Galaxy A26", "Galaxy A17", "Galaxy A54", "Galaxy A53"],
  Xiaomi: ["Xiaomi 15", "Redmi Note 14 Pro", "Redmi Note 13", "Redmi 14C", "POCO X7 Pro", "Mi 11 Lite"],
  Google: ["Pixel 9", "Pixel 8a", "Pixel 7", "Pixel 6a"],
  Motorola: ["Moto G85", "Moto G55", "Edge 30"],
  Oppo: ["Reno12", "A80", "A60", "Find X3 Lite"],
  Huawei: ["P30 Lite", "P40 Lite", "Mate Serie"],
  Honor: ["Honor 200 Lite", "Honor X Serie"]
};

function money(value) {
  const n = Number(value || 0);
  if (n === 0) return "auf Anfrage";
  return n.toLocaleString("de-DE", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + " €";
}

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const go = (href) => {
    window.history.pushState({}, "", href);
    setPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return { path, go };
}


function CidenBridgePilot() {
  const returnTo = "https://handyreparatur.shop/?source=suntelshop&intent=repair_customer_card#cidenbridge";
  const loginUrl = `https://cidentiaapp.vercel.app/login?return_to=${encodeURIComponent(returnTo)}&source=suntelshop&intent=repair_customer_card`;
  const params = new URLSearchParams(window.location.search);
  const connected = params.get("cidentia") === "connected";
  const returnedCid = params.get("cid") || "";
  const returnedTwin = params.get("twin") || "";

  return (
    <section className="section cidenbridgePilot" id="cidenbridge">
      <div className="bridgeIntro">
        <span className="bridgeKicker">Web2 to Secure Web3 Bridge</span>
        <h2>Sun-TEL wird der erste lokale CidenBridgeDB Pilot-Shop.</h2>
        <p>Diese Verbindung zeigt, wie ein bestehender Web2-Shop mit Cidentia Login, CidenCard, Reparatur-Proof und Garantie-Proof in eine sichere Web3-ready Vertrauensschicht wechseln kann.</p>
        <div className="bridgeActions">
          <a className="btn primary" href={loginUrl}>Login with Cidentia</a>
          <a className="btn ghost" href="https://bridge-db.cidenbridge.com/">CidenBridgeDB Verify</a>
        </div>

        {connected && (
          <div className="bridgeReturnSuccess">
            <b>Cidentia connection active</b>
            <span>{returnedCid || "CidenBridgeDB native identity"} · {returnedTwin || "confirmed_match"}</span>
            <small>Customer card and repair proof preview can be prepared for Sun-TEL.</small>
          </div>
        )}
      </div>

      <div className="bridgeCards">
        <article>
          <b>Verified by CidenBridgeDB</b>
          <p>Shop, Kunde und Servicefall werden später über eine kontrollierte Trust-Verbindung verknüpft.</p>
          <small>Trust layer ready</small>
        </article>
        <article>
          <b>CidenCard Customer</b>
          <p>Kunden können sich mit Cidentia anmelden und eine shopbezogene Kundenkarte erhalten.</p>
          <small>Identity ready</small>
        </article>
        <article>
          <b>Repair / Warranty Proof</b>
          <p>Reparaturannahme, Diagnose, Abschluss und Garantie können als Proof-Kette sichtbar werden.</p>
          <small>Proof ready</small>
        </article>
      </div>

      <div className="bridgeFlow">
        <span>Web2 Shop</span>
        <strong>{'->'}</strong>
        <span>Cidentia Login</span>
        <strong>{'->'}</strong>
        <span>CidenBridgeDB</span>
        <strong>{'->'}</strong>
        <span>Proof / Warranty</span>
      </div>
    </section>
  );
}

function App() {
  const { path, go } = useRoute();
  const [products, setProducts] = useState([]);
  const [business, setBusiness] = useState(null);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("suntel_cart") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(d => setProducts(d.products || []));
    fetch("/api/business").then(r => r.json()).then(setBusiness);
  }, []);

  useEffect(() => {
    localStorage.setItem("suntel_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((old) => {
      const found = old.find((x) => x.productId === product.id);
      if (found) return old.map((x) => x.productId === product.id ? { ...x, qty: x.qty + qty } : x);
      return [...old, { productId: product.id, qty }];
    });
  };

  const updateQty = (productId, qty) => {
    const q = Math.max(1, Number(qty || 1));
    setCart((old) => old.map((x) => x.productId === productId ? { ...x, qty: q } : x));
  };

  const removeItem = (productId) => setCart((old) => old.filter((x) => x.productId !== productId));
  const clearCart = () => setCart([]);

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? { ...item, product, lineTotal: item.qty * product.price } : null;
  }).filter(Boolean);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const navigate = (e, href) => {
    e.preventDefault();
    go(href);
  };

  let page = <Home products={products} query={query} setQuery={setQuery} addToCart={addToCart} navigate={navigate} go={go} />;
  if (path.startsWith("/shop")) page = <ShopPage products={products} path={path} query={query} setQuery={setQuery} addToCart={addToCart} navigate={navigate} />;
  if (path.startsWith("/product/")) page = <ProductPage products={products} slug={path.split("/product/")[1]} addToCart={addToCart} navigate={navigate} />;
  if (path === "/cart") page = <CartPage cartItems={cartItems} updateQty={updateQty} removeItem={removeItem} navigate={navigate} />;
  if (path === "/checkout") page = <CheckoutPage cartItems={cartItems} clearCart={clearCart} navigate={navigate} />;
  if (path === "/reparatur" || path === "/serviceformular") page = <RepairPage navigate={navigate} />;
  if (path === "/admin") page = <AdminPage />;
  if (path.includes("reparatur-hagen") || path.includes("akkuwechsel-hagen")) page = <SeoPage path={path} navigate={navigate} />;
  if (["/impressum", "/datenschutz", "/agb"].includes(path)) page = <LegalPage path={path} business={business} />;

  return (
    <div className="app">
      <Header business={business} cartCount={cartCount} query={query} setQuery={setQuery} navigate={navigate} />
      {page}
      <Footer business={business} navigate={navigate} />
      <WhatsAppFloat />
    </div>
  );
}

function Header({ business, cartCount, query, setQuery, navigate }) {
  return (
    <>
      <div className="topbar">
        <span>📍 Badstraße 6, 58095 Hagen</span>
        <span>☎ 02331 3484182</span>
        <span>✉ suntel58135@gmail.com</span>
        <span>🟢 015739684985</span>
        <b>★ Seit 24 Jahren in Hagen</b>
      </div>
      <header className="header">
        <a href="/" onClick={(e) => navigate(e, "/")} className="logo">Sun-<span>TEL</span></a>
        <div className="search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Suche nach iPhone, Samsung, Hülle, Ladegerät, Reparatur..." />
          <a href="/shop" onClick={(e) => navigate(e, "/shop")}>Suchen</a>
        </div>
        <div className="headerActions">
          <a href="/admin" onClick={(e) => navigate(e, "/admin")}>Mein Konto</a>
          <a href="/cart" onClick={(e) => navigate(e, "/cart")} className="cart">🛒 <em>{cartCount}</em> Warenkorb</a>
        </div>
      </header>
      <nav className="nav">
        <a href="/" onClick={(e) => navigate(e, "/")}>🏠</a>
        <a href="#cidenbridge">CidenBridge</a>
          <a href="/reparatur" onClick={(e) => navigate(e, "/reparatur")}>Reparatur</a>
        <a href="/shop" onClick={(e) => navigate(e, "/shop")}>Shop</a>
        <a href="/shop/smartphones" onClick={(e) => navigate(e, "/shop/smartphones")}>Smartphones</a>
        <a href="/shop/gebrauchte-smartphones" onClick={(e) => navigate(e, "/shop/gebrauchte-smartphones")}>Gebrauchtgeräte</a>
        <a href="/shop/zubehoer" onClick={(e) => navigate(e, "/shop/zubehoer")}>Zubehör</a>
        <a href="/shop/sim-karten" onClick={(e) => navigate(e, "/shop/sim-karten")}>SIM-Karten</a>
        <a href="/serviceformular" onClick={(e) => navigate(e, "/serviceformular")}>Serviceformular</a>
        <a href="/handy-reparatur-hagen" onClick={(e) => navigate(e, "/handy-reparatur-hagen")}>Hagen Service</a>
      </nav>
    </>
  );
}

function Home({ products, query, setQuery, addToCart, navigate, go }) {
  const newPhones = products.filter(p => p.category === "Neue Smartphones").slice(0, 18);
  const used = products.filter(p => p.category === "Gebrauchte Smartphones").slice(0, 14);
  const cases = products.filter(p => p.subcategory === "Handyhüllen").slice(0, 16);
  const glass = products.filter(p => p.subcategory === "Panzerglas & Folien").slice(0, 16);
  const chargers = products.filter(p => ["Ladegeräte", "Kabel", "Powerbanks"].includes(p.subcategory)).slice(0, 16);
  const audio = products.filter(p => ["Kopfhörer & Audio", "Auto Zubehör", "Adapter"].includes(p.subcategory)).slice(0, 14);
  const sims = products.filter(p => p.category === "SIM-Karten & Tarife").slice(0, 12);
  const services = products.filter(p => p.category === "Service").slice(0, 8);

  return (
    <main>
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">Suntel Handyshop · Badstraße 6 · 58095 Hagen</p>
          <h1>Ihr Technik-Shop <span>in Hagen</span></h1>
          <p className="lead">Handyreparatur, neue & gebrauchte Smartphones, Zubehör, SIM-Karten, Passfotos & Kopierservice — kompetent, schnell & persönlich für Sie da.</p>
          <div className="heroButtons">
            <a href="/shop" onClick={(e) => navigate(e, "/shop")} className="btn primary">Jetzt shoppen</a>
            <a href="/reparatur" onClick={(e) => navigate(e, "/reparatur")} className="btn ghost">Reparatur buchen</a>
            <a href="https://wa.me/4915739684985" className="btn whatsapp">WhatsApp</a>
          </div>
          <div className="trustLine">
            <span>✓ Schneller Service</span>
            <span>✓ Faire Preise</span>
            <span>✓ Geprüfte Geräte</span>
            <span>✓ Seit 24 Jahren in Hagen</span>
          </div>
        </div>
        <HeroVisual />
      </section>
          <CidenBridgePilot />

      <section className="brandRail">
        {BRANDS.map(b => <button key={b} onClick={() => go(`/shop?brand=${encodeURIComponent(b)}`)}>{b}</button>)}
      </section>

      <BrandModelBrowser navigate={navigate} />
      <ShopWorldOverview navigate={navigate} />

      <section className="categoryGrid">
        <Category title="Neue Smartphones" text="Apple, Samsung, Xiaomi & mehr" href="/shop/smartphones" navigate={navigate} icon="📱" />
        <Category title="Gebrauchte Geräte" text="geprüft, gereinigt, fairer Preis" href="/shop/gebrauchte-smartphones" navigate={navigate} icon="✅" />
        <Category title="Zubehör & Hüllen" text="Hüllen, Kabel, Ladegeräte" href="/shop/zubehoer" navigate={navigate} icon="🎒" />
        <Category title="Panzerglas" text="Schutzfolien & Kamera Schutz" href="/shop/zubehoer" navigate={navigate} icon="🛡️" />
        <Category title="Handyreparatur" text="Display, Akku, Ladebuchse" href="/reparatur" navigate={navigate} icon="🛠️" />
        <Category title="SIM-Karten" text="Ayyıldız, Lyca, Ortel" href="/shop/sim-karten" navigate={navigate} icon="💳" />
      </section>

      <ProductSection title="Beliebte Smartphones" subtitle="Neue Geräte direkt im Shop ansehen und reservieren." products={newPhones} addToCart={addToCart} navigate={navigate} />
      <ProductSection title="Gebrauchte & reservieren." products={newPhones} addToCart={addToCart} navigate={navigate} />
      <ProductSection title="Gebrauchte & geprüfte Smartphones" subtitle="Gereinigt, geprüft und mit Gewährleistung." products={used} addToCart={addToCart} navigate={navigate} />

      <section className="repairBanner repairPhotoBand" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,21,34,.96), rgba(7,21,34,.72)), url(${REAL_IMAGES.repair})` }}>
        <div>
          <p className="eyebrow">Reparaturzentrum Hagen</p>
          <h2>Gerät defekt? Auftrag online vorbereiten.</h2>
          <p>Marke, Modell und Fehler auswählen, Kundendaten eingeben, Auftragsnummer erhalten und Reparaturformular ausdrucken.</p>
          <a className="btn primary" href="/serviceformular" onClick={(e) => navigate(e, "/serviceformular")}>Reparaturformular öffnen</a>
        </div>
        <div className="repairSteps">
          <span>1 Marke wählen</span>
          <span>2 Modell wählen</span>
          <span>3 Fehler beschreiben</span>
          <span>4 Auftrag senden</span>
        </div>
      </section>

      <RepairPriceWorld navigate={navigate} />

      <ProductSection title="Handyhüllen & Schutz" subtitle="Viele Modelle vorbereitet: iPhone, Samsung, Xiaomi, Pixel und mehr." products={cases} addToCart={addToCart} navigate={navigate} />
      <ProductSection title="Panzerglas & Folien" subtitle="Display schützen lassen — auf Wunsch mit Montage im Shop." products={glass} addToCart={addToCart} navigate={navigate} />
      <ProductSection title="Ladegeräte, Kabel & Powerbanks" subtitle="Alles für Alltag, Auto und Reisen." products={chargers} addToCart={addToCart} navigate={navigate} />
      <ProductSection title="Audio, Adapter & Auto-Zubehör" subtitle="Kopfhörer, Halterungen, Adapter und mehr." products={audio} addToCart={addToCart} navigate={navigate} />
      <ProductSection title="SIM-Karten & Tarife" subtitle="Ayyıldız, Lyca Mobile, Ortel Mobile — Aktivierung und Beratung vor Ort." products={sims} addToCart={addToCart} navigate={navigate} />
      <ProductSection title="Passfotos, Kopien & Handyservice" subtitle="Schnell vor Ort erledigen lassen." products={services} addToCart={addToCart} navigate={navigate} />

      <section className="localSeo">
        <h2>Suntel in Hagen: Handyreparatur, Smartphones, Zubehör, SIM-Karten & Passfotos</h2>
        <p>Suntel ist Ihr lokaler Technik-Shop in Hagen. Seit 24 Jahren stehen persönliche Beratung, schnelle Hilfe und faire Preise im Mittelpunkt. Ob Display-Reparatur, Akkuwechsel, Ladeproblem, neues Smartphone, geprüftes Gebrauchtgerät, Handyhülle, Panzerglas, Ladegerät, SIM-Karte oder Passfoto: bei Sun-TEL bekommen Sie viele Leistungen direkt vor Ort.</p>
        <div className="seoLinks">
          <a href="/handy-reparatur-hagen" onClick={(e) => navigate(e, "/handy-reparatur-hagen")}>Handy Reparatur Hagen</a>
          <a href="/iphone-reparatur-hagen" onClick={(e) => navigate(e, "/iphone-reparatur-hagen")}>iPhone Reparatur Hagen</a>
          <a href="/samsung-reparatur-hagen" onClick={(e) => navigate(e, "/samsung-reparatur-hagen")}>Samsung Reparatur Hagen</a>
          <a href="/display-reparatur-hagen" onClick={(e) => navigate(e, "/display-reparatur-hagen")}>Display Reparatur Hagen</a>
          <a href="/akkuwechsel-hagen" onClick={(e) => navigate(e, "/akkuwechsel-hagen")}>Akkuwechsel Hagen</a>
        </div>
      </section>

      <Reviews />
      <PaymentBar />
    </main>
  );
}


function BrandModelBrowser({ navigate }) {
  const groups = [
    {
      brand: "Apple iPhone",
      accent: "🍎",
      text: "iPhone kaufen, gebraucht kaufen oder reparieren lassen.",
      models: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone SE"],
      links: ["/shop/smartphones", "/shop/gebrauchte-smartphones", "/iphone-reparatur-hagen"]
    },
    {
      brand: "Samsung Galaxy",
      accent: "📱",
      text: "Galaxy S, A und gebrauchte Samsung Geräte.",
      models: ["Galaxy S25 Ultra", "Galaxy S25", "Galaxy S24", "Galaxy S23", "Galaxy S22", "Galaxy A56", "Galaxy A36", "Galaxy A26", "Galaxy A17", "Galaxy A54", "Galaxy A53"],
      links: ["/shop/smartphones", "/shop/gebrauchte-smartphones", "/samsung-reparatur-hagen"]
    },
    {
      brand: "Xiaomi / Redmi / POCO",
      accent: "⚡",
      text: "Preiswerte Smartphones, Zubehör und Service.",
      models: ["Xiaomi 15", "Redmi Note 14 Pro", "Redmi Note 13", "Redmi 14C", "POCO X7 Pro", "Mi 11 Lite"],
      links: ["/shop/smartphones", "/shop/zubehoer", "/reparatur"]
    },
    {
      brand: "Google / Motorola / Oppo",
      accent: "🌐",
      text: "Pixel, Moto, Oppo und weitere Android Geräte.",
      models: ["Pixel 9", "Pixel 8a", "Pixel 7", "Moto G85", "Moto G55", "Oppo Reno12", "Oppo A80", "Honor 200 Lite"],
      links: ["/shop/smartphones", "/shop/gebrauchte-smartphones", "/reparatur"]
    }
  ];

  return (
    <section className="modelBrowser">
      <div className="sectionHead">
        <div>
          <h2>Nach Marke & Modell stöbern</h2>
          <p>Der Kunde soll sofort finden, ob sein Gerät, Zubehör oder Reparatur-Service vorbereitet ist.</p>
        </div>
        <a href="/shop" onClick={(e) => navigate(e, "/shop")}>Alle Produkte öffnen →</a>
      </div>

      <div className="modelGrid">
        {groups.map((g) => (
          <article className="modelCard" key={g.brand}>
            <div className="modelTop">
              <span>{g.accent}</span>
              <div>
                <h3>{g.brand}</h3>
                <p>{g.text}</p>
              </div>
            </div>
            <div className="modelChips">
              {g.models.map((m) => (
                <a key={m} href={`/shop?brand=${encodeURIComponent(g.brand.split(" ")[0])}`} onClick={(e) => navigate(e, "/shop")}>{m}</a>
              ))}
            </div>
            <div className="modelActions">
              <a href={g.links[0]} onClick={(e) => navigate(e, g.links[0])}>Kaufen</a>
              <a href={g.links[1]} onClick={(e) => navigate(e, g.links[1])}>Gebraucht</a>
              <a href={g.links[2]} onClick={(e) => navigate(e, g.links[2])}>Reparatur</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ShopWorldOverview({ navigate }) {
  const worlds = [
    ["📱", "Smartphones", "Neue Geräte, geprüfte gebrauchte Geräte und persönliche Beratung.", "/shop/smartphones"],
    ["🧰", "Reparatur", "Display, Akku, Ladebuchse, Kamera, Mikrofon, Software und Wasserschaden.", "/reparatur"],
    ["🛡️", "Schutz", "Panzerglas, Kamera-Schutzglas, Schutzfolien und Montage im Shop.", "/shop/zubehoer"],
    ["🎒", "Hüllen", "Clear Case, Book Case, MagSafe Case und robuste Schutzhüllen.", "/shop/zubehoer"],
    ["🔌", "Laden", "USB-C, Lightning, Schnellladegeräte, Auto-Lader und Powerbanks.", "/shop/zubehoer"],
    ["🎧", "Audio", "Kopfhörer, Bluetooth Earbuds, Adapter und Lautsprecher.", "/shop/zubehoer"],
    ["💳", "SIM & Tarife", "Ayyıldız, Lyca Mobile, Ortel, Aktivierung und Aufladung.", "/shop/sim-karten"],
    ["🪪", "Passfotos", "Biometrische Passbilder, Bewerbungsfotos, Kopien und Scan.", "/shop"]
  ];

  return (
    <section className="shopWorld">
      <div className="shopWorldIntro">
        <p className="eyebrow">Alles rund ums Handy</p>
        <h2>Ein echter Technik-Shop, nicht nur eine Visitenkarte</h2>
        <p>Die Seite zeigt dem Kunden sofort: Hier kann man kaufen, reparieren lassen, Zubehör finden, SIM-Karten aktivieren und Services direkt in Hagen erledigen.</p>
      </div>
      <div className="worldGrid">
        {worlds.map(([icon, title, text, href]) => (
          <a className="worldCard" href={href} onClick={(e) => navigate(e, href)} key={title}>
            <span>{icon}</span>
            <strong>{title}</strong>
            <p>{text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function RepairPriceWorld({ navigate }) {
  const repairs = [
    ["Display Reparatur", "ab Anfrage", "iPhone, Samsung, Xiaomi und viele weitere Modelle"],
    ["Akkuwechsel", "ab Anfrage", "Wenn der Akku schnell leer ist oder das Gerät ausgeht"],
    ["Ladebuchse", "ab Anfrage", "Lädt nicht, Wackelkontakt oder Kabel wird nicht erkannt"],
    ["Kamera", "ab Anfrage", "Frontkamera, Hauptkamera oder Glas beschädigt"],
    ["Mikrofon / Lautsprecher", "ab Anfrage", "Kein Ton, leise Gespräche oder defekte Audioausgabe"],
    ["Wasserschaden Prüfung", "ab Anfrage", "Reinigung, Diagnose und mögliche Datenrettung"],
    ["Software Diagnose", "ab Anfrage", "Updates, Fehler, Apps, Einrichtung und Datenübertragung"],
    ["Backcover / Gehäuse", "ab Anfrage", "Rückseite, Rahmen oder Gehäuse beschädigt"]
  ];

  return (
    <section className="repairWorld">
      <div className="sectionHead">
        <div>
          <h2>Reparatur-Service vorbereitet</h2>
          <p>Preise werden nach Modell bestätigt. Der Kunde kann den Auftrag direkt online vorbereiten.</p>
        </div>
        <a href="/serviceformular" onClick={(e) => navigate(e, "/serviceformular")}>Auftrag starten →</a>
      </div>
      <div className="repairPriceGrid">
        {repairs.map(([title, price, text]) => (
          <article key={title}>
            <b>{title}</b>
            <strong>{price}</strong>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


function HeroVisual() {
  return (
    <div className="heroPhoto" style={{ backgroundImage: `linear-gradient(90deg, rgba(5,13,24,.95), rgba(5,13,24,.30)), url(${REAL_IMAGES.hero})` }}>
      <div className="heroPhotoCards">
        <span>📱 Neue Smartphones</span>
        <span>🛠️ Reparatur-Service</span>
        <span>💳 SIM-Karten</span>
        <span>🎧 Zubehör</span>
      </div>
    </div>
  );
}

function Category({ title, text, href, navigate, icon }) {
  return (
    <a className="categoryCard" href={href} onClick={(e) => navigate(e, href)}>
      <div>{icon}</div>
      <strong>{title}</strong>
      <span>{text}</span>
    </a>
  );
}

function ProductSection({ title, subtitle, products, addToCart, navigate }) {
  if (!products.length) return null;
  return (
    <section className="section">
      <div className="sectionHead">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <a href="/shop" onClick={(e) => navigate(e, "/shop")}>Alle ansehen →</a>
      </div>
      <div className="productScroller">
        {products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} navigate={navigate} />)}
      </div>
    </section>
  );
}

function ProductCard({ product, addToCart, navigate }) {
  return (
    <article className="productCard">
      <a href={`/product/${product.slug}`} onClick={(e) => navigate(e, `/product/${product.slug}`)} className="productImageLink">
        <ProductVisual product={product} />
      </a>
      <div className="productInfo">
        <small>{product.category} · {product.subcategory}</small>
        <h3>{product.title}</h3>
        <p>{(product.specs || []).slice(0, 3).join(" · ")}</p>
        <div className="priceRow">
          <strong>{money(product.price)}</strong>
          <span>{product.stock > 0 ? "verfügbar" : "auf Anfrage"}</span>
        </div>
        <div className="cardActions">
          <a href={`/product/${product.slug}`} onClick={(e) => navigate(e, `/product/${product.slug}`)}>Details</a>
          <button onClick={() => addToCart(product)}>In den Warenkorb</button>
        </div>
      </div>
    </article>
  );
}

function ProductVisual({ product, big = false }) {
  const type = product.imageType || "accessory";
  const label = product.model || product.brand || "Suntel";
  const style = { "--a": product.colorA || "#dbeafe", "--b": product.colorB || "#2563eb" };

  if (product.imageUrl) {
    return (
      <div className={big ? "visual photoVisual big" : "visual photoVisual"} style={style}>
        <img src={product.imageUrl} alt={product.imageAlt || product.title || "Suntel Produkt"} loading={big ? "eager" : "lazy"} />
        <em>{product.badge}</em>
      </div>
    );
  }

  if (type === "phone") {
    return (
      <div className={big ? "visual phoneVisual big" : "visual phoneVisual"} style={style}>
        <div className="phoneShell">
          <i></i><i></i><i></i>
          <span>{label}</span>
        </div>
        <em>{product.badge}</em>
      </div>
    );
  }

  if (type === "sim") {
    return (
      <div className={big ? "visual simVisual big" : "visual simVisual"} style={style}>
        <div className="simCards"><b>{product.brand}</b><span>SIM</span></div>
        <em>{product.badge}</em>
      </div>
    );
  }

  const iconMap = {
    case: "📱", glass: "🛡️", charger: "🔌", cable: "🔗", powerbank: "🔋", audio: "🎧", holder: "🧲", adapter: "🔁", service: "🧾", accessory: "🎁"
  };

  return (
    <div className={big ? "visual accessoryVisual big" : "visual accessoryVisual"} style={style}>
      <div className="accessoryIcon">{iconMap[type] || "🎁"}</div>
      <strong>{product.subcategory}</strong>
      <em>{product.badge}</em>
    </div>
  );
}

function ShopPage({ products, path, query, setQuery, addToCart, navigate }) {
  const params = new URLSearchParams(window.location.search);
  const initialBrand = params.get("brand") || "";
  const [brand, setBrand] = useState(initialBrand);
  const [category, setCategory] = useState(categoryFromPath(path));
  const [subcategory, setSubcategory] = useState("");
  const [sort, setSort] = useState("popular");

  useEffect(() => setCategory(categoryFromPath(path)), [path]);

  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = [...new Set(products.filter(p => !category || p.category === category).map(p => p.subcategory))];

  const filtered = useMemo(() => {
    let list = [...products];
    const q = query.trim().toLowerCase();
    if (category) list = list.filter(p => p.category === category);
    if (brand) list = list.filter(p => p.brand === brand);
    if (subcategory) list = list.filter(p => p.subcategory === subcategory);
    if (q) list = list.filter(p => [p.title, p.brand, p.model, p.category, p.subcategory, p.description].join(" ").toLowerCase().includes(q));
    if (sort === "price-asc") list.sort((a,b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list.sort((a,b) => Number(b.price) - Number(a.price));
    return list;
  }, [products, query, category, brand, subcategory, sort]);

  return (
    <main className="page">
      <div className="pageHero small">
        <h1>Shop</h1>
        <p>Smartphones, geprüfte Gebrauchtgeräte, Zubehör, SIM-Karten und Services bei Suntel in Hagen.</p>
      </div>

      <div className="shopLayout">
        <aside className="filters">
          <h3>Filtern</h3>
          <label>Suche<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Produkt suchen..." /></label>
          <label>Kategorie<select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Alle Kategorien</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
          <label>Unterkategorie<select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}><option value="">Alle</option>{subcategories.map(c => <option key={c}>{c}</option>)}</select></label>
          <label>Marke<select value={brand} onChange={(e) => setBrand(e.target.value)}><option value="">Alle Marken</option>{[...new Set(products.map(p => p.brand))].sort().map(b => <option key={b}>{b}</option>)}</select></label>
          <label>Sortierung<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="popular">Beliebt</option><option value="price-asc">Preis aufsteigend</option><option value="price-desc">Preis absteigend</option></select></label>
          <button onClick={() => { setBrand(""); setCategory(""); setSubcategory(""); setQuery(""); }}>Filter zurücksetzen</button>
        </aside>

        <section className="shopResults">
          <div className="resultHead"><h2>{filtered.length} Produkte</h2><p>Viele Artikel sind direkt im Shop verfügbar oder reservierbar.</p></div>
          <div className="gridProducts">
            {filtered.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} navigate={navigate} />)}
          </div>
        </section>
      </div>
    </main>
  );
}

function categoryFromPath(path) {
  if (path.includes("gebrauchte")) return "Gebrauchte Smartphones";
  if (path.includes("smartphones")) return "Neue Smartphones";
  if (path.includes("zubehoer")) return "Zubehör";
  if (path.includes("sim-karten")) return "SIM-Karten & Tarife";
  return "";
}

function ProductPage({ products, slug, addToCart, navigate }) {
  const product = products.find(p => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
  }, [slug]);

  if (!product) {
    return (
      <main className="page">
        <div className="empty">
          <h1>Produkt wird geladen...</h1>
          <p>Falls das Produkt nicht erscheint, bitte zurück zum Shop gehen.</p>
          <a className="btn primary" href="/shop" onClick={(e) => navigate(e, "/shop")}>Zum Shop</a>
        </div>
      </main>
    );
  }

  const gallery = Array.isArray(product.gallery) && product.gallery.length
    ? product.gallery
    : [product.imageUrl].filter(Boolean);

  const currentImage = gallery[activeImage] || product.imageUrl;
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 10);

  const specs = Array.isArray(product.specs) && product.specs.length
    ? product.specs
    : ["Sofort verfügbar", "Persönliche Beratung", "Abholung im Shop möglich"];

  const whatsappText = encodeURIComponent(
    `Hallo Sun-TEL, ich interessiere mich für dieses Produkt: ${product.title}. Preis: ${money(product.price)}`
  );

  const addMultiple = () => {
    addToCart(product, qty);
  };

  const buyNow = (e) => {
    e.preventDefault();
    addToCart(product, qty);
    navigate(e, "/checkout");
  };

  return (
    <main className="page productDetailPage">
      <div className="productBreadcrumb">
        <a href="/" onClick={(e) => navigate(e, "/")}>Startseite</a>
        <span>›</span>
        <a href="/shop" onClick={(e) => navigate(e, "/shop")}>Shop</a>
        <span>›</span>
        <a href="/shop" onClick={(e) => navigate(e, "/shop")}>{product.category}</a>
        <span>›</span>
        <b>{product.title}</b>
      </div>

      <section className="productDetailV2">
        <div className="productGalleryV2">
          <div className="mainProductPhoto">
            {currentImage ? (
              <img src={currentImage} alt={product.imageAlt || product.title} />
            ) : (
              <ProductVisual product={product} big />
            )}
            <span className="galleryBadge">{product.badge || "Suntel"}</span>
          </div>

          <div className="thumbRow">
            {gallery.map((img, idx) => (
              <button
                key={img + idx}
                className={idx === activeImage ? "active" : ""}
                onClick={() => setActiveImage(idx)}
                type="button"
              >
                <img src={img} alt={`${product.title} Bild ${idx + 1}`} />
              </button>
            ))}
          </div>

          <div className="detailTrustGrid">
            <span>✓ Direkt im Shop reservierbar</span>
            <span>✓ Persönliche Beratung in Hagen</span>
            <span>✓ Sichere Zahlung & Abholung</span>
            <span>✓ Seit 24 Jahren in Hagen</span>
          </div>
        </div>

        <div className="productDetailInfoV2">
          <span className="badge">{product.badge || "Verfügbar"}</span>
          <p className="muted">{product.category} · {product.subcategory} · {product.brand}</p>

          <h1>{product.title}</h1>

          <div className="ratingLine">
            <strong>★★★★★</strong>
            <span>4,9 / 5 · Beratung vor Ort · beliebter Artikel</span>
          </div>

          <div className="detailPriceBox">
            <strong>{money(product.price)}</strong>
            {product.oldPrice ? <em>statt {money(product.oldPrice)}</em> : null}
            <span>{product.stock > 0 ? "✓ sofort verfügbar" : "auf Anfrage"}</span>
          </div>

          <p className="detailDescription">
            {product.description || `${product.title} bei Suntel in Hagen. Persönliche Beratung, faire Preise und direkte Abholung im Shop möglich.`}
          </p>

          <ul className="specListV2">
            {specs.map((s) => <li key={s}>✓ {s}</li>)}
            <li>✓ Abholung in der Badstraße 6, 58095 Hagen möglich</li>
            <li>✓ Telefonische Beratung: 02331 3484182</li>
          </ul>

          <div className="buyBox">
            <label>
              Menge
              <input
                type="number"
                min="1"
                max="20"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              />
            </label>

            <button className="btn primary" onClick={addMultiple}>In den Warenkorb</button>
            <a className="btn checkoutBtn" href="/checkout" onClick={buyNow}>Direkt zur Kasse</a>
            <a className="btn ghost" href={`https://wa.me/4915739684985?text=${whatsappText}`}>WhatsApp Anfrage</a>
          </div>

          <div className="pickupBox">
            <h3>Abholung & Beratung im Shop</h3>
            <p>Dieses Produkt kann online reserviert und direkt bei Sun-TEL in Hagen abgeholt werden. Bei Zubehör und Reparaturfragen beraten wir persönlich vor Ort.</p>
            <div>
              <span>📍 Badstraße 6, 58095 Hagen</span>
              <span>☎ 02331 3484182</span>
              <span>🟢 WhatsApp 015739684985</span>
            </div>
          </div>
        </div>
      </section>

      <section className="productInfoTabs">
        <article>
          <h2>Produktbeschreibung</h2>
          <p>{product.description}</p>
          <p>Bei Suntel erhalten Sie nicht nur ein Produkt, sondern auch persönliche Beratung, passende Zubehör-Empfehlungen und Unterstützung bei Einrichtung, Datenübertragung oder Reparaturfragen.</p>
        </article>

        <article>
          <h2>Technische Details</h2>
          <div className="detailTable">
            <span>Kategorie</span><b>{product.category}</b>
            <span>Unterkategorie</span><b>{product.subcategory}</b>
            <span>Marke</span><b>{product.brand}</b>
            <span>Modell</span><b>{product.model || "Universal"}</b>
            <span>Artikelstatus</span><b>{product.stock > 0 ? "Verfügbar" : "Auf Anfrage"}</b>
            <span>Gewährleistung</span><b>{product.warranty || "12 Monate Gewährleistung"}</b>
          </div>
        </article>

        <article>
          <h2>Warum bei Sun-TEL kaufen?</h2>
          <div className="whyGrid">
            <span>🏪 Lokaler Ansprechpartner in Hagen</span>
            <span>🛠 Reparatur & Service direkt vor Ort</span>
            <span>💬 Beratung per WhatsApp oder Telefon</span>
            <span>🔒 Sichere Bestellung und Abholung</span>
          </div>
        </article>
      </section>

      <ProductSection
        title="Passende Produkte"
        subtitle="Weitere Artikel, die zu diesem Produkt oder dieser Kategorie passen."
        products={related}
        addToCart={addToCart}
        navigate={navigate}
      />
    </main>
  );
}


function CartPage({ cartItems, updateQty, removeItem, navigate }) {
  const total = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  return (
    <main className="page">
      <div className="pageHero small"><h1>Warenkorb</h1><p>Prüfen Sie Ihre Artikel und gehen Sie weiter zur Kasse.</p></div>
      {!cartItems.length ? (
        <div className="empty"><h2>Ihr Warenkorb ist leer.</h2><a className="btn primary" href="/shop" onClick={(e) => navigate(e, "/shop")}>Zum Shop</a></div>
      ) : (
        <div className="cartLayout">
          <section className="cartList">
            {cartItems.map(({ product, qty, lineTotal }) => (
              <div className="cartItem" key={product.id}>
                <ProductVisual product={product} />
                <div><h3>{product.title}</h3><p>{product.category} · {product.subcategory}</p><strong>{money(product.price)}</strong></div>
                <input type="number" min="1" value={qty} onChange={(e) => updateQty(product.id, e.target.value)} />
                <b>{money(lineTotal)}</b>
                <button onClick={() => removeItem(product.id)}>Entfernen</button>
              </div>
            ))}
          </section>
          <aside className="summary">
            <h2>Zusammenfassung</h2>
            <p>Zwischensumme</p>
            <strong>{money(total)}</strong>
            <small>Versand / Abholung wird im Checkout gewählt.</small>
            <a className="btn primary" href="/checkout" onClick={(e) => navigate(e, "/checkout")}>Zur Kasse</a>
          </aside>
        </div>
      )}
    </main>
  );
}

function CheckoutPage({ cartItems, clearCart, navigate }) {
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", street: "", zip: "", city: "Hagen",
    deliveryType: "Abholung im Shop", payment: "Bar bei Abholung", note: ""
  });
  const total = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      customer: {
        firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email
      },
      delivery: {
        type: form.deliveryType, street: form.street, zip: form.zip, city: form.city
      },
      payment: form.payment,
      note: form.note,
      items: cartItems.map(x => ({ productId: x.product.id, qty: x.qty }))
    };
    const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.ok) {
      setDone(data.orderNo);
      clearCart();
    }
  };

  if (done) {
    return <main className="page"><div className="success"><h1>Bestellung erhalten ✅</h1><p>Ihre Bestellnummer: <b>{done}</b></p><p>Suntel wird Ihre Anfrage prüfen. Bei Abholung oder Rückfragen kontaktieren wir Sie.</p><a className="btn primary" href="/" onClick={(e) => navigate(e, "/")}>Zur Startseite</a></div></main>;
  }

  return (
    <main className="page">
      <div className="pageHero small"><h1>Kasse</h1><p>Bestellung vorbereiten. Online-Zahlung wird später mit PayPal/Stripe verbunden.</p></div>
      <form className="checkoutForm" onSubmit={submit}>
        <section>
          <h2>Kundendaten</h2>
          <div className="formGrid">
            <input required placeholder="Vorname" value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} />
            <input required placeholder="Nachname" value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} />
            <input required placeholder="Telefon" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
            <input required type="email" placeholder="E-Mail" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
          </div>
          <h2>Lieferart</h2>
          <select value={form.deliveryType} onChange={e => setForm({...form, deliveryType:e.target.value})}>
            <option>Abholung im Shop</option>
            <option>Versand</option>
          </select>
          <div className="formGrid">
            <input placeholder="Straße / Hausnummer" value={form.street} onChange={e => setForm({...form, street:e.target.value})} />
            <input placeholder="PLZ" value={form.zip} onChange={e => setForm({...form, zip:e.target.value})} />
            <input placeholder="Ort" value={form.city} onChange={e => setForm({...form, city:e.target.value})} />
          </div>
          <h2>Zahlungsart</h2>
          <select value={form.payment} onChange={e => setForm({...form, payment:e.target.value})}>
            <option>Bar bei Abholung</option>
            <option>Überweisung</option>
            <option>PayPal Anfrage</option>
            <option>Kartenzahlung im Laden</option>
          </select>
          <textarea placeholder="Hinweis zur Bestellung" value={form.note} onChange={e => setForm({...form, note:e.target.value})}></textarea>
        </section>
        <aside className="summary">
          <h2>Ihre Bestellung</h2>
          {cartItems.map(({product, qty}) => <p key={product.id}>{qty}× {product.title}</p>)}
          <strong>{money(total)}</strong>
          <button className="btn primary" disabled={!cartItems.length}>Bestellung senden</button>
        </aside>
      </form>
    </main>
  );
}


function RepairImageShowcase() {
  const cards = [
    {
      img: REAL_IMAGES.repairCounter,
      title: "Annahme & Beratung",
      text: "Kunde bringt das Gerät vorbei oder sendet es ein. Wir prüfen den Schaden und erklären die nächsten Schritte."
    },
    {
      img: REAL_IMAGES.repairWorkbench,
      title: "Display, Akku & Ladebuchse",
      text: "Saubere Werkstattarbeit mit präzisen Werkzeugen, Ersatzteilen und sorgfältiger Prüfung."
    },
    {
      img: REAL_IMAGES.repairDiagnostics,
      title: "Diagnose & Datenrettung",
      text: "Für schwierige Fälle: Platinenprüfung, Mikroskop-Arbeit und professionelle Fehleranalyse."
    }
  ];

  return (
    <section className="repairImageShowcase">
      <div className="sectionHead">
        <div>
          <h2>Unsere Werkstatt in Hagen</h2>
          <p>So soll der Kunde sehen: Hier wird wirklich professionell repariert, geprüft und beraten.</p>
        </div>
        <a href="/serviceformular">Reparaturauftrag starten →</a>
      </div>
      <div className="repairImageGrid">
        {cards.map((c) => (
          <article className="repairImageCard" key={c.title}>
            <img src={c.img} alt={c.title} loading="lazy" />
            <div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


function RepairPage({ navigate }) {
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState(REPAIR_MODELS.Apple[0]);
  const [issue, setIssue] = useState(ISSUE_TYPES[0]);
  const [done, setDone] = useState(null);
  const [form, setForm] = useState({ firstName:"", lastName:"", phone:"", email:"", address:"", serial:"", delivery:"Im Laden abgeben", note:"", acceptedTerms:false });

  useEffect(() => {
    setModel((REPAIR_MODELS[brand] || ["Modell manuell eingeben"])[0]);
  }, [brand]);

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      customer: { firstName:form.firstName, lastName:form.lastName, phone:form.phone, email:form.email, address:form.address },
      device: { brand, model, serial:form.serial },
      issue: { type: issue },
      delivery: form.delivery,
      note: form.note,
      acceptedTerms: form.acceptedTerms
    };
    const res = await fetch("/api/repairs", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.ok) setDone(data.ticketNo);
  };

  if (done) {
    return (
      <main className="page">
        <div className="success">
          <h1>Reparaturauftrag erstellt ✅</h1>
          <p>Ihre Auftragsnummer: <b>{done}</b></p>
          <p>Sie können das Formular drucken und dem Gerät beilegen.</p>
          <a className="btn primary" href={`/api/repairs/${done}/print`} target="_blank">Formular drucken / PDF speichern</a>
          <a className="btn ghost" href="/" onClick={(e) => navigate(e, "/")}>Zur Startseite</a>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="pageHero repair photoHero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5,13,24,.96), rgba(5,13,24,.42)), url(${REAL_IMAGES.repair})` }}>
        <h1>Handyreparatur in Hagen</h1>
        <p>Display kaputt, Akku schwach, Ladebuchse defekt oder Softwareproblem? Reparaturauftrag online vorbereiten und direkt zu Sun-TEL bringen oder einsenden.</p>
      </div>
      <RepairImageShowcase />
      <form className="repairForm" onSubmit={submit}>
        <section>
          <h2>1. Gerät auswählen</h2>
          <div className="formGrid">
            <label>Marke<select value={brand} onChange={e => setBrand(e.target.value)}>{Object.keys(REPAIR_MODELS).map(b => <option key={b}>{b}</option>)}</select></label>
            <label>Modell<select value={model} onChange={e => setModel(e.target.value)}>{(REPAIR_MODELS[brand] || []).map(m => <option key={m}>{m}</option>)}</select></label>
            <label>Fehler<select value={issue} onChange={e => setIssue(e.target.value)}>{ISSUE_TYPES.map(i => <option key={i}>{i}</option>)}</select></label>
            <label>IMEI / Seriennummer<input value={form.serial} onChange={e => setForm({...form, serial:e.target.value})} placeholder="optional" /></label>
          </div>

          <h2>2. Kundendaten</h2>
          <div className="formGrid">
            <input required placeholder="Vorname" value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} />
            <input required placeholder="Nachname" value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} />
            <input required placeholder="Telefon" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
            <input required type="email" placeholder="E-Mail" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
            <input className="wide" placeholder="Adresse" value={form.address} onChange={e => setForm({...form, address:e.target.value})} />
          </div>

          <h2>3. Abgabe & Beschreibung</h2>
          <select value={form.delivery} onChange={e => setForm({...form, delivery:e.target.value})}>
            <option>Im Laden abgeben</option>
            <option>Per Versand einsenden</option>
          </select>
          <textarea required placeholder="Fehlerbeschreibung: Was ist passiert? Seit wann besteht der Fehler?" value={form.note} onChange={e => setForm({...form, note:e.target.value})}></textarea>
          <label className="check"><input type="checkbox" required checked={form.acceptedTerms} onChange={e => setForm({...form, acceptedTerms:e.target.checked})} /> Ich akzeptiere die Kundenhinweise, Datenschutz und Reparaturbedingungen.</label>
          <button className="btn primary">Reparaturauftrag senden</button>
        </section>
        <aside className="repairInfo">
          <h3>Beliebte Reparaturen</h3>
          {ISSUE_TYPES.slice(0,7).map(i => <span key={i}>✓ {i}</span>)}
          <h3>Sun-TEL Vorteil</h3>
          <p>Seit 24 Jahren in Hagen · schnelle Prüfung · faire Preise · persönliche Beratung.</p>
        </aside>
      </form>
    </main>
  );
}

function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("suntel_admin_token") || "");
  const [login, setLogin] = useState({ username:"admin", password:"" });
  const [data, setData] = useState({ products:[], orders:[], repairs:[] });
  const [tab, setTab] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [productSearch, setProductSearch] = useState("");

  const emptyProduct = {
    title:"",
    brand:"Suntel",
    model:"",
    category:"Zubehör",
    subcategory:"Handyhüllen",
    price:"",
    oldPrice:"",
    stock:"1",
    badge:"Neu",
    imageType:"accessory",
    imageUrl:"",
    description:"",
    specs:"Sofort verfügbar,Top Qualität,Beratung im Shop",
    warranty:"12 Monate Gewährleistung"
  };

  const [productForm, setProductForm] = useState(emptyProduct);

  const load = async (tok = token) => {
    if (!tok) return;
    const res = await fetch("/api/admin/summary", {
      headers: { Authorization: `Bearer ${tok}` }
    });

    if (res.ok) {
      const d = await res.json();
      setData(d);
    } else {
      localStorage.removeItem("suntel_admin_token");
      setToken("");
    }
  };

  useEffect(() => { load(); }, []);

  const doLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(login)
    });

    const d = await res.json();

    if (d.ok) {
      localStorage.setItem("suntel_admin_token", d.token);
      setToken(d.token);
      setMessage("Login erfolgreich.");
      setTimeout(() => load(d.token), 150);
    } else {
      setMessage("Login fehlgeschlagen.");
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProductForm(emptyProduct);
    setMessage("");
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setProductForm({
      title:p.title || "",
      brand:p.brand || "Suntel",
      model:p.model || "",
      category:p.category || "Zubehör",
      subcategory:p.subcategory || "",
      price:p.price ?? "",
      oldPrice:p.oldPrice ?? "",
      stock:p.stock ?? 1,
      badge:p.badge || "Neu",
      imageType:p.imageType || "accessory",
      imageUrl:p.imageUrl || "",
      description:p.description || "",
      specs:Array.isArray(p.specs) ? p.specs.join(",") : (p.specs || ""),
      warranty:p.warranty || "12 Monate Gewährleistung"
    });
    setTab("products");
    setMessage(`Produkt bearbeiten: ${p.title}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/admin/upload-image", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body: JSON.stringify({
        filename:file.name,
        mime:file.type,
        data
      })
    });

    const d = await res.json();

    if (!d.ok) {
      throw new Error(d.message || d.error || "Upload fehlgeschlagen");
    }

    return d.url;
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setMessage("Bild wird hochgeladen...");
      const url = await uploadImage(file);
      setProductForm((old) => ({ ...old, imageUrl:url }));
      setMessage("Bild hochgeladen. Produkt speichern nicht vergessen.");
    } catch (err) {
      setMessage("Upload Fehler: " + String(err.message || err));
    }
  };

  const generateFreeAiImage = async () => {
    const title = String(productForm.title || "").trim();

    if (!title) {
      setMessage("Bitte zuerst Produktname eingeben.");
      return;
    }

    setMessage("Kostenloses lokales KI-Symbolbild wird erstellt...");

    try {
      const res = await fetch("/api/admin/generate-symbol-image", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });

      const d = await res.json();

      if (!d.ok) {
        setMessage("Bild konnte nicht erstellt werden: " + (d.error || res.status));
        return;
      }

      setProductForm((old) => ({
        ...old,
        imageUrl: d.imageUrl || d.url,
        imageSource: "KI-Symbolbild"
      }));

      setMessage("Kostenloses KI-Symbolbild erstellt. Produkt speichern nicht vergessen.");
    } catch (err) {
      setMessage("KI Bild Fehler: " + String(err.message || err));
    }
  };

  const aiAutofillProduct = async () => {
    const title = String(productForm.title || "").trim();

    if (!title) {
      setMessage("Bitte zuerst Produktname eingeben.");
      return;
    }

    setMessage("Suntel AI füllt die Produktdaten aus...");

    try {
      const res = await fetch("/api/admin/product-autofill", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });

      const d = await res.json();

      if (!d.ok) {
        setMessage("AI Autofill Fehler: " + (d.error || res.status));
        return;
      }

      const ai = d.product || {};

      setProductForm((old) => ({
        ...old,
        title: ai.title || old.title,
        brand: ai.brand || old.brand,
        model: ai.model || old.model,
        category: ai.category || old.category,
        subcategory: ai.subcategory || old.subcategory,
        price: ai.price ?? old.price,
        oldPrice: ai.oldPrice ?? old.oldPrice,
        stock: ai.stock ?? old.stock,
        badge: ai.badge || old.badge,
        imageType: ai.imageType || old.imageType,
        imageUrl: ai.imageUrl || old.imageUrl,
        description: ai.description || old.description,
        specs: Array.isArray(ai.specs) ? ai.specs.join(",") : (ai.specs || old.specs),
        warranty: ai.warranty || old.warranty
      }));

      setMessage(ai.note || "Produktdaten automatisch ausgefüllt. Bitte prüfen und speichern.");
    } catch (err) {
      setMessage("AI Autofill Fehler: " + String(err.message || err));
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const payload = {
      ...productForm,
      price:Number(productForm.price || 0),
      oldPrice:productForm.oldPrice ? Number(productForm.oldPrice) : null,
      stock:Number(productForm.stock || 0),
      specs:String(productForm.specs || "")
        .split(",")
        .map(x => x.trim())
        .filter(Boolean)
    };

    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify(payload)
    });

    if (res.ok) {
      setMessage(editingId ? "Produkt gespeichert." : "Produkt hinzugefügt.");
      resetProductForm();
      await load();
    } else {
      const d = await res.json().catch(() => ({}));
      setMessage("Fehler beim Speichern: " + (d.error || res.status));
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Produkt wirklich löschen?")) return;

    await fetch(`/api/admin/products/${id}`, {
      method:"DELETE",
      headers:{ Authorization:`Bearer ${token}` }
    });

    setMessage("Produkt gelöscht.");
    load();
  };

  const updateOrder = async (id, status) => {
    await fetch(`/api/admin/orders/${id}`, {
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({ status })
    });
    load();
  };

  const updateRepair = async (id, status) => {
    await fetch(`/api/admin/repairs/${id}`, {
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({ status })
    });
    load();
  };

  const filteredProducts = data.products.filter((p) => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return true;
    return [p.title, p.brand, p.model, p.category, p.subcategory]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  if (!token) {
    return (
      <main className="adminLogin">
        <form onSubmit={doLogin}>
          <h1>Suntel Admin</h1>
          <p>Admin-Passwort liegt auf dem Server unter: /root/suntelshop-admin.txt</p>
          {message ? <div className="adminMessage">{message}</div> : null}
          <input placeholder="Benutzer" value={login.username} onChange={e => setLogin({...login, username:e.target.value})} />
          <input type="password" placeholder="Passwort" value={login.password} onChange={e => setLogin({...login, password:e.target.value})} />
          <button className="btn primary">Einloggen</button>
        </form>
      </main>
    );
  }

  return (
    <main className="adminPage adminPageV2">
      <aside>
        <h2>Sun-TEL Admin</h2>
        <button onClick={() => setTab("dashboard")}>Dashboard</button>
        <button onClick={() => setTab("products")}>Produkte ({data.products.length})</button>
        <button onClick={() => setTab("orders")}>Bestellungen ({data.orders.length})</button>
        <button onClick={() => setTab("repairs")}>Reparaturen ({data.repairs.length})</button>
        <button onClick={() => { localStorage.removeItem("suntel_admin_token"); setToken(""); }}>Logout</button>
      </aside>

      <section>
        {message ? <div className="adminMessage">{message}</div> : null}

        {tab === "dashboard" && (
          <div>
            <h1>Dashboard</h1>
            <div className="adminStats">
              <b>{data.products.length}<span>Produkte</span></b>
              <b>{data.orders.length}<span>Bestellungen</span></b>
              <b>{data.repairs.length}<span>Reparaturen</span></b>
            </div>

            <div className="adminQuick">
              <article>
                <h3>Shop Status</h3>
                <p>Produkte, Bestellungen und Reparaturen werden direkt in JSON-Dateien gespeichert.</p>
              </article>
              <article>
                <h3>Bildsystem</h3>
                <p>Neue Produktbilder werden nach /uploads/products gespeichert und sofort im Shop angezeigt.</p>
              </article>
              <article>
                <h3>Nächster Schritt</h3>
                <p>Mail-System und Atelcom Import können später ergänzt werden.</p>
              </article>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div>
            <h1>{editingId ? "Produkt bearbeiten" : "Produkt hinzufügen"}</h1>

            <form className="adminProductFormV2" onSubmit={saveProduct}>
              <label className="productNameAiField">
                Produktname
                <div className="aiInputRow">
                  <input required value={productForm.title} onChange={e => setProductForm({...productForm, title:e.target.value})} placeholder="z.B. Samsung Galaxy A56 5G oder Panzerglas iPhone 15" />
                  <button type="button" onClick={aiAutofillProduct}>AI füllen</button>
                </div>
              </label>
              <label>Marke<input value={productForm.brand} onChange={e => setProductForm({...productForm, brand:e.target.value})} /></label>
              <label>Modell<input value={productForm.model} onChange={e => setProductForm({...productForm, model:e.target.value})} /></label>

              <label>Kategorie
                <select value={productForm.category} onChange={e => setProductForm({...productForm, category:e.target.value})}>
                  <option>Neue Smartphones</option>
                  <option>Gebrauchte Smartphones</option>
                  <option>Zubehör</option>
                  <option>SIM-Karten & Tarife</option>
                  <option>Service</option>
                </select>
              </label>

              <label>Unterkategorie<input value={productForm.subcategory} onChange={e => setProductForm({...productForm, subcategory:e.target.value})} /></label>
              <label>Preis<input required type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price:e.target.value})} /></label>
              <label>Alter Preis<input type="number" step="0.01" value={productForm.oldPrice || ""} onChange={e => setProductForm({...productForm, oldPrice:e.target.value})} /></label>
              <label>Stock<input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock:e.target.value})} /></label>
              <label>Badge<input value={productForm.badge} onChange={e => setProductForm({...productForm, badge:e.target.value})} /></label>

              <label>Bildtyp
                <select value={productForm.imageType} onChange={e => setProductForm({...productForm, imageType:e.target.value})}>
                  <option value="phone">phone</option>
                  <option value="case">case</option>
                  <option value="glass">glass</option>
                  <option value="charger">charger</option>
                  <option value="cable">cable</option>
                  <option value="powerbank">powerbank</option>
                  <option value="audio">audio</option>
                  <option value="sim">sim</option>
                  <option value="service">service</option>
                  <option value="accessory">accessory</option>
                </select>
              </label>

              <label className="wide">Bild URL<input value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl:e.target.value})} placeholder="/uploads/products/bild.jpg oder https://..." /></label>

              <label className="wide">Bild hochladen
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageFile} />
              </label>

              <div className="wide aiImageTools">
                <button type="button" onClick={generateFreeAiImage}>Kostenloses AI Bild erstellen</button>
                <small>Erstellt ein lokales KI-Symbolbild ohne API-Kosten und ohne fremde Bildrechte.</small>
              </div>

              {productForm.imageUrl ? (
                <div className="adminImagePreview wide">
                  <img src={productForm.imageUrl} alt="Vorschau" />
                  <span>{productForm.imageUrl}</span>
                </div>
              ) : null}

              <label className="wide">Beschreibung<textarea value={productForm.description} onChange={e => setProductForm({...productForm, description:e.target.value})}></textarea></label>
              <label className="wide">Specs, durch Komma getrennt<input value={productForm.specs} onChange={e => setProductForm({...productForm, specs:e.target.value})} /></label>
              <label className="wide">Gewährleistung<input value={productForm.warranty} onChange={e => setProductForm({...productForm, warranty:e.target.value})} /></label>

              <div className="adminFormActions wide">
                <button className="btn primary">{editingId ? "Produkt speichern" : "Produkt hinzufügen"}</button>
                {editingId ? <button type="button" className="btn ghost" onClick={resetProductForm}>Abbrechen</button> : null}
              </div>
            </form>

            <div className="adminListHead">
              <h2>Produktliste</h2>
              <input placeholder="Produkt suchen..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
            </div>

            <div className="adminTableV2">
              {filteredProducts.map(p => (
                <div key={p.id}>
                  <img src={p.imageUrl || "/favicon.ico"} alt={p.title} />
                  <span>
                    <b>{p.title}</b>
                    <small>{p.brand} · {p.category} · {p.subcategory}</small>
                  </span>
                  <strong>{money(p.price)}</strong>
                  <em>{p.stock > 0 ? `${p.stock} Stück` : "0"}</em>
                  <button onClick={() => editProduct(p)}>Bearbeiten</button>
                  <button className="danger" onClick={() => deleteProduct(p.id)}>Löschen</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h1>Bestellungen</h1>
            <div className="adminCards">
              {data.orders.map(o => (
                <div className="adminCard" key={o.id}>
                  <h3>{o.orderNo}</h3>
                  <p>{o.customer?.firstName} {o.customer?.lastName} · {o.customer?.phone}</p>
                  <p>{o.customer?.email}</p>
                  <p>{o.items?.length} Artikel · {money(o.total)}</p>
                  <select value={o.status} onChange={e => updateOrder(o.id, e.target.value)}>
                    <option>Neu</option>
                    <option>In Bearbeitung</option>
                    <option>Abholbereit</option>
                    <option>Versendet</option>
                    <option>Abgeschlossen</option>
                  </select>
                  <details>
                    <summary>Artikel anzeigen</summary>
                    {(o.items || []).map((i, idx) => <p key={idx}>{i.qty}× {i.title} · {money(i.lineTotal)}</p>)}
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "repairs" && (
          <div>
            <h1>Reparaturen</h1>
            <div className="adminCards">
              {data.repairs.map(r => (
                <div className="adminCard" key={r.id}>
                  <h3>{r.ticketNo}</h3>
                  <p>{r.customer?.firstName} {r.customer?.lastName} · {r.customer?.phone}</p>
                  <p>{r.customer?.email}</p>
                  <p>{r.device?.brand} {r.device?.model} · {r.issue?.type}</p>
                  <select value={r.status} onChange={e => updateRepair(r.id, e.target.value)}>
                    <option>Neu eingegangen</option>
                    <option>In Prüfung</option>
                    <option>Ersatzteil bestellt</option>
                    <option>In Reparatur</option>
                    <option>Abholbereit</option>
                    <option>Abgeschlossen</option>
                  </select>
                  <a href={`/api/repairs/${r.ticketNo}/print`} target="_blank">PDF / Druck</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}


function SeoPage({ path, navigate }) {
  let title = "Handy Reparatur Hagen";
  let text = "Suntel bietet Handyreparatur in Hagen: Display, Akku, Ladebuchse, Software, Wasserschaden und Datenübertragung.";
  if (path.includes("iphone")) { title = "iPhone Reparatur Hagen"; text = "iPhone Display kaputt, Akku schwach oder Ladebuchse defekt? Sun-TEL in Hagen hilft schnell und persönlich."; }
  if (path.includes("samsung")) { title = "Samsung Reparatur Hagen"; text = "Samsung Galaxy Reparatur in Hagen: Display, Akku, Ladebuchse und Diagnose bei Suntel."; }
  if (path.includes("display")) { title = "Display Reparatur Hagen"; text = "Displaybruch? Bei Suntel in Hagen erhalten Sie schnelle Prüfung und faire Reparaturberatung."; }
  if (path.includes("akku")) { title = "Akkuwechsel Hagen"; text = "Wenn der Akku schnell leer ist, prüft Suntel in Hagen Ihr Gerät und berät zum Akkuwechsel."; }

  return (
    <main className="page">
      <div className="pageHero repair photoHero repairSeoHero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5,13,24,.96), rgba(5,13,24,.45)), url(${REAL_IMAGES.repairWorkbench})` }}><h1>{title}</h1><p>{text}</p></div>
      <section className="localSeo">
        <h2>Warum Suntel?</h2>
        <p>Seit 24 Jahren in Hagen. Direkt vor Ort, persönliche Beratung, faire Preise und viele Ersatzteile oder Zubehörartikel im Shop.</p>
        <a className="btn primary" href="/serviceformular" onClick={(e) => navigate(e, "/serviceformular")}>Reparaturauftrag starten</a>
      </section>
    </main>
  );
}

function LegalPage({ path, business }) {
  const title = path === "/impressum" ? "Impressum" : path === "/datenschutz" ? "Datenschutz" : "AGB";
  return (
    <main className="page legal">
      <h1>{title}</h1>
      {path === "/impressum" && <div><p><b>Sun-TEL / Suntel</b></p><p>Inhaber: Ali Sun</p><p>Badstraße 6, 58095 Hagen</p><p>Telefon: 02331 3484182</p><p>E-Mail: suntel58135@gmail.com</p></div>}
      {path === "/datenschutz" && <p>Diese Seite enthält grundlegende Datenschutzinformationen. Vor endgültiger Veröffentlichung sollte der Text rechtlich geprüft und vollständig angepasst werden.</p>}
      {path === "/agb" && <p>Diese AGB dienen als Platzhalter für Verkauf, Reparaturannahme und Serviceleistungen. Vor endgültiger Veröffentlichung sollte der Text rechtlich geprüft werden.</p>}
    </main>
  );
}

function Reviews() {
  return (
    <section className="reviews">
      <h2>Warum Kunden zu Suntel kommen</h2>
      <div>
        <Review name="Markus K." text="Super freundliches Team, schnelle Reparatur meines iPhones und fairer Preis. Seit Jahren mein Ansprechpartner in Hagen." />
        <Review name="Sarah Y." text="SIM-Karte gekauft und direkt aktivieren lassen. Gute Beratung und passende Tarife." />
        <Review name="Thomas R." text="Passfotos und Kopien sofort erledigt. Schnell, unkompliziert und freundlich." />
      </div>
    </section>
  );
}

function Review({ name, text }) {
  return <article className="review"><strong>★★★★★</strong><p>{text}</p><b>{name}</b><span>Beispielhafte Bewertung</span></article>;
}

function PaymentBar() {
  return <section className="payments"><b>Zahlungsarten</b><span>PayPal Anfrage</span><span>VISA</span><span>Mastercard</span><span>Überweisung</span><span>Barzahlung</span><span>Kartenzahlung im Laden</span></section>;
}

function Footer({ business, navigate }) {
  return (
    <footer className="footer">
      <div><h2>Sun-<span>TEL</span></h2><p>Ihr Technik-Shop in Hagen.</p><p>Badstraße 6, 58095 Hagen</p><p>02331 3484182</p><p>suntel58135@gmail.com</p><b>Seit 24 Jahren in Hagen</b></div>
      <div><h3>Shop</h3><a href="/shop/smartphones" onClick={(e)=>navigate(e,"/shop/smartphones")}>Smartphones</a><a href="/shop/gebrauchte-smartphones" onClick={(e)=>navigate(e,"/shop/gebrauchte-smartphones")}>Gebrauchte Geräte</a><a href="/shop/zubehoer" onClick={(e)=>navigate(e,"/shop/zubehoer")}>Zubehör</a><a href="/shop/sim-karten" onClick={(e)=>navigate(e,"/shop/sim-karten")}>SIM-Karten</a></div>
      <div><h3>Reparatur</h3><a href="/iphone-reparatur-hagen" onClick={(e)=>navigate(e,"/iphone-reparatur-hagen")}>iPhone Reparatur</a><a href="/samsung-reparatur-hagen" onClick={(e)=>navigate(e,"/samsung-reparatur-hagen")}>Samsung Reparatur</a><a href="/display-reparatur-hagen" onClick={(e)=>navigate(e,"/display-reparatur-hagen")}>Display Reparatur</a><a href="/akkuwechsel-hagen" onClick={(e)=>navigate(e,"/akkuwechsel-hagen")}>Akkuwechsel</a></div>
      <div><h3>Info</h3><a href="/impressum" onClick={(e)=>navigate(e,"/impressum")}>Impressum</a><a href="/datenschutz" onClick={(e)=>navigate(e,"/datenschutz")}>Datenschutz</a><a href="/agb" onClick={(e)=>navigate(e,"/agb")}>AGB</a><a href="/admin" onClick={(e)=>navigate(e,"/admin")}>Admin</a></div>
    </footer>
  );
}

function WhatsAppFloat() {
  return <a className="wa" href="https://wa.me/4915739684985">WhatsApp</a>;
}

createRoot(document.getElementById("root")).render(<App />);
