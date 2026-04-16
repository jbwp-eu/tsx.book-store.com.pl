import DeleteDialog from "@/components/DeleteDialog";
import Message from "@/components/Message";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MessageProps, User } from "@/types";
import { formatId } from "@/utils/formatUtils";
import {
  NavLink,
  useLoaderData,
  useSubmit,
  type ActionFunctionArgs,
} from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const loader = (language: string) => async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/users?language=${language}`,
    {
      headers: {
        authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) {
    const resData = await response.json();
    toast.error(resData.message);
    return resData;
  } else {
    return response;
  }
};

const UsersListPage = () => {
  const { t } = useTranslation();
  const data = useLoaderData<User[] | MessageProps>();
  const submit = useSubmit();

  const deleteUserHandler = (id: string) => {
    submit(
      { id },
      {
        method: "delete",
        encType: "application/json",
      }
    );
  };

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <div>
        <h2 className="h2-semibold py-4">{t("usersList.title")}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("usersList.id")}</TableHead>
              <TableHead className="text-center">
                {t("usersList.name")}
              </TableHead>
              <TableHead className="text-center">{t("usersList.email")}</TableHead>
              <TableHead className="text-center">
                {t("usersList.role")}
              </TableHead>
              <TableHead className="text-right">
                {t("usersList.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id} className="even:bg-gray-50">
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center"> {user.email}</TableCell>
                <TableCell className="text-center">
                  {user.isAdmin ? (
                    <Badge>{t("usersList.admin")}</Badge>
                  ) : (
                    <Badge variant="outline">{t("usersList.user_text")}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-4">
                  <Button asChild variant="outline">
                    <NavLink to={`/admin/user/${user.id}/edit`}>
                      {t("usersList.edit")}
                    </NavLink>
                  </Button>
                  <DeleteDialog onDelete={() => deleteUserHandler(user.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return <>{content}</>;
};

const action =
  (language: string) =>
  async ({ request }: ActionFunctionArgs) => {
    const { id } = await request.json();
    const { method } = request;

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/users/${id}?language=${language}`,
      {
        method,
        headers: {
          authorization: "Bearer " + token,
        },
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

UsersListPage.loader = loader;
UsersListPage.action = action;

export default UsersListPage;
