import AuthRegisterForm from "@/components/AuthRegisterForm";
import { type ActionFunctionArgs } from "react-router-dom";
import { toast } from "sonner";
import { type AppDispatch } from "../store/store.ts";
import { setCredentials } from "@/store/authSlice.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";

const AuthenticationPage = () => {
  return (
    <Card className="max-w-lg mx-auto mt-16">
      <CardContent>
        <AuthRegisterForm />
      </CardContent>
    </Card>
  );
};

const action =
  (dispatch: AppDispatch, language: string) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const { method } = request;

    const mode = window.location.pathname;

    let authData;

    if (mode === "/login") {
      authData = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
    } else {
      authData = {
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users${mode}?language=${language}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authData),
      }
    );

    if (!response.ok) {
      const responseData = await response.json();
      toast.error(responseData.message);
      // throw new Error(responseData.message);
      return;
    }

    const resData = await response.json();

    const { name, email, isAdmin, token, message } = resData;

    localStorage.setItem("token", token);

    dispatch(setCredentials({ name, email, isAdmin }));

    const expiration = new Date();

    expiration.setMinutes(expiration.getMinutes() + 60);

    localStorage.setItem("expiration", expiration.toString());

    toast.success(message);
  };

AuthenticationPage.action = action;

export default AuthenticationPage;
