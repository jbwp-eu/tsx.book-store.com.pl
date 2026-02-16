import CheckoutSteps from "@/components/CheckoutSteps";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import { Card, CardContent } from "@/components/ui/card";

const ShippingPage = () => {
  return (
    <div>
      <CheckoutSteps current={1} />
      <Card className="max-w-lg mx-auto mt-16">
        <CardContent>
          <ShippingAddressForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingPage;
