import { Button } from "./ui/button";
import dictionary from "@/dictionaries/dictionary.ts";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store.ts";
import { type ObjectDict } from "@/dictionaries/dictionary.ts";
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
import { useAppSelector } from "@/store/hook";

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
  const { language } = useAppSelector((state: RootState) => state.ui);

  const {
    button_submit,
    button_submitPL,
    title_label,
    title_labelPL,
    title_placeholder,
    title_placeholderPL,
    description_label,
    description_labelPL,
    description_placeholder,
    description_placeholderPL,
    select_text,
    select_textPL,
  } = dictionary.reviewForm as ObjectDict;

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

  // console.log("touched:", touched);
  // console.log("errors:", errors);
  // console.log("values:", values);

  return (
    <form onSubmit={handleSubmit}>
      <p className="flex flex-col space-y-2 grow mt-4">
        <Label htmlFor="title">
          {language === "en" ? title_label : title_labelPL}
        </Label>
        <Input
          id="title"
          type="text"
          name="title"
          placeholder={
            language === "en" ? title_placeholder : title_placeholderPL
          }
          // value={title}
          // onChange={handleTitleChange}
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.title && errors.title ? (
        <p className="text-red-500">{errors.title}</p>
      ) : null}

      <p className="flex flex-col space-y-2 grow mt-6">
        <Label htmlFor="description">
          {language === "en" ? description_label : description_labelPL}
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder={
            language === "en"
              ? description_placeholder
              : description_placeholderPL
          }
          // value={description}
          // onChange={handleDescriptionChange}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </p>
      {touched.description && errors.description ? (
        <p className="text-red-500">{errors.description}</p>
      ) : null}

      <p className="mt-6">
        <Label htmlFor="rate">
          {language === "en" ? select_text : select_textPL}
        </Label>
        <select
          id="rate"
          name="rate"
          value={values.rate}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mt-2 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap flex"
        >
          <option value="">
            {language === "en" ? "Select ..." : "Wybierz ..."}
          </option>
          <option value="1">
            {language === "en" ? "1 - Poor" : "1 - Słaba"}
          </option>
          <option value="2">
            {language === "en" ? "2 - Fair" : "2 - Zadowalająca"}
          </option>
          <option value="3">
            {language === "en" ? "3 - Good " : "3 - Dobra"}
          </option>
          <option value="4">
            {language === "en" ? "4 - Very Good " : "4 - Bardzo dobra"}
          </option>
          <option value="5">
            {language === "en" ? "5 - Excellent" : "5 -  Doskonała"}
          </option>
        </select>
      </p>
      {touched.rate && errors.rate ? (
        <p className="text-red-500">{errors.rate}</p>
      ) : null}

      <AlertDialogFooter className="mt-4 space-x-4">
        <AlertDialogCancel asChild>
          <Button variant="outline">Cancel</Button>
        </AlertDialogCancel>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !!(errors.title && touched.title) ||
            !!(errors.description && touched.description)
          }
        >
          {language === "en" ? button_submit : button_submitPL}
        </Button>
      </AlertDialogFooter>
    </form>
  );
};

const ReviewForm = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [rate, setRate] = useState("");
  const submit = useSubmit();

  const {
    button_write,
    button_writePL,
    title_text,
    title_textPL,
    description_text,
    description_textPL,
    yup_title,
    yup_titlePL,
    yup_description,
    yup_descriptionPL,
    yup_rate,
    yup_ratePL,
  } = dictionary.reviewForm as ObjectDict;

  const MyEnhancedForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: (props) => ({
      title: props.initialTitle || "",
      description: props.initialDescription || "",
      rate: props.initialRate || "",
    }),
    validationSchema: Yup.object().shape({
      title: Yup.string().required(language === "en" ? yup_title : yup_titlePL),
      description: Yup.string().required(
        language === "en" ? yup_description : yup_descriptionPL
      ),
      rate: Yup.string().required(language === "en" ? yup_rate : yup_ratePL),
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
  // const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTitle(e.target.value);
  // };

  // const handleDescriptionChange = (
  //   e: React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //   setDescription(e.target.value);
  // };

  // const handleRatingChange = (value: string) => {
  //   setRate(value);
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   submit(
  //     { title, description, rate },
  //     {
  //       method: "post",
  //       encType: "application/json",
  //     }
  //   );
  // };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="mb-6">
          {language === "en" ? button_write : button_writePL}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "en" ? title_text : title_textPL}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === "en" ? description_text : description_textPL}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <MyEnhancedForm />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReviewForm;
