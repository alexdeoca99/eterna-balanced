import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className="wrap">
        <div className={s.top}>
          <div className={s.brand}>
            <span className={s.mark} aria-hidden />
            <p>
              Root-cause hormone care for women.
              <br />
              Personalized protocols, delivered virtually.
            </p>
          </div>
          <nav className={s.cols} aria-label="Footer">
            <div>
              <h4>Explore</h4>
              <a href="#mission">Approach</a>
              <a href="#process">How it works</a>
              <a href="#founder">Dr. Rouse</a>
              <a href="#services">Services</a>
            </div>
            <div>
              <h4>Get started</h4>
              <a href="#pricing">Free consult</a>
              <a href="#quiz">Hormone Health Score</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
          </nav>
        </div>
        <p className={s.word} aria-hidden>
          Eterna <em>Balanced</em>
        </p>
        <div className={s.bottom}>
          <span>© {new Date().getFullYear()} Eterna Balanced. All rights reserved.</span>
          <span>
            Content on this site is educational and not a substitute for individualized medical advice.
          </span>
        </div>
      </div>
    </footer>
  );
}
