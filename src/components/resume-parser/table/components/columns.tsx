import { type ColumnDef } from "@tanstack/react-table";
import { statuses } from "../data/data";
import { type Task } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "~/components/common/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/common/avatar";
import Link from "next/link";

export const columns: ColumnDef<Task>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);
      const id = row.getValue("id");

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <Link
            href={`/user/cv-suite/cv-reformatting/${id}`}
            className="max-w-[500px] truncate font-medium cursor-pointer"
          >
            {row.getValue("title")}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team" />
    ),
    cell: ({ row }) => {
      const team = row.getValue("team") || [];
      const displayedTeam = team.slice(0, 3); // Get the first 3 team members
      const remainingCount = team.length - 3; // Calculate the number of remaining team members

      return (
        <div className="flex -space-x-5 overflow-hidden">
          {displayedTeam.map((user, index) => (
            <Avatar
              key={index}
              className="inline-block border-2 border-background w-9 h-9"
            >
              {user.avatar ? (
                <AvatarImage src={user.avatar} />
              ) : (
                <AvatarFallback>{user.firstName[0]}</AvatarFallback>
              )}
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <div className="inline-block  rounded-full pl-5 py-2 text-sm font-normal text-gray-500 leading-5">
              +{remainingCount}
            </div>
          )}
        </div>
      );
    },
  },

  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const statusValue = row.getValue("status");

  //     const matchedStatus = statuses.find(
  //       (status) => status.value === statusValue
  //     );

  //     if (!matchedStatus) {
  //       return <span>Unknown</span>;
  //     }

  //     const { label, icon: IconComponent } = matchedStatus;

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {IconComponent && (
  //           <IconComponent className="mr-1 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{label}</span>
  //       </div>
  //     );
  //   },

  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "uploadedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UploadedBy" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("uploadedBy")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("date")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdatedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="LastUpdateBy" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("lastUpdatedBy")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
