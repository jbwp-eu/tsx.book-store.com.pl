import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Form } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";

import type { User } from "@/types";

const UserEditForm = ({ user }: { user: User }) => {
  const { email, name, isAdmin } = user;
  const [email_value, setEmail] = useState(email);
  const [name_value, setName] = useState(name);
  const [isAdmin_value, setIsAdmin] = useState(isAdmin);

  const { language } = useSelector((store: RootState) => store.ui);

  const {
    title,
    titlePL,
    email_label,
    email_placeholder,
    email_placeholderPL,
    name_label,
    name_labelPL,
    name_placeholder,
    name_placeholderPL,
    isAdmin_label,
    isAdmin_labelPL,
    update,
    updatePL,
  } = dictionary.userEditForm as ObjectDict;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };
  const handleIsAdminChange = () => {
    setIsAdmin((prev) => !prev);
  };

  return (
    <div>
      <h2 className="h2-semibold py-4">
        {language === "en" ? title : titlePL}
      </h2>
      <Form method="put">
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="email">{email_label}</Label>
          <Input
            id="email"
            placeholder={
              language === "en" ? email_placeholder : email_placeholderPL
            }
            type="email"
            name="email"
            value={email_value}
            onChange={handleEmailChange}
          />
        </p>
        <p className="flex flex-col space-y-2 my-4">
          <Label htmlFor="name">
            {language === "en" ? name_label : name_labelPL}
          </Label>
          <Input
            id="name"
            placeholder={
              language === "en" ? name_placeholder : name_placeholderPL
            }
            type="text"
            name="name"
            value={name_value}
            onChange={handleNameChange}
          />
        </p>
        <p className="flex justify-start space-x-4 ">
          <Input
            id="isAdmin"
            type="checkbox"
            name="isAdmin"
            checked={isAdmin_value}
            onChange={handleIsAdminChange}
            className="h-4 w-4"
          />
          <Label htmlFor="isAdmin">
            {language === "en" ? isAdmin_label : isAdmin_labelPL}
          </Label>
        </p>
        <Button type="submit" className="mt-4 float-right">
          {language === "en" ? update : updatePL}
        </Button>
      </Form>
    </div>
  );
};

export default UserEditForm;
