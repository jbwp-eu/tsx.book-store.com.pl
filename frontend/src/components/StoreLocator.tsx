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
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

const StoreLocator = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="hover:cursor-pointer">
        <Globe />
        <h2 className="font-semibold">{t("footer.store_locator")}</h2>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="h2-semibold">{t("footer.store_locator")}</p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-4">
              <iframe
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
                {t("reviewForm.button_cancel")}
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StoreLocator;
