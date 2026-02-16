// import { type ReactNode } from "react";
import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store.ts";
import dictionary from "@/dictionaries/dictionary.ts";
import { useLocation } from "react-router-dom";
import { type ObjectDict } from "@/dictionaries/dictionary";
import { CircleAlert } from "lucide-react";

const Message = ({
  children,
  className,
  info,
}: {
  children: ReactNode;
  className?: string;
  info?: boolean;
}) => {
  const { language } = useSelector((state: RootState) => state.ui);
  const { button, buttonPL } = dictionary.message as ObjectDict;
  const location = useLocation();

  return (
    <Card
      className={cn(
        `${info ? "bg-info" : "bg-warning"} mx-auto max-w-xl my-12 w-full `,
        className
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            "font-medium text-md lg:text-lg text-destructive mb-2",
            className
          )}
        >
          {!info && (language === "en" ? "Error" : "Błąd")}
        </CardTitle>
        <CardDescription
          className={cn(
            `${
              info ? "text-foreground" : "text-destructive"
            } flex flex-row gap-2 items-center  font-normal text-md lg:text-lg `,
            className
          )}
        >
          <CircleAlert className="w-4" /> {children}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        {location.pathname !== "/" && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn("font-normal", className)}
          >
            <Link to={"/"}>{language === "en" ? button : buttonPL}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Message;
