import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useSubmit } from "react-router-dom";
import { Button } from "./ui/button";

import type { User } from "@/types";
import { withFormik, type FormikProps } from "formik";
import * as Yup from "yup";

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
  const { language } = useSelector((store: RootState) => store.ui);
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

  const {
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
    updating,
    updatingPL,
  } = dictionary.userEditForm as ObjectDict;

  // console.log("values:", values);
  // console.log("errors:", errors);
  // console.log("touched:", touched);

  return (
    <form onSubmit={handleSubmit}>
      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="email">{email_label}</Label>
        <Input
          id="email"
          placeholder={
            language === "en" ? email_placeholder : email_placeholderPL
          }
          type="email"
          name="email"
          // value={email_value}
          // onChange={handleEmailChange}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.email && errors.email ? (
        <p className="text-red-500 mb-4">{errors.email}</p>
      ) : null}

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
          // value={name_value}
          // onChange={handleNameChange}
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
          // checked={isAdmin_value}
          // onChange={handleIsAdminChange}
          checked={values.isAdmin}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-4 w-4"
        />
        <Label htmlFor="isAdmin">
          {language === "en" ? isAdmin_label : isAdmin_labelPL}
        </Label>
      </p>

      <Button type="submit" className="mt-4 float-right">
        {language === "en"
          ? isSubmitting
            ? updating
            : update
          : isSubmitting
          ? updatingPL
          : updatePL}
      </Button>
    </form>
  );
};

const UserEditForm = ({ user }: { user: User }) => {
  const { email, name, isAdmin } = user;

  const submit = useSubmit();
  // const [email_value, setEmail] = useState(email);
  // const [name_value, setName] = useState(name);
  // const [isAdmin_value, setIsAdmin] = useState(isAdmin);

  const { language } = useSelector((store: RootState) => store.ui);

  const {
    title,
    titlePL,
    yup_email,
    yup_emailPL,
    yup_email_req,
    yup_email_reqPL,
    yup_name,
    yup_namePL,
  } = dictionary.userEditForm as ObjectDict;

  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.currentTarget.value);
  // };

  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setName(e.currentTarget.value);
  // };

  // const handleIsAdminChange = () => {
  //   setIsAdmin((prev) => !prev);
  // };

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
        .email(language === "en" ? yup_email : yup_emailPL)
        .required(language === "en" ? yup_email_req : yup_email_reqPL),
      name: Yup.string().required(language === "en" ? yup_name : yup_namePL),
    }),
    handleSubmit(values: FormValues) {
      // console.log("values:", values);
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("name", values.name);
      formData.append("isAdmin", values.isAdmin.toString());

      submit(formData, { method: "put" });
    },
  })(MyForm);

  return (
    <div>
      <h2 className="h2-semibold py-4">
        {language === "en" ? title : titlePL}
      </h2>
      <MyEnhancedForm />
    </div>
  );
};

export default UserEditForm;
