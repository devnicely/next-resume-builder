import { handleRedirection } from "middleware";
import { GetServerSideProps } from "next";
import React from "react";
import UserLayout from "~/components/layout/UserLayout";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("PROTECTED")(ctx);
};

const index = () => {
  return <UserLayout>index</UserLayout>;
};

export default index;
