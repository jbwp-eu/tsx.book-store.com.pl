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

const ContactForm = () => {
  const { language } = useSelector((state: RootState) => state.ui);
  const {
    contact,
    contactPL,
    title,
    titlePL,
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
  } = dictionary.contactForm as ObjectDict;

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const submit = useSubmit();

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const textHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  // const formData = new FormData();
  // formData.append("email", email);
  // formData.append("text", text);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // submit(formData, { method: "post" });
    submit(
      { email, text },
      {
        method: "post",
        encType: "application/json",
      }
    );
    setOpen(false);
    setEmail("");
    setText("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="hover:cursor-pointer">
        <Mail />
        <p className="font-semibold">
          {language === "en" ? contact : contactPL}
        </p>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "en" ? title : titlePL}
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
          <form className="space-y-2 my-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === "en" ? label_email : label_emailPL}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={emailHandler}
                placeholder={
                  language === "en" ? email_placeholder : email_placeholderPL
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">
                {language === "en" ? label_message : label_messagePL}
              </Label>
              <Textarea
                id="text"
                value={text}
                placeholder={
                  language === "en" ? text_placeholder : text_placeholderPL
                }
                onChange={textHandler}
              />
            </div>
            <Button type="submit" className="float-right mt-2">
              {language === "en" ? send : sendPL}
            </Button>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button
                className="mr-auto"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setEmail("");
                  setText("");
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
