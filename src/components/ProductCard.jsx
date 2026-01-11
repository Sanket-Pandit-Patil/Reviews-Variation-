import { useState } from "react";
import { useCountUpOnView } from "../hooks/useCountUpOnView.js";

export default function ProductCard() {
  const bought = useCountUpOnView(18, { duration: 700 });
  const viewing = useCountUpOnView(42, { duration: 700 });

  const [size, setSize] = useState("300");
  const [qty, setQty] = useState(1);

  const priceMap = {
    "300": { mrp: "Rs. 339.00", sale: "Rs. 288.20" },
    "500": { mrp: "Rs. 499.00", sale: "Rs. 429.00" }, // update if exact
  };

  const current = priceMap[size];

  const decQty = () => setQty((q) => Math.max(1, q - 1));
  const incQty = () => setQty((q) => Math.min(20, q + 1));

  return (
    <div className="product-info-card">
      <div className="product-card__info buybox">
        {/* TOP */}
        <div className="buybox__top">
          <div className="buybox__head">
           <h2 className="product-title product-title--xl">Chatpata Peanut Butter (Spicy)</h2>
            <span className="tiny-pill">Chef crafted</span>
          </div>

          <div className="size-selector">
            <span className="size-label">Size</span>
            <div className="size-buttons">
              <button
                type="button"
                className={`size-btn ${size === "300" ? "is-active" : ""}`}
                onClick={() => setSize("300")}
              >
                300g
              </button>
              <button
                type="button"
                className={`size-btn ${size === "500" ? "is-active" : ""}`}
                onClick={() => setSize("500")}
              >
                500g
              </button>
            </div>
          </div>

          <div className="price">
            <div className="price__block">
              <span className="price__old">{current.mrp}</span>
              <span className="price__now">{current.sale}</span>
              <span className="price__badge">Sale</span>
            </div>
            <span className="price__note">Free Shipping.</span>
          </div>

          <div className="rating-row">
            <span className="chip">★ 4.74</span>
            <span className="muted">10000+ units sold</span>
          </div>

          <div className="qty-block">
            <span className="qty-label">Quantity</span>
            <div className="qty">
              <button type="button" className="qty__btn" onClick={decQty} aria-label="Decrease quantity">
                −
              </button>
              <span className="qty__num" aria-live="polite">
                {qty}
              </span>
              <button type="button" className="qty__btn" onClick={incQty} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE (stretches to fill) */}
        <div className="buybox__middle">
          <div className="mini-widgets">
            <div className="widget" ref={bought.ref}>
              <span className="dot dot--green" />
              <span>
                <b>{bought.value}</b> bought in last 2 hours
              </span>
            </div>

            <div className="widget" ref={viewing.ref}>
              <span className="dot dot--orange" />
              <span>
                <b>{viewing.value}</b> people viewing now
              </span>
            </div>
          </div>

          <div className="divider" />
          <div className="perks">
            <span className="perk">⚡ Fresh dispatch</span>
            <span className="perk">✅ Verified reviews</span>
            <span className="perk">🔒 Secure checkout</span>
          </div>
        </div>

        {/* BOTTOM (pinned) */}
        <div className="buybox__bottom">
          <a className="btn btn--primary btn--full" href="#">
            Add to cart
          </a>

          <p className="fineprint">No spam. Just peanut-butter joy. ✅</p>
        </div>
      </div>
    </div>
  );
}
