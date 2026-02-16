import AuthRegisterForm from "@/components/AuthRegisterForm";
import { Card, CardContent } from "@/components/ui/card";

const RegisterPage = () => {
  return (
    <Card className="max-w-lg mx-auto mt-16">
      <CardContent>
        <AuthRegisterForm />
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
