import CheckoutSteps from "@/components/CheckoutSteps";
import PaymentForm from "@/components/PaymentForm";
import { Card, CardContent } from "@/components/ui/card";

const PaymentPage = () => {
  return (
    <div>
      <CheckoutSteps current={2} />
      <Card className="max-w-lg mx-auto mt-16">
        <CardContent>
          <PaymentForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
