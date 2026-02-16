import LanguageToggle from "./LanguageToggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { EllipsisVertical } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store.ts";
import dictionary from "@/dictionaries/dictionary.ts";
import UserButton from "./UserButton";
import { type ObjectDict } from "@/dictionaries/dictionary.ts";

const Navigation = () => {
  const { language } = useSelector((state: RootState) => state.ui);

  const { cart, cartPL } = dictionary.navigation as ObjectDict;

  return (
    <div>
      <nav className="hidden sm:flex gap-2 items-center">
        <LanguageToggle />
        <ModeToggle />
        <Button asChild variant="ghost">
          <NavLink to="/cart">
            <ShoppingCart />
            {language === "en" ? cart : cartPL}
          </NavLink>
        </Button>
        <UserButton />
      </nav>
      <nav className="sm:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="p-6">
            <SheetTitle className="font-semibold">Menu</SheetTitle>
            <LanguageToggle />
            <ModeToggle />
            <Button
              asChild
              variant="ghost"
              className="justify-start border self-start"
            >
              <NavLink to="/cart">
                <ShoppingCart />
                {language === "en" ? cart : cartPL}
              </NavLink>
            </Button>
            <UserButton />
          </SheetContent>
          <SheetDescription className="sr-only">
            description goes here
          </SheetDescription>
        </Sheet>
      </nav>
    </div>
  );
};

export default Navigation;
