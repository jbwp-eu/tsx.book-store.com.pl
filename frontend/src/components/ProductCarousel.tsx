import type { Product } from "@/types";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link, useLoaderData, type LoaderFunction } from "react-router-dom";
import { toast } from "sonner";
import Message from "./Message";
import Image from "./Image";

const loader =
  (language: string): LoaderFunction =>
  async (): Promise<{ products: Product[] } | Response> => {
    const response = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/products/featured?language=${language}`
    );

    if (!response.ok) {
      const resData = await response.json();
      // throw new Error(resData.message);
      toast.error(resData.message);
      return resData;
    } else {
      return response;
    }
  };

const ProductCarousel = () => {
  const data = useLoaderData();

  let content;

  if ("message" in data) {
    content = <Message info>{data.message}</Message>;
  } else {
    content = (
      <Carousel
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        className="mb-4"
      >
        <CarouselContent>
          {data.map((product: Product) => (
            <CarouselItem key={product.id}>
              <Card className="py-2">
                <CardContent className="px-2 mar">
                  <Link to={`/product/${product.id}`}>
                    <Image
                      image={product?.banners[0]}
                      className="mx-auto w-full"
                    />
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  return content;
};

ProductCarousel.loader = loader;

export default ProductCarousel;
