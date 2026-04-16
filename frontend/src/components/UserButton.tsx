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
} from "./ui/dropdown-menu";
import { logout } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hook";
import { toast } from "sonner";
import { useContext } from "react";
import StateContextProvider from "./StateContext";
import { useTranslation } from "react-i18next";

const UserButton = () => {
  const { t } = useTranslation();
  const { userInfo } = useAppSelector((state) => state.auth);
  const { setIsAdminMenu, setIsCarousel } = useContext(
    StateContextProvider.Context
  );
  const dispatch = useAppDispatch();

  let content;

  if (!userInfo.name || !userInfo.email) {
    content = (
      <Button asChild className="self-start">
        <NavLink to="/login">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200  "
              >
                {firstInitial}
              </Button>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 " align="end">
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
            <DropdownMenuItem>
              <NavLink to="/profile" className="hover:font-bold">
                {t("navigation.userProfile")}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink to="/orders" className="hover:font-bold">
                {t("navigation.orderHistory")}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink to="/reviews" className="hover:font-bold">
                {t("navigation.reviewList")}
              </NavLink>
            </DropdownMenuItem>

            {userInfo.isAdmin && (
              <DropdownMenuItem className="hidden lg:block">
                <NavLink
                  to="/admin/overview"
                  className="hover:font-bold"
                  onClick={() => {
                    setIsAdminMenu(true);
                    setIsCarousel(false);
                  }}
                >
                  {t("navigation.admin_text")}
                </NavLink>
              </DropdownMenuItem>
            )}

            {userInfo.isAdmin && (
              <DropdownMenuItem className="block lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:font-bold">
                    {t("navigation.admin_text")}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="hover:font-bold ">
                      <NavLink to="/admin/overview">
                        {t("navigation.overview")}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold ">
                      <NavLink to="/admin/productsList">
                        {t("navigation.products")}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold">
                      <NavLink to="/admin/ordersList">
                        {t("navigation.orders")}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold">
                      <NavLink to="/admin/usersList">
                        {t("navigation.users")}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold">
                      <NavLink to="/admin/reviewsList">
                        {t("navigation.reviews")}
                      </NavLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="p-0 mb-1">
              <Button
                className="w-full py-4 px-2 h-4 justify-start font-normal hover:font-bold"
                variant="ghost"
                onClick={() => {
                  dispatch(logout());
                  toast.success(t("navigation.message_signOut"));
                }}
              >
                {t("navigation.signOut")}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return content;
};

export default UserButton;
