import { Link, useLocation } from "react-router-dom";
import Container from "./Container";
import Navigation from "./Navigation";
import Search from "./Search";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import adminNavLinks from "@/links/links";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { useContext } from "react";
import StateContextProvider from "./StateContext";

const Header = () => {
  const { t } = useTranslation();
  const { VITE_APP_NAME } = import.meta.env;
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { setIsFilter, isAdminMenu, setIsAdminMenu, setIsCarousel } =
    useContext(StateContextProvider.Context);

  const location = useLocation();

  const { pathname } = location;

  return (
    <header className="w-full border-b">
      <Container>
        <div className="flex justify-between items-center ">
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              onClick={() => {
                setIsFilter((prev) => !prev);
                setIsCarousel(false);
              }}
            >
              <Link to="/">
                <MenuIcon />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="px-0 flex items-center hover:bg-background"
              onClick={() => {
                setIsAdminMenu(false);
                setIsFilter(false);
                setIsCarousel(true);
              }}
            >
              <Link to="/">
                <img src="/logo.svg" alt="logo" width="35px" />
                <h1
                  className={`h1-semibold ml-2 ${
                    userInfo.isAdmin ? "hidden xl:block" : "hidden lg:block"
                  }`}
                >
                  {VITE_APP_NAME}
                </h1>
              </Link>
            </Button>
          </div>

          {userInfo.isAdmin && isAdminMenu && (
            <nav className="hidden lg:flex space-x-2 xl:space-x-4 ">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm  font-medium transition-colors hover:text-primary  ${
                    pathname?.includes(link.href)
                      ? " "
                      : "text-muted-foreground"
                  }`}
                >
                  {t(link.titleKey)}
                </Link>
              ))}
            </nav>
          )}
          <Search />
          <Navigation />
        </div>
      </Container>
    </header>
  );
};

export default Header;
