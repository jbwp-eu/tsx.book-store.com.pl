import { useAppSelector } from "@/store/hook";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { type RootState } from "@/store/store";
import dictionary from "@/dictionaries/dictionary";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Form } from "react-router-dom";
import { type ObjectDict } from "@/dictionaries/dictionary";

const AuthRegisterForm = () => {
  const { pathname } = useLocation();
  const { language } = useAppSelector((state: RootState) => state.ui);
  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [nameValue, setNameValue] = useState("");

  const {
    signIn,
    signInPL,
    register,
    registerPL,
    email_label,
    email_placeholder,
    email_placeholderPL,
    password_label,
    password_labelPL,
    password_placeholder,
    password_placeholderPL,
    name_label,
    name_labelPL,
    newCustomer,
    newCustomerPL,
    name_placeholder,
    name_placeholderPL,
    customer,
    customerPL,
  } = dictionary.authRegisterForm as ObjectDict;

  const [searchParams] = useSearchParams();
  const { name, email, isAdmin } = useAppSelector(
    (state) => state.auth.userInfo
  );

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (name && email && !isAdmin) {
      navigate(redirect);
    } else if (name && email && isAdmin) {
      navigate(redirect || "/admin/overview");
    }
  }, [name, email, isAdmin, navigate, redirect]);

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmailValue(e.currentTarget.value);
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordValue(e.currentTarget.value);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNameValue(e.currentTarget.value);
  }

  const authForm = (
    <>
      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="email">{email_label}</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder={
            language === "en" ? email_placeholder : email_placeholderPL
          }
          value={emailValue}
          onChange={handleEmailChange}
        />
      </p>
      <p className="flex flex-col space-y-2 my-2">
        <Label htmlFor="password">
          {language === "en" ? password_label : password_labelPL}
        </Label>
        <Input
          id="password"
          type="text"
          name="password"
          placeholder={
            language === "en" ? password_placeholder : password_placeholderPL
          }
          value={passwordValue}
          onChange={handlePasswordChange}
        />
      </p>
    </>
  );

  function cancelHandler() {
    navigate("..");
  }

  /* for form */

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // console.log(emailValue, nameValue, passwordValue);
  //   // const formData = new FormData();
  //   // formData.append("email", emailValue);
  //   // formData.append("name", nameValue);
  //   // formData.append("password", passwordValue);

  //   // submit(formData, { method: "post" });

  //   submit(e.currentTarget, { method: "post" });
  // };

  return (
    <Form method="post">
      <div className="sm:w-md mx-auto mt-6">
        {pathname === "/login" && (
          <>
            <h2 className="h2-semibold py-4">
              {language === "en" ? signIn : signInPL}
            </h2>
            {authForm}
            <div className="flex gap-2 mt-6 items-center">
              <p>{language === "en" ? newCustomer : newCustomerPL}</p>
              <Button asChild variant="link">
                <Link
                  to={
                    redirect !== "/"
                      ? `/register?redirect=${redirect}`
                      : "/register"
                  }
                >
                  {language === "en" ? register : registerPL}
                </Link>
              </Button>
            </div>
          </>
        )}
        {pathname === "/register" && (
          <>
            <h2 className="h2-bold">
              {language === "en" ? register : registerPL}
            </h2>
            <p className="flex flex-col space-y-2 my-4">
              <Label htmlFor="name">
                {language === "en" ? name_label : name_labelPL}
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder={
                  language === "en" ? name_placeholder : name_placeholderPL
                }
                value={nameValue}
                onChange={handleNameChange}
              />
            </p>
            {authForm}
            <div className="flex gap-2 mt-6 items-center">
              <p>{language === "en" ? customer : customerPL}</p>
              <Button asChild variant="link">
                <Link
                  to={
                    redirect !== "/" ? `/login?redirect=${redirect}` : "/login"
                  }
                >
                  {language === "en" ? signIn : signInPL}
                </Link>
              </Button>
            </div>
          </>
        )}
        {/* actions */}
        <div className="flex gap-4 mt-6 justify-end">
          <Button type="button" variant="ghost" onClick={cancelHandler}>
            Cancel
          </Button>
          <Button type="submit">
            {pathname === "/login"
              ? language === "en"
                ? signIn
                : signInPL
              : language === "en"
              ? register
              : registerPL}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AuthRegisterForm;
