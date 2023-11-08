import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export const notify = ({ message }: { message: string }) => {
  toast.success(<div className="text-sm ">{message}</div>, {
    position: "top-center",
    // icon: "🥳",
    id: uuidv4(),
    // style: {
    //   border: "1px solid white",
    //   background: "#F3FFF5",
    //   padding: "16px",
    //   color: "#3F8825",
    // },
  });
};

export const notifyError = ({ message }: { message: string }) => {
  toast.error(<div className="text-sm ">{message}</div>, {
    position: "top-center",
    // icon: "😵",
    id: uuidv4(),
    // style: {
    //   // border: "1px solid #D0000A",
    //   background: "#FDF5F5",
    //   padding: "16px",
    //   color: "#3F8825",
    // },
  });
};
