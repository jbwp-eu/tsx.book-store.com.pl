import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouteError } from "react-router-dom";
import Container from "@/components/Container";
import Message from "@/components/Message";

export interface Error {
  message: string;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as Error;

  return (
    <div className="flex flex-col ">
      <Header />
      <main className="min-h-screen">
        <Container>
          <Message>
            <p>{error.message}</p>
          </Message>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorPage;
