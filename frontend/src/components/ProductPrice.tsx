import { type PropsWithChildren } from "react";
import { type FC } from "react";

type ProductPriceProps = PropsWithChildren<{
  className?: string;
}>;

const ProductPrice: FC<ProductPriceProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export default ProductPrice;
