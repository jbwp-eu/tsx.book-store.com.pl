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
import { useTranslation } from "react-i18next";
import { translateLng } from "@/i18n/i18n";

const MAX_COUNT = 2;

const ProductEditForm = ({ product }: { product: Product }) => {
  const { language } = useSelector((state: RootState) => state.ui);
  const { t } = useTranslation();
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

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const category = useRef<HTMLInputElement>(null);
  const countInStock = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const filePickerRef_2 = useRef<HTMLInputElement>(null);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    formData.append("isFeatured", isFeatured.toString());

    submit(formData, {
      method: "patch",
      encType: "multipart/form-data",
    });
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
            translateLng(language, "productEditForm.alert_limit", {
              count: MAX_COUNT,
            })
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
      <h2 className="h2-semibold py-4">{t("productEditForm.title_text")}</h2>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col md:flex-row md:gap-4">
          <p className="flex flex-col space-y-2 grow mt-4">
            <Label htmlFor="title">{t("productEditForm.title_label")}</Label>
            <Input
              id="title"
              placeholder={t("productEditForm.title_placeholder")}
              type="text"
              name="title"
              defaultValue={product.title}
              ref={title}
            />
          </p>
          <p className="flex flex-col space-y-2 grow mt-4">
            <Label htmlFor="category">{t("productEditForm.category_label")}</Label>
            <Input
              id="category"
              placeholder={t("productEditForm.category_placeholder")}
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
              {t("productEditForm.countInStock_label")}
            </Label>
            <Input
              id="countInStock"
              placeholder={t("productEditForm.countInStock_placeholder")}
              type="number"
              name="countInStock"
              defaultValue={product.countInStock}
              ref={countInStock}
            />
          </p>
          <p className="flex flex-col space-y-2 grow mt-4">
            <Label htmlFor="price">{t("productEditForm.price_label")}</Label>
            <Input
              id="price"
              placeholder={t("productEditForm.price_placeholder")}
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
            {t("productEditForm.description_label")}
          </Label>
          <Textarea
            id="description"
            placeholder={t("productEditForm.description_placeholder")}
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
                    alt={t("productEditForm.preview_alt")}
                    className="w-30 mt-4"
                  />
                )
            )}
        </div>

        {previewUrl.length === 0 && (
          <p className="mt-4">{t("productEditForm.pick_image_text")}</p>
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
              ? t("productEditForm.loaded_text")
              : t("productEditForm.pick_button_label")}
          </Button>
        </p>

        <Card className="mb-4">
          <CardContent>
            <p className="flex flex-col space-y-2 items-start">
              <Label htmlFor="isFeatured">
                {t("productEditForm.featuredProduct")}
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
                            alt={t("productEditForm.preview_alt")}
                            className="w-60 mt-4"
                          />
                        )
                    )}
                </div>

                {previewUrl_2.length === 0 && (
                  <p className="mt-4">{t("productEditForm.pick_image_text")}</p>
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
                      ? t("productEditForm.loaded_2_text")
                      : t("productEditForm.pick_button_label")}
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="float-right">
          {t("productEditForm.update")}
        </Button>
      </form>
    </div>
  );
};

export default ProductEditForm;
