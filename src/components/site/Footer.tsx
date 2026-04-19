import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const cols = [
  {
    h: "Eat",
    l: [
      { label: "Food", to: "/food" },
      { label: "Groceries", to: "/groceries" },
      { label: "Pharmacy", to: "/pharmacy" },
      { label: "Errands", to: "/errands" },
    ],
  },
  {
    h: "Earn",
    l: [
      { label: "For Vendors", to: "/vendors" },
      { label: "For Riders", to: "/riders" },
      { label: "Affiliate", to: "/affiliate" },
      { label: "Press", to: "/press" },
    ],
  },
  {
    h: "Help",
    l: [
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/#faq" },
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
    ],
  },
];

export const Footer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to === "/#faq") {
      e.preventDefault();
      if (pathname === "/") {
        const el = document.getElementById("faq");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        navigate("/#faq");
      }
    }
  };

  return (
  <footer className="bg-foreground text-background">
    <div className="container py-16">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
        <div className="col-span-2">
          <div className="rounded-2xl bg-background p-3 inline-block">
            <img src={logo} alt="GoBuyMe" className="h-8 w-auto" />
          </div>
          <p className="mt-6 max-w-xs text-background/70">
            Delivering happiness — one jollof, grocery run and midnight craving at a time.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <div className="font-mono-pop text-xs uppercase tracking-widest text-primary">{c.h}</div>
            <ul className="mt-4 space-y-2">
              {c.l.map((i) => (
                <li key={i.label}>
                  <Link to={i.to} onClick={(e) => handleClick(e, i.to)} className="text-background/80 hover:text-background">{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="border-t border-background/15">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 font-mono-pop text-xs uppercase tracking-widest text-background/60 md:flex-row">
        <span>Powered by Bubble Barrel Commerce Limited. © {new Date().getFullYear()} GoBuyMe. Deliver Happiness.</span>
        <span>Made with 🌶️ in Owerri</span>
      </div>
    </div>
  </footer>
  );
};
