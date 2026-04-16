import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";

type Step = { link: string; text: string };

const CheckoutSteps = ({ current = 0 }) => {
  const { t } = useTranslation();

  const checkoutSteps = t("checkoutSteps", {
    returnObjects: true,
  }) as Step[];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-x-2 space-y-2 mb-10">
      {checkoutSteps.map((step, index) => (
        <React.Fragment key={step.link}>
          <Link
            to={`/${step.link}`}
            className={cn(
              "p-2 w-76 rounded-full text-center text-sm",
              index === current ? "bg-secondary" : "",
              index > current ? "pointer-events-none cursor-context-menu" : ""
            )}
          >
            {step.text}
          </Link>
          {index < checkoutSteps.length - 1 && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
