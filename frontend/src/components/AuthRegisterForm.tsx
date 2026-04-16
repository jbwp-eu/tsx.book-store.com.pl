import { useAppSelector } from "@/store/hook";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { type RootState } from "@/store/store";
import { useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { withFormik, type FormikProps, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { translateLng } from "@/i18n/i18n";

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
  } = props;

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const { t } = useTranslation();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  function cancelHandler() {
    navigate("..");
  }

  const authForm = (
    <>
      <p className="flex flex-col space-y-2 mt-8">
        <Label htmlFor="email">{t("authRegisterForm.email_label")}</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder={t("authRegisterForm.email_placeholder")}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.email && errors.email ? (
        <p className="text-red-500 mb-4">{errors.email}</p>
      ) : null}

      <p className="flex flex-col space-y-2 mt-8">
        <Label htmlFor="password">{t("authRegisterForm.password_label")}</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder={t("authRegisterForm.password_placeholder")}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
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
            <h2 className="h2-semibold">{t("authRegisterForm.signIn")}</h2>
            {authForm}
            <div className="flex gap-2 mt-6 items-center">
              {t("authRegisterForm.newCustomer")}
              <Link
                to={
                  redirect !== "/"
                    ? `/register?redirect=${redirect}`
                    : "/register"
                }
                className="hover:underline"
              >
                {t("authRegisterForm.register")}
              </Link>
            </div>
          </>
        )}
        {pathname === "/register" && (
          <>
            <h2 className="h2-semibold">{t("authRegisterForm.register")}</h2>
            <p className="flex flex-col space-y-2 mt-8">
              <Label htmlFor="name">{t("authRegisterForm.name_label")}</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder={t("authRegisterForm.name_placeholder")}
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
                {t("authRegisterForm.confirmPassword_label")}
              </Label>
              <Input
                id="confirmPassword"
                placeholder={t("authRegisterForm.confirmPassword_placeholder")}
                type="password"
                name="confirmPassword"
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
                checked={values.storeTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-4 w-4"
              />
              <Label htmlFor="storeTerms">
                {t("authRegisterForm.terms_accept")}{" "}
                <Link to="/regulations" className="hover:underline">
                  {t("authRegisterForm.terms_link")}
                </Link>
              </Label>
            </p>
            {touched.storeTerms && errors.storeTerms ? (
              <p className="text-red-500 mb-4">{errors.storeTerms}</p>
            ) : null}

            <div className="flex gap-2 mt-6 items-center">
              <p>{t("authRegisterForm.customer")}</p>

              <Link
                to={redirect !== "/" ? `/login?redirect=${redirect}` : "/login"}
                className="hover:underline"
              >
                {t("authRegisterForm.signIn")}
              </Link>
            </div>
          </>
        )}
        <div className="flex gap-4 mt-6 justify-end">
          <Button type="button" variant="ghost" onClick={cancelHandler}>
            {t("authRegisterForm.button_cancel")}
          </Button>
          <Button type="submit">
            {isSubmitting
              ? t("authRegisterForm.sending")
              : pathname === "/login"
                ? t("authRegisterForm.signIn")
                : t("authRegisterForm.register")}
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
      .email(translateLng(language, "authRegisterForm.yup_email"))
      .required(translateLng(language, "authRegisterForm.yup_email_req")),
    password: Yup.string()
      .min(4, translateLng(language, "authRegisterForm.yup_MustBe"))
      .required(translateLng(language, "authRegisterForm.yup_password")),
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
              translateLng(language, "authRegisterForm.yup_name")
            ),
            storeTerms: Yup.boolean().oneOf(
              [true],
              translateLng(language, "authRegisterForm.yup_storeTerms")
            ),
            confirmPassword: Yup.string().when(
              "password",
              (password, field) => {
                return password[0]
                  ? field
                      .required(
                        translateLng(
                          language,
                          "authRegisterForm.yup_confirmPassword"
                        )
                      )
                      .oneOf(
                        [Yup.ref("password")],
                        translateLng(language, "authRegisterForm.doNotMatch")
                      )
                  : field;
              }
            ),
          }
    ),
    handleSubmit({ email, name, password }: FormValues, { resetForm }: FormikHelpers<FormValues>) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", password);

      submit(formData, { method: "post" });
      resetForm();
    },
  })(MyForm);

  return <MyEnhancedForm />;
};

export default AuthRegisterForm;
