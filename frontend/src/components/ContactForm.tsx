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
import { useTranslation } from "react-i18next";
import { translateLng } from "@/i18n/i18n";

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
      <div className="space-y-2 mt-4 ">
        <Label htmlFor="email">{t("contactForm.label_email")}</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder={t("contactForm.email_placeholder")}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {touched.email && errors.email ? (
        <p className="text-red-500 mb-4">{errors.email}</p>
      ) : null}

      <div className="space-y-2 mt-6">
        <Label htmlFor="text">{t("contactForm.label_message")}</Label>
        <Textarea
          id="text"
          name="text"
          placeholder={t("contactForm.text_placeholder")}
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
        {isSubmitting ? t("contactForm.sending") : t("contactForm.send")}
      </Button>
    </form>
  );
};

const ContactForm = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { language } = useSelector((state: RootState) => state.ui);

  const submit = useSubmit();

  const MyEnhancedForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: (props) => ({
      email: props.initialEmail || "",
      text: props.initialText || "",
    }),
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(translateLng(language, "contactForm.yup_email"))
        .required(translateLng(language, "contactForm.yup_email_req")),
      text: Yup.string().required(
        translateLng(language, "contactForm.yup_text")
      ),
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="hover:cursor-pointer">
        <Mail />
        <h2 className="font-semibold">{t("contactForm.contact")}</h2>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className="h2-semibold">{t("contactForm.title_text")}</p>
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
                }}
              >
                {t("reviewForm.button_cancel")}
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContactForm;
