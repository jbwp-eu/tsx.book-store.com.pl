import { useAppSelector } from "@/store/hook";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";
import { UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hook";
import { toast } from "sonner";
import { useContext } from "react";
import StateContextProvider from "./StateContext";
import { useTranslation } from "react-i18next";

const UserButton = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { t } = useTranslation();
  const { userInfo } = useAppSelector((state) => state.auth);
  const { setIsAdminMenu, setIsCarousel } = useContext(
    StateContextProvider.Context
  );
  const dispatch = useAppDispatch();

  function handleNavigate() {
    onNavigate?.();
  }

  let content;

  if (!userInfo.name || !userInfo.email) {
    content = (
      <Button asChild className="self-start">
        <NavLink to="/login" onClick={handleNavigate}>
          {" "}
          <UserIcon />
          {t("navigation.signIn")}
        </NavLink>
      </Button>
    );
  } else {
    const firstInitial = userInfo.name?.charAt(0).toUpperCase() ?? "U";

    content = (
      <div className="flex gap-2 items-center">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
            >
              {firstInitial}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="text-sm font-medium leading-none">
                  {userInfo?.name}
                </div>
                <div className="text-sm text-muted-foreground leading-none">
                  {userInfo?.email}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <NavLink
                to="/profile"
                className="hover:font-bold"
                onClick={handleNavigate}
              >
                {t("navigation.userProfile")}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink
                to="/orders"
                className="hover:font-bold"
                onClick={handleNavigate}
              >
                {t("navigation.orderHistory")}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink
                to="/reviews"
                className="hover:font-bold"
                onClick={handleNavigate}
              >
                {t("navigation.reviewList")}
              </NavLink>
            </DropdownMenuItem>

            {userInfo.isAdmin && (
              <DropdownMenuItem asChild className="hidden lg:flex">
                <NavLink
                  to="/admin/overview"
                  className="hover:font-bold"
                  onClick={() => {
                    setIsAdminMenu(true);
                    setIsCarousel(false);
                    handleNavigate();
                  }}
                >
                  {t("navigation.admin_text")}
                </NavLink>
              </DropdownMenuItem>
            )}

            {userInfo.isAdmin && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:font-bold lg:hidden">
                  {t("navigation.admin_text")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <NavLink to="/admin/overview" onClick={handleNavigate}>
                      {t("navigation.overview")}
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/admin/productsList" onClick={handleNavigate}>
                      {t("navigation.products")}
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/admin/ordersList" onClick={handleNavigate}>
                      {t("navigation.orders")}
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/admin/usersList" onClick={handleNavigate}>
                      {t("navigation.users")}
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/admin/reviewsList" onClick={handleNavigate}>
                      {t("navigation.reviews")}
                    </NavLink>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            <DropdownMenuItem
              className="mb-1"
              onSelect={() => {
                dispatch(logout());
                toast.success(t("navigation.message_signOut"));
                handleNavigate();
              }}
            >
              {t("navigation.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return content;
};

export default UserButton;
