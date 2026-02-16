import { Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSubmit } from "react-router-dom";
import { withFormik, type FormikProps } from "formik";
import * as Yup from "yup";

interface FormValues {
  email: string;
  text: string;
}

interface OtherProps {
  title?: string;
}

interface MyFormProps {
  initialEmail?: string;
  initialText?: string;
}

const MyForm = (props: OtherProps & FormikProps<FormValues>) => {
  const { language } = useSelector((state: RootState) => state.ui);
  const {
    send,
    sendPL,
    label_email,
    label_emailPL,
    label_message,
    label_messagePL,
    email_placeholder,
    email_placeholderPL,
    text_placeholder,
    text_placeholderPL,
    sending,
    sendingPL,
  } = dictionary.contactForm as ObjectDict;
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    // title,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2 mt-4 ">
        <Label htmlFor="email">
          {language === "en" ? label_email : label_emailPL}
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder={
            language === "en" ? email_placeholder : email_placeholderPL
          }
          // value={email}
          // onChange={emailHandler}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {touched.email && errors.email ? (
        <p className="text-red-500 mb-4">{errors.email}</p>
      ) : null}

      <div className="space-y-2 mt-6">
        <Label htmlFor="text">
          {language === "en" ? label_message : label_messagePL}
        </Label>
        <Textarea
          id="text"
          name="text"
          placeholder={
            language === "en" ? text_placeholder : text_placeholderPL
          }
          // value={text}
          // onChange={textHandler}
          value={values.text}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {touched.text && errors.text ? (
        <p className="text-red-500 mb-4">{errors.text}</p>
      ) : null}

      <Button
        type="submit"
        className="float-right mt-4"
        disabled={
          isSubmitting ||
          !!(errors.email && touched.email) ||
          !!(errors.text && touched.text)
        }
      >
        {language === "en"
          ? isSubmitting
            ? sending
            : send
          : isSubmitting
          ? sendingPL
          : sendPL}
      </Button>
    </form>
  );
};

const ContactForm = () => {
  const [open, setOpen] = useState(false);
  // const [email, setEmail] = useState("");
  // const [text, setText] = useState("");
  const { language } = useSelector((state: RootState) => state.ui);

  const {
    contact,
    contactPL,
    title_text,
    title_textPL,
    yup_email,
    yup_emailPL,
    yup_text,
    yup_textPL,
    yup_email_req,
    yup_email_reqPL,
  } = dictionary.contactForm as ObjectDict;

  const submit = useSubmit();

  const MyEnhancedForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: (props) => ({
      email: props.initialEmail || "",
      text: props.initialText || "",
    }),
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(language === "en" ? yup_email : yup_emailPL)
        .required(language === "en" ? yup_email_req : yup_email_reqPL),
      text: Yup.string().required(language === "en" ? yup_text : yup_textPL),
    }),
    handleSubmit({ email, text }: FormValues, { setSubmitting, setErrors }) {
      submit(
        { email, text },
        {
          method: "post",
          encType: "application/json",
        }
      );
      setSubmitting(false);
      setOpen(false);
      setErrors({ email: "", text: "" });
    },
  })(MyForm);

  // const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail(e.currentTarget.value);
  // };

  // const textHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setText(e.currentTarget.value);
  // };

  // const formData = new FormData();
  // formData.append("email", email);
  // formData.append("text", text);

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  // submit(formData, { method: "post" });
  // submit(
  //   { email, text },
  //   {
  //     method: "post",
  //     encType: "application/json",
  //   }
  // );
  // setOpen(false);
  // setEmail("");
  // setText("");
  // };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="hover:cursor-pointer">
        <Mail />
        <h2 className="font-semibold">
          {language === "en" ? contact : contactPL}
        </h2>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="h2-semibold">
              {language === "en" ? title_text : title_textPL}
            </p>
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <MyEnhancedForm />
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                className="mr-auto"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  // setEmail("");
                  // setText("");
                }}
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContactForm;
