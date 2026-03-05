import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Globe } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { Button } from "./ui/button";

const StoreLocator = () => {
  const [open, setOpen] = useState(false);
  const { language } = useSelector((state: RootState) => state.ui);

  const { store_locator, store_locatorPL } = dictionary.footer as ObjectDict;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="hover:cursor-pointer">
        <Globe />
        <h2 className="font-semibold">
          {language === "en" ? store_locator : store_locatorPL}
        </h2>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="h2-semibold">
              {language === "en" ? store_locator : store_locatorPL}
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-4">
              <iframe
                // src="https://sl-widget.proguscommerce.com/main?shop=96aba7ff-5ddf-49cf-8299-de535c9bb02b306"
                src="https://sl-widget.proguscommerce.com/main?shop=f2e861df-1afc-44be-ad9f-ee22d1779fa3313"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allow="geolocation"
                allowFullScreen
              />
            </div>
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                className="mr-auto"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StoreLocator;
