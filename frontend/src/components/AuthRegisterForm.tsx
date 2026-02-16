import { useAppSelector } from "@/store/hook";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { type RootState } from "@/store/store";
import dictionary from "@/dictionaries/dictionary";
import { useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { type ObjectDict } from "@/dictionaries/dictionary";
import { withFormik, type FormikProps } from "formik";
import * as Yup from "yup";

interface FormValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  storeTerms: boolean;
}

interface OtherProps {
  other?: string;
}

interface MyFormProps {
  initialEmail?: string;
  initialName?: string;
  initialPassword?: string;
  initialConfirmPassword?: string;
  initialStoreTerms?: boolean;
}

const MyForm = (props: OtherProps & FormikProps<FormValues>) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    //other,
  } = props;

  // console.log("errors:", errors);
  // console.log("values:", values);
  // console.log("touched:", touched);

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { language } = useAppSelector((state: RootState) => state.ui);

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
    confirmPassword_placeholder,
    confirmPassword_placeholderPL,
    confirmPassword_label,
    confirmPassword_labelPL,
    customer,
    customerPL,
    sending,
    sendingPL,
  } = dictionary.authRegisterForm as ObjectDict;

  const { pathname } = useLocation();

  const navigate = useNavigate();

  function cancelHandler() {
    navigate("..");
  }

  const authForm = (
    <>
      <p className="flex flex-col space-y-2 mt-8">
        <Label htmlFor="email">{email_label}</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder={
            language === "en" ? email_placeholder : email_placeholderPL
          }
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          // value={emailValue}
          // onChange={handleEmailChange}
        />
      </p>
      {touched.email && errors.email ? (
        <p className="text-red-500 mb-4">{errors.email}</p>
      ) : null}

      <p className="flex flex-col space-y-2 mt-8">
        <Label htmlFor="password">
          {language === "en" ? password_label : password_labelPL}
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder={
            language === "en" ? password_placeholder : password_placeholderPL
          }
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          // value={passwordValue}
          // onChange={handlePasswordChange}
        />
      </p>
      {touched.password && errors.password ? (
        <p className="text-red-500 mb-4">{errors.password}</p>
      ) : null}
    </>
  );
  return (
    <form onSubmit={handleSubmit}>
      <div className="sm:w-md mx-auto mt-6">
        {pathname === "/login" && (
          <>
            <h2 className="h2-semibold">
              {language === "en" ? signIn : signInPL}
            </h2>
            {authForm}
            <div className="flex gap-2 mt-6 items-center">
              {language === "en" ? newCustomer : newCustomerPL}
              <Link
                to={
                  redirect !== "/"
                    ? `/register?redirect=${redirect}`
                    : "/register"
                }
                className="hover:underline"
              >
                {language === "en" ? register : registerPL}
              </Link>
            </div>
          </>
        )}
        {pathname === "/register" && (
          <>
            <h2 className="h2-semibold">
              {language === "en" ? register : registerPL}
            </h2>
            <p className="flex flex-col space-y-2 mt-8">
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
                // value={nameValue}
                // onChange={handleNameChange}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </p>
            {touched.name && errors.name ? (
              <p className="text-red-500 mb-4">{errors.name}</p>
            ) : null}

            {authForm}
            <p className="flex flex-col space-y-2 mt-8">
              <Label htmlFor="confirmPassword">
                {language === "en"
                  ? confirmPassword_label
                  : confirmPassword_labelPL}
              </Label>
              <Input
                id="confirmPassword"
                placeholder={
                  language === "en"
                    ? confirmPassword_placeholder
                    : confirmPassword_placeholderPL
                }
                type="password"
                name="confirmPassword"
                // value={userInfo.confirmPassword}
                // value={confirmPassword}
                // onChange={handleConfirmPasswordChange}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </p>

            {touched.confirmPassword && errors.confirmPassword ? (
              <p className="text-red-500 mb-4">{errors.confirmPassword}</p>
            ) : null}

            <p className="flex justify-start items-center space-x-4 mt-8">
              <Input
                id="storeTerms"
                type="checkbox"
                name="storeTerms"
                // checked={isAdmin_value}
                // onChange={handleIsAdminChange}
                checked={values.storeTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-4 w-4"
              />
              <Label htmlFor="storeTerms">
                {language === "en" ? "Accept" : "Zaakceptuj"}
                <Link to="/regulations" className="hover:underline">
                  {language === "en"
                    ? "the Store regulations"
                    : "regulamin sklepu"}
                </Link>
              </Label>
            </p>
            {touched.storeTerms && errors.storeTerms ? (
              <p className="text-red-500 mb-4">{errors.storeTerms}</p>
            ) : null}

            <div className="flex gap-2 mt-6 items-center">
              <p>{language === "en" ? customer : customerPL}</p>

              <Link
                to={redirect !== "/" ? `/login?redirect=${redirect}` : "/login"}
                className="hover:underline"
              >
                {language === "en" ? signIn : signInPL}
              </Link>
            </div>
          </>
        )}
        {/* actions */}
        <div className="flex gap-4 mt-6 justify-end">
          <Button type="button" variant="ghost" onClick={cancelHandler}>
            Cancel
          </Button>
          <Button type="submit">
            {isSubmitting
              ? language === "en"
                ? sending
                : sendingPL
              : pathname === "/login"
              ? language === "en"
                ? signIn
                : signInPL
              : language === "en"
              ? register
              : registerPL}
          </Button>
        </div>
      </div>
    </form>
  );
};

const AuthRegisterForm = () => {
  const [searchParams] = useSearchParams();
  const { name, email, isAdmin } = useAppSelector(
    (state) => state.auth.userInfo
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { language } = useAppSelector((state: RootState) => state.ui);
  const submit = useSubmit();
  const {
    yup_email,
    yup_emailPL,
    yup_email_req,
    yup_email_reqPL,
    yup_name,
    yup_namePL,
    yup_MustBe,
    yup_MustBePL,
    yup_password,
    yup_passwordPL,
    yup_storeTerms,
    yup_storeTermsPL,
    yup_confirmPassword,
    yup_confirmPasswordPL,
    doNotMatch,
    doNotMatchPL,
  } = dictionary.authRegisterForm as ObjectDict;

  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (name && email && !isAdmin) {
      navigate(redirect);
    } else if (name && email && isAdmin) {
      navigate(redirect || "/admin/overview");
    }
  }, [name, email, isAdmin, navigate, redirect]);

  const autchSchema = {
    email: Yup.string()
      .email(language === "en" ? yup_email : yup_emailPL)
      .required(language === "en" ? yup_email_req : yup_email_reqPL),
    password: Yup.string()
      .min(4, language === "en" ? yup_MustBe : yup_MustBePL)
      .required(language === "en" ? yup_password : yup_passwordPL),
  };

  const MyEnhancedForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: (props) => ({
      email: props.initialEmail || "",
      name: props.initialName || "",
      password: props.initialPassword || "",
      confirmPassword: props.initialConfirmPassword || "",
      storeTerms: props.initialStoreTerms || false,
    }),
    validationSchema: Yup.object().shape(
      pathname === "/login"
        ? autchSchema
        : {
            ...autchSchema,
            name: Yup.string().required(
              language === "en" ? yup_name : yup_namePL
            ),
            storeTerms: Yup.boolean().oneOf(
              [true],
              language === "en" ? yup_storeTerms : yup_storeTermsPL
            ),
            confirmPassword: Yup.string().when(
              "password",
              (password, field) => {
                return password[0]
                  ? field
                      .required(
                        language === "en"
                          ? yup_confirmPassword
                          : yup_confirmPasswordPL
                      )
                      .oneOf(
                        [Yup.ref("password")],
                        language === "en" ? doNotMatch : doNotMatchPL
                      )
                  : field;
              }
            ),
          }
    ),
    handleSubmit({ email, name, password }: FormValues) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);

      submit(formData, { method: "post" });
    },
  })(MyForm);

  return <MyEnhancedForm />;
};

export default AuthRegisterForm;
