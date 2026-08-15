import { useState } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import StoreMap from "@/components/StoreMap";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { env } from "@/lib/env";

/** Warsaw — Rondo Dmowskiego 10 (same fallback as nest / gql). */
const FALLBACK_LAT = 52.2299538;
const FALLBACK_LNG = 21.0123946;

const StoreLocator = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const lat = env.storeLatitude ?? FALLBACK_LAT;
  const lng = env.storeLongitude ?? FALLBACK_LNG;
  const hasLocation =
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hover:cursor-pointer">
        <Globe />
        <h2 className="font-semibold">{t("footer.store_locator")}</h2>
      </DialogTrigger>
      <DialogContent className="border bg-card text-card-foreground shadow-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {t("storeMap.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground underline">
            {t("storeMap.comingSoon")}
          </DialogDescription>
        </DialogHeader>

        {hasLocation ? (
          <StoreMap lat={lat} lng={lng} title={env.storeName} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("storeMap.unavailable")}
          </p>
        )}

        <p className="text-sm text-foreground underline decoration-destructive underline-offset-2">
          {t("storeMap.hint")}
        </p>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t("storeMap.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreLocator;
