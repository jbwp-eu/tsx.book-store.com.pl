import { useAppSelector } from "@/store/hook";
import { Button } from "./ui/button";
import dictionary from "@/dictionaries/dictionary";
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
import { type ObjectDict } from "@/dictionaries/dictionary";
import { useContext } from "react";
import StateContextProvider from "./StateContext";

const UserButton = () => {
  const {
    signIn,
    signInPL,
    signOut,
    signOutPL,
    message_signOut,
    message_signOutPL,
    userProfile,
    userProfilePL,
    orderHistory,
    orderHistoryPL,
    products,
    orders,
    users,
    productsPL,
    ordersPL,
    usersPL,
    reviewList,
    reviewListPL,
    reviews,
    reviewsPL,
    overview,
    overviewPL,
    admin_text,
    admin_textPL,
  } = dictionary.navigation as ObjectDict;

  const { language } = useAppSelector((state) => state.ui);
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
          {language === "en" ? signIn : signInPL}
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
                {language === "en" ? userProfile : userProfilePL}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink to="/orders" className="hover:font-bold">
                {language === "en" ? orderHistory : orderHistoryPL}
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink to="/reviews" className="hover:font-bold">
                {language === "en" ? reviewList : reviewListPL}
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
                  {language === "en" ? admin_text : admin_textPL}
                </NavLink>
              </DropdownMenuItem>
            )}

            {userInfo.isAdmin && (
              <DropdownMenuItem className="block lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:font-bold">
                    {language === "en" ? admin_text : admin_textPL}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="hover:font-bold ">
                      <NavLink to="/admin/overview">
                        {language === "en" ? overview : overviewPL}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold ">
                      <NavLink to="/admin/productsList">
                        {language === "en" ? products : productsPL}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold">
                      <NavLink to="/admin/ordersList">
                        {language === "en" ? orders : ordersPL}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold">
                      <NavLink to="/admin/usersList">
                        {language === "en" ? users : usersPL}
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:font-bold">
                      <NavLink to="/admin/reviewsList">
                        {language === "en" ? reviews : reviewsPL}
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
                  toast.success(
                    language === "en" ? message_signOut : message_signOutPL
                  );
                }}
              >
                {language === "en" ? signOut : signOutPL}
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
