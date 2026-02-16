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
import dictionary from "@/dictionaries/dictionary";
import { type ObjectDict } from "@/dictionaries/dictionary";
import type { RootState } from "@/store/store";
import type { MessageProps, User } from "@/types";
import { formatId } from "@/utils/formatUtils";
import { useSelector } from "react-redux";
import {
  NavLink,
  useLoaderData,
  useSubmit,
  type ActionFunctionArgs,
} from "react-router-dom";
import { toast } from "sonner";

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
    // throw new Error(resData.message);
    toast.error(resData.message);
    return resData;
  } else {
    return response;
  }
};

const UsersListPage = () => {
  const data = useLoaderData<User[] | MessageProps>();
  const submit = useSubmit();

  const { language } = useSelector((state: RootState) => state.ui);

  const {
    title,
    titlePL,
    id,
    idPL,
    name,
    namePL,
    email,
    role,
    rolePL,
    actions,
    actionsPL,
    user_text,
    user_textPL,
    admin,
    adminPL,
    edit,
    editPL,
  } = dictionary.usersList as ObjectDict;

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
        <h2 className="h2-semibold py-4">
          {language === "en" ? title : titlePL}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === "en" ? id : idPL}</TableHead>
              <TableHead className="text-center">
                {language === "en" ? name : namePL}
              </TableHead>
              <TableHead className="text-center">{email}</TableHead>
              <TableHead className="text-center">
                {language === "en" ? role : rolePL}
              </TableHead>
              <TableHead className="text-right">
                {language === "en" ? actions : actionsPL}
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
                    <Badge>{language === "en" ? admin : adminPL}</Badge>
                  ) : (
                    <Badge variant="outline">
                      {language === "en" ? user_text : user_textPL}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-4">
                  <Button asChild variant="outline">
                    <NavLink to={`/admin/user/${user.id}/edit`}>
                      {language === "en" ? edit : editPL}
                    </NavLink>
                  </Button>
                  {/* <Button
                    variant="destructive"
                    onClick={() => deleteUserHandler(user.id)}
                  >
                    {language === "en" ? delete_text : delete_textPL}
                  </Button> */}
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
      // throw new Error(resData.message);
      toast.error(resData.message);
    } else {
      const resData = await response.json();
      toast.success(resData.message);
    }
  };

UsersListPage.loader = loader;
UsersListPage.action = action;

export default UsersListPage;
