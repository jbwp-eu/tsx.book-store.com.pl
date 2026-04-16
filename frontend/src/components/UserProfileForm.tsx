import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { NavLink, useSubmit } from "react-router-dom";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { withFormik, type FormikProps } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { translateLng } from "@/i18n/i18n";

interface FormValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface OtherProps {
  other?: string;
}

interface MyFormProps {
  initialEmail?: string;
  initialName?: string;
  initialPassword?: string;
  initialConfirmPassword?: string;
}

const MyForm = (props: OtherProps & FormikProps<FormValues>) => {
  const { t } = useTranslation();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="email">{t("userProfileForm.email_label")}</Label>
        <Input
          id="email"
          placeholder={t("userProfileForm.email_placeholder")}
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.email && errors.email ? (
        <p className="text-red-500">{errors.email}</p>
      ) : null}

      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="name">{t("userProfileForm.name_label")}</Label>
        <Input
          id="name"
          placeholder={t("userProfileForm.name_placeholder")}
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.name && errors.name ? (
        <p className="text-red-500">{errors.name}</p>
      ) : null}

      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="password">{t("userProfileForm.password_label")}</Label>
        <Input
          id="password"
          placeholder={t("userProfileForm.password_placeholder")}
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.password && errors.password ? (
        <p className="text-red-500">{errors.password}</p>
      ) : null}

      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="confirmPassword">
          {t("userProfileForm.confirmPassword_label")}
        </Label>
        <Input
          id="confirmPassword"
          placeholder={t("userProfileForm.confirmPassword_placeholder")}
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.confirmPassword && errors.confirmPassword ? (
        <p className="text-red-500">{errors.confirmPassword}</p>
      ) : null}

      <p className="flex justify-end mt-4 gap-x-4">
        <Button asChild type="button" variant="outline">
          <NavLink to="..">{t("reviewForm.button_cancel")}</NavLink>
        </Button>
        <Button type="submit">
          {isSubmitting
            ? t("userProfileForm.updating")
            : t("userProfileForm.update")}
        </Button>
      </p>
    </form>
  );
};

const UserProfileForm = () => {
  const { language } = useSelector((store: RootState) => store.ui);
  const { t } = useTranslation();

  const submit = useSubmit();

  const { email, name } = useSelector(
    (store: RootState) => store.auth.userInfo
  );

  const MyEnhancedForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: ({
      initialEmail = email,
      initialName = name,
      ...props
    }) => ({
      email: initialEmail || "",
      name: initialName || "",
      password: props.initialPassword || "",
      confirmPassword: props.initialConfirmPassword || "",
    }),
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(translateLng(language, "userProfileForm.yup_email"))
        .required(translateLng(language, "userProfileForm.yup_email_req")),
      name: Yup.string().required(
        translateLng(language, "userProfileForm.yup_name")
      ),
      password: Yup.string()
        .min(4, translateLng(language, "userProfileForm.yup_MustBe"))
        .optional(),
      confirmPassword: Yup.string().when("password", (password, field) => {
        return password[0]
          ? field
              .required(
                translateLng(
                  language,
                  "userProfileForm.yup_confirmPassword"
                )
              )
              .oneOf(
                [Yup.ref("password")],
                translateLng(language, "userProfileForm.doNotMatch")
              )
          : field;
      }),
    }),
    handleSubmit({ email, name, password, confirmPassword }: FormValues) {
      const userInfo = { email, name, password };

      if (userInfo.password !== confirmPassword) {
        toast.error(translateLng(language, "userProfileForm.doNotMatch"));
        return;
      } else {
        submit(userInfo, {
          method: "put",
          encType: "application/json",
        });
      }
    },
  })(MyForm);

  return (
    <div>
      <h2 className="h2-semibold py-4">{t("userProfileForm.title")}</h2>
      <MyEnhancedForm />
    </div>
  );
};

export default UserProfileForm;
