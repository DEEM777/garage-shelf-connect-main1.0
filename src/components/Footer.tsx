import { Car } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-10 px-4">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Car className="w-5 h-5 text-primary" />
        <span className="font-heading text-lg font-bold">
          <span className="text-primary">Auto</span>Części
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        © 2026 AutoCzęści — Wyszukiwarka części motoryzacyjnych
      </p>
    </div>
  </footer>
);

export default Footer;
