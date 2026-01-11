export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="brand">
          <span className="brand__dot" />
          <span className="brand__name">MASKA</span>
        </div>

        <nav className="nav">
          <a href="#benefits">Benefits</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
        </nav>

        <a className="btn btn--ghost" href="#buy">Shop Now</a>
      </div>
    </header>
  );
}
