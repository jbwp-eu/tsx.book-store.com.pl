import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const DeleteDialog = ({
  onDelete,
}: {
  // onDelete: () => (id: string) => void;
  onDelete: () => void;
}) => {
  const { language } = useSelector((state: RootState) => state.ui);
  const {
    delete_text,
    delete_textPL,
    title,
    titlePL,
    description,
    descriptionPL,
  } = dictionary.alertDialog as ObjectDict;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          {language === "en" ? delete_text : delete_textPL}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "en" ? title : titlePL}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === "en" ? description : descriptionPL}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction> */}
          <Button variant="destructive" onClick={onDelete}>
            {language === "en" ? delete_text : delete_textPL}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
