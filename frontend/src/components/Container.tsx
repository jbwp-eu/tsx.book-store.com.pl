// import { type PropsWithChildren } from "react";
// type ContainerType = PropsWithChildren<{}>;

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="wrapper">{children}</div>;
};

export default Container;
