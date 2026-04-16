import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store.ts";
import { useSubmit } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { withFormik, type FormikProps } from "formik";
import * as Yup from "yup";
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
import { useTranslation } from "react-i18next";
import { translateLng } from "@/i18n/i18n";

interface FormValues {
  title: string;
  description: string;
  rate: string;
}

interface OtherProps {
  other?: string;
}

interface MyFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialRate?: string;
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
      <p className="flex flex-col space-y-2 grow mt-4">
        <Label htmlFor="title">{t("reviewForm.title_label")}</Label>
        <Input
          id="title"
          type="text"
          name="title"
          placeholder={t("reviewForm.title_placeholder")}
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.title && errors.title ? (
        <p className="text-red-500">{errors.title}</p>
      ) : null}

      <p className="flex flex-col space-y-2 grow mt-6">
        <Label htmlFor="description">{t("reviewForm.description_label")}</Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t("reviewForm.description_placeholder")}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.description && errors.description ? (
        <p className="text-red-500">{errors.description}</p>
      ) : null}

      <p className="mt-6">
        <Label htmlFor="rate">{t("reviewForm.select_text")}</Label>
        <select
          id="rate"
          name="rate"
          value={values.rate}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mt-2 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap flex"
        >
          <option value="">{t("reviewForm.rate_empty")}</option>
          <option value="1">{t("reviewForm.rate_1")}</option>
          <option value="2">{t("reviewForm.rate_2")}</option>
          <option value="3">{t("reviewForm.rate_3")}</option>
          <option value="4">{t("reviewForm.rate_4")}</option>
          <option value="5">{t("reviewForm.rate_5")}</option>
        </select>
      </p>
      {touched.rate && errors.rate ? (
        <p className="text-red-500">{errors.rate}</p>
      ) : null}

      <AlertDialogFooter className="mt-4 space-x-4">
        <AlertDialogCancel asChild>
          <Button variant="outline">{t("reviewForm.button_cancel")}</Button>
        </AlertDialogCancel>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !!(errors.title && touched.title) ||
            !!(errors.description && touched.description)
          }
        >
          {t("reviewForm.button_submit")}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};

const ReviewForm = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  const { t } = useTranslation();
  const submit = useSubmit();

  const MyEnhancedForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: (props) => ({
      title: props.initialTitle || "",
      description: props.initialDescription || "",
      rate: props.initialRate || "",
    }),
    validationSchema: Yup.object().shape({
      title: Yup.string().required(
        translateLng(language, "reviewForm.yup_title")
      ),
      description: Yup.string().required(
        translateLng(language, "reviewForm.yup_description")
      ),
      rate: Yup.string().required(
        translateLng(language, "reviewForm.yup_rate")
      ),
    }),
    handleSubmit(
      { title, description, rate }: FormValues,
      { setSubmitting, setErrors }
    ) {
      submit(
        { title, description, rate },
        {
          method: "post",
          encType: "application/json",
        }
      );
      setSubmitting(false);
      setErrors({ title: "", description: "", rate: "" });
    },
  })(MyForm);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mb-6">{t("reviewForm.button_write")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("reviewForm.title_text")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("reviewForm.description_text")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <MyEnhancedForm />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewForm;
