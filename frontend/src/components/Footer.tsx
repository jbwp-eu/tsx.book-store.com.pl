import Container from "./Container";
import { Card, CardContent } from "./ui/card";
import { DollarSign, ShoppingBag, WalletCards } from "lucide-react";
import ContactForm from "./ContactForm";
import { type ActionFunctionArgs } from "react-router-dom";
import { toast } from "sonner";
import StoreLocator from "./StoreLocator";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const { VITE_APP_NAME } = import.meta.env;

  return (
    <footer>
      <Container>
        <Card className="text-card-foreground/75">
          <CardContent className="grid md:grid-cols-5 gap-3-1">
            <div>
              <ContactForm />
            </div>
            <div>
              <ShoppingBag />
              <p className="font-semibold">{t("footer.shipping_1")}</p>
              <p className="font-thin">{t("footer.shipping_2")}</p>
            </div>
            <div>
              <DollarSign />
              <p className="font-semibold">{t("footer.moneyBack_1")}</p>
              <p className="font-thin">{t("footer.moneyBack_2")}</p>
            </div>
            <div>
              <WalletCards />
              <p className="font-semibold">{t("footer.payment_1")}</p>
              <p className="font-thin">{t("footer.payment_2")}</p>
            </div>
            <div>
              <StoreLocator />
            </div>
          </CardContent>
        </Card>
      </Container>
      <div className="text-center mb-4 font-thin">
        {currentYear}
        {VITE_APP_NAME}. All Rights Reserved
      </div>
    </footer>
  );
};

const action =
  (language: string) =>
  async ({ request }: ActionFunctionArgs) => {
    const { method } = request;
    const data = await request.json();

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/contact?language=${language}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      toast.error(resData.message);
    } else {
      const resData = await response.json();
      toast.success(resData.message);
    }
  };

Footer.action = action;

export default Footer;
