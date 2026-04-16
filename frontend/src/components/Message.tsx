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
import { useLocation } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const Message = ({
  children,
  className,
  info,
}: {
  children: ReactNode;
  className?: string;
  info?: boolean;
}) => {
  const { t } = useTranslation();
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
          {!info && t("message.error_title")}
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
            <Link to={"/"}>{t("message.button")}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Message;
