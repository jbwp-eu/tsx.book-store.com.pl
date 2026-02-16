import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { NavLink, useSubmit } from "react-router-dom";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { withFormik, type FormikProps } from "formik";
import * as Yup from "yup";

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
    update,
    updatePL,
    updating,
    updatingPL,
    password_label,
    password_labelPL,
    password_placeholder,
    password_placeholderPL,
    confirmPassword_label,
    confirmPassword_labelPL,
    confirmPassword_placeholder,
    confirmPassword_placeholderPL,
  } = dictionary.userProfileForm as ObjectDict;

  return (
    <form onSubmit={handleSubmit}>
      {/* <Form method="put" onSubmit={handleSubmit}> */}
      {/* <Form method="put"> */}
      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="email">{email_label}</Label>
        <Input
          id="email"
          placeholder={
            language === "en" ? email_placeholder : email_placeholderPL
          }
          type="email"
          name="email"
          // value={userInfo.email}
          // value={email_value}
          // onChange={handleEmailChange}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.email && errors.email ? (
        <p className="text-red-500">{errors.email}</p>
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
          // value={userInfo.name}
          // value={name_value}
          // onChange={handleNameChange}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.name && errors.name ? (
        <p className="text-red-500">{errors.name}</p>
      ) : null}

      <p className="flex flex-col space-y-2 my-4">
        <Label htmlFor="password">
          {language === "en" ? password_label : password_labelPL}
        </Label>
        <Input
          id="password"
          placeholder={
            language === "en" ? password_placeholder : password_placeholderPL
          }
          type="password"
          name="password"
          // value={userInfo.password}
          // value={password}
          // onChange={handlePasswordChange}
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
          {language === "en" ? confirmPassword_label : confirmPassword_labelPL}
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
        <p className="text-red-500">{errors.confirmPassword}</p>
      ) : null}

      <p className="flex justify-end mt-4 gap-x-4">
        <Button asChild type="button" variant="outline">
          <NavLink to="..">Cancel</NavLink>
        </Button>
        {/* disabled={Boolean(Object.keys(errors).length)} */}
        <Button type="submit">
          {language === "en"
            ? isSubmitting
              ? updating
              : update
            : isSubmitting
            ? updatingPL
            : updatePL}
        </Button>
      </p>
      {/* </Form> */}
    </form>
  );
};

const UserProfileForm = () => {
  const { language } = useSelector((store: RootState) => store.ui);

  const submit = useSubmit();

  // const [email_value, setEmail] = useState(email || "");
  // const [name_value, setName] = useState(name || "");
  // const [isAdmin_value, setIsAdmin] = useState(isAdmin || false);
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  // const [userInfo, setUserInfoValue] = useState({
  //   email: email || "",
  //   name: name || "",
  //   password: "",
  //   confirmPassword: "",
  // });

  const {
    title,
    titlePL,
    yup_email,
    yup_emailPL,
    yup_email_req,
    yup_email_reqPL,
    yup_name,
    yup_namePL,
    yup_confirmPassword,
    yup_confirmPasswordPL,
    doNotMatch,
    doNotMatchPL,
    yup_MustBe,
    yup_MustBePL,
  } = dictionary.userProfileForm as ObjectDict;

  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // setEmail(e.currentTarget.value);
  //   setUserInfoValue((prev) => ({ ...prev, email: e.target.value }));
  // };

  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // setName(e.currentTarget.value);
  //   setUserInfoValue((prev) => ({ ...prev, name: e.target.value }));
  // };

  // const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // setPassword(e.currentTarget.value);
  //   setUserInfoValue((prev) => ({ ...prev, password: e.target.value }));
  // };

  // const handleConfirmPasswordChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   // setConfirmPassword(e.currentTarget.value);
  //   setUserInfoValue((prev) => ({
  //     ...prev,
  //     confirmPassword: e.target.value,
  //   }));
  // };

  // const userInfo = { email: email_value, name: name_value, password };

  // console.log("newUserInfo", newUserInfo);

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (userInfo.password !== userInfo.confirmPassword) {
  //     toast.error(language === "en" ? doNotMatch : doNotMatchPL);
  //     return;
  //   } else {
  //     // const data = new FormData(e.currentTarget);
  //     // submit(e.currentTarget);
  //     // submit(data, {
  //     //   method: "put",
  //     //   encType: "application/x-www-form-urlencoded",
  //     // });
  //     submit(userInfo, {
  //       method: "put",
  //       encType: "application/json",
  //     });
  //   }
  //   // setUserInfoValue({
  //   //   email: "",
  //   //   name: "",
  //   //   password: "",
  //   //   confirmPassword: "",
  //   // });
  //   // console.log("userInfo:", userInfo);
  // };

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
        .email(language === "en" ? yup_email : yup_emailPL)
        .required(language === "en" ? yup_email_req : yup_email_reqPL),
      name: Yup.string().required(language === "en" ? yup_name : yup_namePL),
      // password: Yup.string().required(
      //   language === "en" ? yup_password : yup_passwordPL
      // ),
      password: Yup.string()
        .min(4, language === "en" ? yup_MustBe : yup_MustBePL)
        .optional(),
      confirmPassword: Yup.string().when("password", (password, field) => {
        return password[0]
          ? field
              .required(
                language === "en" ? yup_confirmPassword : yup_confirmPasswordPL
              )
              .oneOf(
                [Yup.ref("password")],
                language === "en" ? doNotMatch : doNotMatchPL
              )
          : field;
      }),
    }),
    handleSubmit({ email, name, password, confirmPassword }: FormValues) {
      const userInfo = { email, name, password };

      if (userInfo.password !== confirmPassword) {
        toast.error(language === "en" ? doNotMatch : doNotMatchPL);
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
      <h2 className="h2-semibold py-4">
        {language === "en" ? title : titlePL}
      </h2>
      <MyEnhancedForm />
    </div>
  );
};

export default UserProfileForm;
