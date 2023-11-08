import type { GetServerSideProps, NextPage } from "next";
import UserLayout from "~/components/layout/UserLayout";
import { useUserProfile } from "~/context/UserProfileContext";
import { handleRedirection } from "middleware";
import { Chart } from "~/dashboard/BarChart";
import Cards from "~/dashboard/Cards";
import Footer from "~/components/layout/Footer";
import { DatePickerWithRange } from "~/components/date-picker/date-range-picker";
import { Button } from "~/components/common/button";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return handleRedirection("PROTECTED")(ctx);
};

const Dashboard: NextPage = () => {
  const { profile } = useUserProfile()!;

  // console.log("profile",profile);
  return (
    <UserLayout
      title={
        <div className=" grid grid-cols-1  lg:grid-cols-2">
          <span className="lg:col-span-1">Dashboard</span>
          <div className="lg:col-span-1 lg:flex lg:justify-end">
            <DatePickerWithRange />{" "}
            <Button className="bg-primary-500 lg:ml-3">Submit</Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-5 gap-y-5 flex-1">
        <div className="col-span-5">
          <Cards />
        </div>
        <div className="col-span-5 lg:col-span-3 mb-5">
          <Chart />
        </div>
      </div>
      <Footer />
    </UserLayout>
  );
};

export default Dashboard;
