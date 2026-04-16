import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useSubmit } from "react-router-dom";
import { Button } from "./ui/button";

import type { User } from "@/types";
import { withFormik, type FormikProps } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { translateLng } from "@/i18n/i18n";

interface FormValues {
  email: string;
  name: string;
  isAdmin: boolean;
}

interface OtherProps {
  other?: string;
}

interface MyFormProps {
  initialEmail?: string;
  initialName?: string;
  initialIsAdmin?: boolean;
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
        <Label htmlFor="email">{t("userEditForm.email_label")}</Label>
        <Input
          id="email"
          placeholder={t("userEditForm.email_placeholder")}
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.email && errors.email ? (
        <p className="text-red-500 mb-4">{errors.email}</p>
      ) : null}

      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="name">{t("userEditForm.name_label")}</Label>
        <Input
          id="name"
          placeholder={t("userEditForm.name_placeholder")}
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.name && errors.name ? (
        <p className="text-red-500 mb-4">{errors.name}</p>
      ) : null}

      <p className="flex justify-start space-x-4 ">
        <Input
          id="isAdmin"
          type="checkbox"
          name="isAdmin"
          checked={values.isAdmin}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-4 w-4"
        />
        <Label htmlFor="isAdmin">{t("userEditForm.isAdmin_label")}</Label>
      </p>

      <Button type="submit" className="mt-4 float-right">
        {isSubmitting
          ? t("userEditForm.updating")
          : t("userEditForm.update")}
      </Button>
    </form>
  );
};

const UserEditForm = ({ user }: { user: User }) => {
  const { email, name, isAdmin } = user;

  const submit = useSubmit();

  const { language } = useSelector((store: RootState) => store.ui);
  const { t } = useTranslation();

  const MyEnhancedForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: ({
      initialEmail = email,
      initialName = name,
      initialIsAdmin = isAdmin,
    }) => ({
      email: initialEmail || "",
      name: initialName || "",
      isAdmin: initialIsAdmin || false,
    }),
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(translateLng(language, "userEditForm.yup_email"))
        .required(translateLng(language, "userEditForm.yup_email_req")),
      name: Yup.string().required(
        translateLng(language, "userEditForm.yup_name")
      ),
    }),
    handleSubmit(values: FormValues) {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("name", values.name);
      formData.append("isAdmin", values.isAdmin.toString());

      submit(formData, { method: "put" });
    },
  })(MyForm);

  return (
    <div>
      <h2 className="h2-semibold py-4">{t("userEditForm.title")}</h2>
      <MyEnhancedForm />
    </div>
  );
};

export default UserEditForm;
