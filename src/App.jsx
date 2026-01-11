import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ReviewsTicker from "./components/ReviewsTicker.jsx";
import ReviewsMedia from "./components/ReviewsMedia.jsx";
import ReviewsData from "./components/ReviewsData.jsx";
import ReviewsSwitch from "./components/ReviewsSwitch.jsx";
import FAQ from "./components/FAQ.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <div className="topbar">
        <p>Free shipping over ₹499 • Delivered in 2–5 days • Made in India</p>
      </div>

      <Header />

      <main>
        <Hero />

        <section className="strip">
          <div className="container strip__inner">
            <p><b>Real people.</b> Real cravings. Real reviews.</p>
            <p className="muted">4 creative variations to show design thinking + hierarchy.</p>
          </div>
        </section>

        <ReviewsSwitch />

        <FAQ />
        <Footer />
      </main>
    </>
  );
}
