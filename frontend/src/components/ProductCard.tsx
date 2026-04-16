import { type Product } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import Image from "./Image";
import Rating from "./Rating";
import ProductPrice from "./ProductPrice";
import { formatCurrency } from "@/utils/formatUtils";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full justify-self-center gap-3 py-2 text-card-foreground/75">
      <CardHeader className="p-2 items-center">
        <CardTitle className="text-lg lg:text-xl text-center font-semibold">
          {product.title}
        </CardTitle>
        <Link to={`/product/${product.id}`}>
          <Image image={product.images[0]} />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <p className="text-sm lg:text-base font-normal">
          {t("productCard.category")}
        </p>
        <Link to={`/product/${product.id}`}>
          <p className="text-base lg:text-lg font-medium">{product.title}</p>
        </Link>
        <Rating value={product.rating} />
        {product.countInStock > 0 ? (
          <ProductPrice className="font-medium">
            {formatCurrency(product.price)}
          </ProductPrice>
        ) : (
          <p className="text-destructive">{t("productCard.out_of_stock")}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
