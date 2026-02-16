import { Card, CardContent } from "@/components/ui/card";
import UserProfileForm from "@/components/UserProfileForm";
import { logout, setCredentials } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";
import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { toast } from "sonner";

const ProfilePage = () => {
  return (
    <div>
      <Card className="max-w-lg mx-auto mt-16">
        <CardContent>
          <UserProfileForm />
        </CardContent>
      </Card>
    </div>
  );
};

const action =
  (language: string, dispatch: AppDispatch) =>
  async ({ request }: ActionFunctionArgs) => {
    // const formData = await request.formData();
    // const newUserProfile = {
    //   name: formData.get("name"),
    //   email: formData.get("email"),
    //   password: formData.get("password"),
    //   isAdmin: formData.get("isAdmin"),
    // };

    const updatedUserProfile = await request.json();

    const { method } = request;

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/profile?language=${language}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(updatedUserProfile),
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
      dispatch(logout());
      redirect("/login");
    } else {
      const resData = await response.json();
      const { name, email, isAdmin } = resData;
      dispatch(setCredentials({ name, email, isAdmin }));
      toast.success(resData.message);
      return redirect("/");
    }
  };

ProfilePage.action = action;

export default ProfilePage;
