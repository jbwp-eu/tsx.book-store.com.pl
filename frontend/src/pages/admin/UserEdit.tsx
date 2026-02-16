import Message from "@/components/Message";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserEditForm from "@/components/UserEditForm";
// import UserEditForm_old from "@/components/UserEditForm_old";
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import type { RootState } from "@/store/store";
import type { MessageProps, User } from "@/types";
import { useSelector } from "react-redux";
import {
  NavLink,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunction,
} from "react-router-dom";
import { toast } from "sonner";

const loader =
  (language: string): LoaderFunction =>
  async ({ params }) => {
    const { id } = params;
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${id}?language=${language}`,
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
      return resData;
    } else {
      return response;
    }
  };

const UserEditPage = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  const data = useLoaderData<User | MessageProps>();

  const { goBack, goBackPL } = dictionary.userEdit as ObjectDict;

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div>
        <Button asChild variant="outline">
          <NavLink to="/admin/usersList">
            {language === "en" ? goBack : goBackPL}
          </NavLink>
        </Button>
        <Card className="max-w-lg mx-auto mt-16">
          <CardContent>
            {/* <UserEditForm_old user={data} /> */}
            <UserEditForm user={data} />
          </CardContent>
        </Card>
      </div>
    );
  }
  return content;
};

const action =
  (language: string) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const { method } = request;
    const { id } = params;

    const userData = {
      email: formData.get("email"),
      name: formData.get("name"),
      isAdmin: formData.get("isAdmin") === "true" ? true : false,
    };

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${id}?language=${language}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(userData),
      }
    );
    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
      return redirect("/admin/usersList");
    } else {
      const resData = await response.json();
      toast.success(resData.message);
      return redirect("/admin/usersList");
    }
  };

UserEditPage.action = action;

UserEditPage.loader = loader;

export default UserEditPage;
