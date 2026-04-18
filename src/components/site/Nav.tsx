import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logo from "@/assets/gobuyme-logo.jpg";

const links = [
  { label: "Eat", href: "#services" },
  { label: "How", href: "#how" },
  { label: "Vendors", href: "#vendors" },
  { label: "Riders", href: "#riders" },
  { label: "FAQ", href: "#faq" },
];

export const Nav = () => {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b-2 border-ink bg-background/85 backdrop-blur-md"
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="GoBuyMe" className="h-8 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-mono-pop text-xs uppercase tracking-widest hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <Button variant="default" className="rounded-full border-2 border-ink bg-foreground text-background shadow-pop-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-mono-pop text-xs uppercase tracking-widest">
          Get the app ↓
        </Button>
      </div>
    </motion.header>
  );
};
