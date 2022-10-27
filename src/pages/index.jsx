import { getSession } from "next-auth/react";
import { Fragment } from "react";
const Home = ({ session }) => {
  return <></>;
};
export default Home;

export const getServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        permanent: true,
        destination: "/user/" + session.role.toLowerCase(),
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/auth/signin",
    },
  };
};
