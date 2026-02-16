import Image from "@/components/Image";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Image image={images[current]} className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent
          // aria-describedby={undefined}
          className="p-0 border-0 gap-0"
        >
          <Image image={images[current]} />
          <DialogHeader className="p-0 gap-0">
            <DialogTitle />
            <DialogDescription />
            {/* <DialogTitle className="sr-only">Dialog Title</DialogTitle> */}
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex items-start gap-2 ">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={`border hover:border-orange-600 ${
              current === index && "border-orange-600"
            }`}
          >
            <Image image={image} className="cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
