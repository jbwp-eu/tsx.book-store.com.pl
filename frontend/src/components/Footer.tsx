import Container from "./Container";
import { Card, CardContent } from "./ui/card";
import { DollarSign, ShoppingBag, WalletCards } from "lucide-react";
import dictionary from "@/dictionaries/dictionary.ts";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store.ts";
import { type ObjectDict } from "@/dictionaries/dictionary.ts";
import ContactForm from "./ContactForm";
import { type ActionFunctionArgs } from "react-router-dom";
import { toast } from "sonner";
import StoreLocator from "./StoreLocator";

const Footer = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  const currentYear = new Date().getFullYear();

  const { VITE_APP_NAME } = import.meta.env;

  const {
    shipping_1,
    shippingPL_1,
    shipping_2,
    shippingPL_2,
    moneyBack_1,
    moneyBackPL_1,
    moneyBack_2,
    moneyBackPL_2,
    payment_1,
    paymentPL_1,
    payment_2,
    paymentPL_2,
  } = dictionary.footer as ObjectDict;

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
              <p className="font-semibold">
                {language === "en" ? shipping_1 : shippingPL_1}
              </p>
              <p className="font-thin">
                {language === "en" ? shipping_2 : shippingPL_2}
              </p>
            </div>
            <div>
              <DollarSign />
              <p className="font-semibold">
                {language === "en" ? moneyBack_1 : moneyBackPL_1}
              </p>
              <p className="font-thin">
                {language === "en" ? moneyBack_2 : moneyBackPL_2}
              </p>
            </div>
            <div>
              <WalletCards />
              <p className="font-semibold">
                {language === "en" ? payment_1 : paymentPL_1}
              </p>
              <p className="font-thin">
                {language === "en" ? payment_2 : paymentPL_2}
              </p>
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
    // const formData = await request.formData();
    const data = await request.json();

    // const email = formData.get("email") as string;
    // const message = formData.get("message") as string;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/contact?language=${language}`,
      {
        method,
        headers: {
          // "Content-Type": "application/x-www-form-urlencoded",
          "Content-Type": "application/json",
        },
        // body: new URLSearchParams(`email=${email}&message=${message}`),
        // body: new URLSearchParams({ email, message }),
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
    } else {
      const resData = await response.json();
      toast.success(resData.message);
    }
  };

Footer.action = action;

export default Footer;
