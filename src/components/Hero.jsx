import ProductCard from "./ProductCard.jsx";
import ProductImage from "./ProductImage.jsx";
import { useCountUpOnView } from "../hooks/useCountUpOnView.js";

export default function Hero() {
  const c1 = useCountUpOnView(1000, { duration: 900 });
  const c2 = useCountUpOnView(4.8, { duration: 900, decimals: 1 });
  const c3 = useCountUpOnView(24, { duration: 900 });

  return (
    <section className="hero">
      <div className="container">

        {/* ✅ TOP ROW: Only Image + Buy Box parallel */}
        <div className="hero__top">
          <div className="hero__media">
            <ProductImage />
          </div>

          <div className="hero__buy">
            <ProductCard />
          </div>
        </div>

        {/* ✅ DETAILS BELOW */}
        <div className="hero__details">
          <div className="pill">
            <span className="pill__star">★</span>
            <span>4.74 rating • Loved by snackers</span>
          </div>

          <h1>
            Peanut Butter<br />
            <span className="accent">(Chatpata)</span>
          </h1>

          <p className="lead">
            This irresistibly temptatious & drooling Chatpata Peanut Butter brings together
            traditional Indian spices with a zesty aroma for a bold, flavorful experience.
          </p>

          <p className="lead">
            Packed with the right fats, fiber, and energy, this chef-crafted recipe helps you
            celebrate the zing of good health—one handful at a time. Your body will love it!
          </p>

          <ul className="bullets" id="benefits">
            <li><span className="tick">✓</span> High-protein snack companion</li>
            <li><span className="tick">✓</span> Chatpata flavor — not boring sweet</li>
            <li><span className="tick">✓</span> Smooth & spreadable</li>
          </ul>

          <div className="hero__cta" id="buy">
            <a className="btn btn--primary" href="#">
              Buy Now <span className="btn__sub">Limited batches</span>
            </a>
            <a className="btn btn--secondary" href="#reviews">See Reviews</a>
          </div>

          <div className="trust">
            <div className="trust__item" ref={c1.ref}>
              <span className="trust__big">{c1.value}+</span>
              <span className="trust__small">Happy customers</span>
            </div>

            <div className="trust__item" ref={c2.ref}>
              <span className="trust__big">{c2.value}</span>
              <span className="trust__small">Average rating</span>
            </div>

            <div className="trust__item" ref={c3.ref}>
              <span className="trust__big">{c3.value}H</span>
              <span className="trust__small">Fresh dispatch</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
