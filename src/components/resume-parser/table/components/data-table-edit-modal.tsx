import React, { useState } from "react";
import { Button } from "~/components/common/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/common/dialog";
import { DropdownMenuItem } from "~/components/common/dropdown-menu";
import { Input } from "~/components/common/input";
import { Label } from "~/components/common/label";

const DataTableEditModal = ({ dataToUpdate, updateDocument, onChange }) => {
  // const [position, setPosition] = useState("bottom");

  // const handlePositionChange = (newPosition) => {
  //   setPosition(newPosition);
  //   onChange("status", newPosition);
  // };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit document</DialogTitle>
            <DialogDescription>
              Update your document information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                value={dataToUpdate.title}
                id="title"
                onChange={(e) => onChange("title", e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Input
                    value={dataToUpdate.status}
                    id="status"
                    onChange={(e) => onChange("status", e.target.value)}
                    className="col-span-3"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Document status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={handlePositionChange}
                  >
                    <DropdownMenuRadioItem value="BACKLOG">
                      Backlog
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="TODO">
                      Todo
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="INPROGRESS">
                      In Progress
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="DONE">
                      Done
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="CANCELED">
                      Canceled
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
          </div>
          <DialogFooter>
            <Button
              onClick={() => updateDocument()}
              className="bg-primary-500"
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTableEditModal;
