import dictionary from "@/dictionaries/dictionary";
import { useAppSelector } from "@/store/hook.ts";
import { type RootState } from "@/store/store.ts";
import { type ArrayDict } from "@/dictionaries/dictionary";
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ current = 0 }) => {
  // const { checkout_steps, checkout_stepsPL } = dictionary as {
  //   [key: string]: ArrayDict;
  // };

  const { checkoutSteps } = dictionary as { [key: string]: ArrayDict };

  const { language } = useAppSelector((state: RootState) => state.ui);

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
            {language === "en" ? step.text : step.textPL}
          </Link>
          {step.text !== "Place Order" && "Zamówienie" && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
