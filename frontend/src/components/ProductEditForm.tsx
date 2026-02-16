import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Product } from "@/types";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSubmit } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";

const MAX_COUNT = 2;

const ProductEditForm = ({ product }: { product: Product }) => {
  const { language } = useSelector((state: RootState) => state.ui);
  const submit = useSubmit();

  const [isFeatured, setIsFeatured] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFiles_2, setUploadedFiles_2] = useState<File[]>([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [fileLimit_2, setFileLimit_2] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<(string | ArrayBuffer | null)[]>(
    []
  );

  const [previewUrl_2, setPreviewUrl_2] = useState<
    (string | ArrayBuffer | null)[]
  >([]);

  // console.log("fileLimit_2:", fileLimit_2);
  // console.log("uploadedFiles_2:", uploadedFiles_2);
  // console.log("previewUrl_2:", previewUrl_2);

  const {
    title_text,
    title_textPL,
    title_label,
    title_labelPL,
    title_placeholder,
    title_placeholderPL,
    description_label,
    description_labelPL,
    description_placeholder,
    description_placeholderPL,
    price_label,
    price_labelPL,
    price_placeholder,
    price_placeholderPL,
    category_label,
    category_labelPL,
    category_placeholder,
    category_placeholderPL,
    countInStock_label,
    countInStock_labelPL,
    countInStock_placeholder,
    countInStock_placeholderPL,
    pick_button_label,
    pick_button_labelPL,
    update,
    updatePL,
    pick_image_text,
    pick_image_textPL,
    alert_text,
    alert_textPL,
    loaded_text,
    loaded_textPL,
    loaded_2_text,
    loaded_2_textPL,
    featuredProduct,
    featuredProductPL,
  } = dictionary.productEditForm as ObjectDict;

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const category = useRef<HTMLInputElement>(null);
  const countInStock = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const filePickerRef_2 = useRef<HTMLInputElement>(null);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //   /* 1 */
    // const formData = new FormData(e.currentTarget);
    const formData = new FormData();
    formData.append("title", title.current!.value);
    formData.append("description", description.current!.value);
    formData.append("price", price.current!.value);
    formData.append("category", category.current!.value);
    formData.append("countInStock", countInStock.current!.value);
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append("images", uploadedFiles[i]);
    }
    for (let i = 0; i < uploadedFiles_2.length; i++) {
      formData.append("banners", uploadedFiles_2[i]);
    }
    // formData.append("banner", uploadedFiles_2[0]);
    formData.append("isFeatured", isFeatured.toString());

    //   /* 2 */
    //   // const enteredTitle = title.current!.value;
    //   // const enteredDescription = description.current!.value;
    //   // const enteredPrice = price.current!.value;
    //   // const enteredCategory = category.current!.value;
    //   // const enteredCountInStock = countInStock.current!.value;
    //   // const enteredImage = image.current!.value;

    submit(
      //     /* 1 */
      formData,
      //     /* 2 */
      //     // {
      //     //   enteredTitle,
      //     //   enteredDescription,
      //     //   enteredPrice,
      //     //   enteredCategory,
      //     //   enteredCountInStock,
      //     //   enteredImage,
      //     // },

      {
        method: "patch",
        encType: "multipart/form-data",
        // encType: "application/x-www-form-urlencoded",
        // encType: "application/json",
      }
    );
  };

  const handleUploadFiles = (files: File[]) => {
    const uploaded = [...uploadedFiles];
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        if (files.length < 2) {
          const fileReader = new FileReader();
          uploaded.push(file);
          fileReader.onload = () => {
            setPreviewUrl((prev) => [...prev, fileReader.result]);
          };
          fileReader.readAsDataURL(file);
          if (uploadedFiles.length === 1) {
            setFileLimit(true);
          }
        } else if (files.length === 2) {
          const fileReader = new FileReader();
          uploaded.push(file);
          fileReader.onload = () => {
            setPreviewUrl((prev) => [...prev, fileReader.result]);
          };
          fileReader.readAsDataURL(file);
          setFileLimit(true);
        } else {
          alert(
            language === "en"
              ? `${alert_text} ${MAX_COUNT} files`
              : `${alert_textPL} ${MAX_COUNT} pliki`
          );
          return true;
        }
      }
    });
    setUploadedFiles(uploaded);
  };

  useEffect(() => {
    if (uploadedFiles_2.length === 0) {
      return;
    }
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreviewUrl_2((prev) => [...prev, fileReader.result]);
    };
    fileReader.readAsDataURL(uploadedFiles_2[0]);
    setFileLimit_2(true);
  }, [uploadedFiles_2]);

  const pickeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const pickeHandler_2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    setUploadedFiles_2(chosenFiles);
  };

  const pickImageHandler = () => {
    filePickerRef.current!.click();
  };

  const pickImageHandler_2 = () => {
    filePickerRef_2.current!.click();
  };

  return (
    <div>
      <h2 className="h2-semibold py-4">
        {language === "en" ? title_text : title_textPL}
      </h2>
      <form onSubmit={submitHandler}>
        {/* <Form method="patch"> */}
        <div className="flex flex-col md:flex-row md:gap-4">
          <p className="flex flex-col space-y-2 grow mt-4">
            <Label htmlFor="title">
              {language === "en" ? title_label : title_labelPL}
            </Label>
            <Input
              id="title"
              placeholder={
                language === "en" ? title_placeholder : title_placeholderPL
              }
              type="text"
              name="title"
              defaultValue={product.title}
              ref={title}
            />
          </p>
          <p className="flex flex-col space-y-2 grow mt-4">
            <Label htmlFor="category">
              {language === "en" ? category_label : category_labelPL}
            </Label>
            <Input
              id="category"
              placeholder={
                language === "en"
                  ? category_placeholder
                  : category_placeholderPL
              }
              type="text"
              name="category"
              defaultValue={product.category}
              ref={category}
            />
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:gap-4 ">
          <p className="flex flex-col space-y-2 grow mt-4">
            <Label htmlFor="countInStock">
              {language === "en" ? countInStock_label : countInStock_labelPL}
            </Label>
            <Input
              id="countInStock"
              placeholder={
                language === "en"
                  ? countInStock_placeholder
                  : countInStock_placeholderPL
              }
              type="number"
              name="countInStock"
              defaultValue={product.countInStock}
              ref={countInStock}
            />
          </p>
          <p className="flex flex-col space-y-2 grow mt-4">
            <Label htmlFor="price">
              {language === "en" ? price_label : price_labelPL}
            </Label>
            <Input
              id="price"
              placeholder={
                language === "en" ? price_placeholder : price_placeholderPL
              }
              type="number"
              min="0"
              step="any"
              name="price"
              defaultValue={product.price}
              ref={price}
            />
          </p>
        </div>
        <p className="flex flex-col space-y-2 mt-4 ">
          <Label htmlFor="description">
            {language === "en" ? description_label : description_labelPL}
          </Label>
          <Textarea
            id="description"
            placeholder={
              language === "en"
                ? description_placeholder
                : description_placeholderPL
            }
            name="description"
            defaultValue={product.description}
            ref={description}
          />
        </p>

        <Input
          type="file"
          multiple
          ref={filePickerRef}
          style={{ display: "none" }}
          onChange={pickeHandler}
          disabled={fileLimit}
          className="mt-4"
        />

        <div className="flex gap-4">
          {previewUrl.length > 0 &&
            previewUrl.map(
              (url) =>
                typeof url === "string" && (
                  <img
                    key={url}
                    src={url}
                    alt={language === "en" ? "Preview" : "Podgląd"}
                    className="w-30 mt-4"
                  />
                )
            )}
        </div>

        {previewUrl.length === 0 && (
          <p className="mt-4">
            {language === "en" ? pick_image_text : pick_image_textPL}
          </p>
        )}

        <p className="flex justify-between mt-4 ">
          <Button
            type="button"
            onClick={pickImageHandler}
            variant="outline"
            className="mb-4"
            disabled={fileLimit}
          >
            {fileLimit
              ? language === "en"
                ? loaded_text
                : loaded_textPL
              : language === "en"
              ? pick_button_label
              : pick_button_labelPL}
          </Button>
        </p>

        <Card className="mb-4">
          <CardContent>
            <p className="flex flex-col space-y-2 items-start">
              <Label htmlFor="isFeatured">
                {language === "en" ? featuredProduct : featuredProductPL}
              </Label>
              <Input
                id="isFeatured"
                type="checkbox"
                name="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4"
              />
            </p>

            {isFeatured && (
              <div>
                <Input
                  type="file"
                  ref={filePickerRef_2}
                  style={{ display: "none" }}
                  onChange={pickeHandler_2}
                  disabled={fileLimit_2}
                  className="mt-4"
                />

                <div className="flex gap-4">
                  {previewUrl_2.length > 0 &&
                    previewUrl_2.map(
                      (url) =>
                        typeof url === "string" && (
                          <img
                            key={url}
                            src={url}
                            alt={language === "en" ? "Preview" : "Podgląd"}
                            className="w-60 mt-4"
                          />
                        )
                    )}
                </div>

                {previewUrl_2.length === 0 && (
                  <p className="mt-4">
                    {language === "en" ? pick_image_text : pick_image_textPL}
                  </p>
                )}

                <p className="flex justify-between mt-4 ">
                  <Button
                    type="button"
                    onClick={pickImageHandler_2}
                    variant="outline"
                    className="mb-4"
                    disabled={fileLimit_2}
                  >
                    {fileLimit_2
                      ? language === "en"
                        ? loaded_2_text
                        : loaded_2_textPL
                      : language === "en"
                      ? pick_button_label
                      : pick_button_labelPL}
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="float-right">
          {language === "en" ? update : updatePL}
        </Button>

        {/* </Form> */}
      </form>
    </div>
  );
};

export default ProductEditForm;
