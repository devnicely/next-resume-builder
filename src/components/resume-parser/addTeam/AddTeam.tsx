import * as React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/common/avatar";
import { Button } from "~/components/common/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/common/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select";
import { api } from "~/utils/api";
import { useUserProfile } from "~/context/UserProfileContext";

export function AddTeam({
  handleSelectedUsers,
  initialTeam,
  open,
  setOpen,
  updateTeamAccess,
}) {
  const [selectedUsers, setSelectedUsers] = React.useState(initialTeam || []);

  const { profile } = useUserProfile();
  const [tempPermission, setTempPermission] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    if (initialTeam) {
      const initialPermissions = {};
      initialTeam.forEach((user) => {
        initialPermissions[user.id] = user.permission || "EDITOR";
      });
      setTempPermission(initialPermissions);
      setSelectedUsers(initialTeam);
    }
  }, [initialTeam]);

  const updateSelectedUsers = (user) => {
    const existingUserIndex = selectedUsers.findIndex(
      (selectedUser) => selectedUser.id === user.id
    );

    if (existingUserIndex > -1) {
      // Remove the user from selectedUsers
      const newSelectedUsers = [...selectedUsers];
      newSelectedUsers.splice(existingUserIndex, 1);
      setSelectedUsers(newSelectedUsers);
      handleSelectedUsers(newSelectedUsers);

      // Remove the user's permission from tempPermission
      const newTempPermission = { ...tempPermission };
      delete newTempPermission[user.id];
      setTempPermission(newTempPermission);
    } else {
      // Add the user to selectedUsers with the current permission setting
      const permission = tempPermission[user.id] || "EDITOR";
      const newSelectedUsers = [...selectedUsers, { ...user, permission }];
      setSelectedUsers(newSelectedUsers);
      handleSelectedUsers(newSelectedUsers);
    }
  };

  const { data: team } = api.team.getAllTeamMembers.useQuery();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>Team members</DialogTitle>
          <DialogDescription>
            Invite a user to this work. You can decide teammate&apos;s
            privileges
          </DialogDescription>
        </DialogHeader>
        <Command className="overflow-hidden rounded-t-none border-t">
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup className="p-2">
              {team?.teamMembers && team.teamMembers.length
                ? team.teamMembers.map((user) => (
                    <CommandItem
                      key={user.email}
                      className="flex items-center px-2"
                      onSelect={() => updateSelectedUsers(user)}
                    >
                      <Avatar>
                        {user.avatar ? (
                          <AvatarImage src={user.avatar.url} alt="Image" />
                        ) : (
                          <AvatarFallback>
                            {" "}
                            {profile?.user?.firstName
                              ? profile.user.firstName[0]
                              : "A"}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="ml-2">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName + " " + user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>

                      {selectedUsers.some(
                        (selectedUser) => selectedUser.id === user.id
                      ) ? (
                        <Select
                          defaultValue={tempPermission[user.id] || "EDITOR"}
                          onValueChange={(value) => {
                            // Update tempPermission
                            setTempPermission({
                              ...tempPermission,
                              [user.id]: value,
                            });

                            // Find and update the user in selectedUsers
                            const userIndex = selectedUsers.findIndex(
                              (selectedUser) => selectedUser.id === user.id
                            );
                            const newSelectedUsers = [...selectedUsers];
                            newSelectedUsers[userIndex].permission = value;

                            // Update state
                            setSelectedUsers(newSelectedUsers);
                            handleSelectedUsers(newSelectedUsers);
                          }}
                        >
                          <SelectTrigger className="ml-auto w-[110px] bg-white">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EDITOR">Can edit</SelectItem>
                            <SelectItem value="VIEWER">Can view</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : null}
                    </CommandItem>
                  ))
                : null}
            </CommandGroup>
          </CommandList>
        </Command>
        <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
          {selectedUsers.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden">
              {selectedUsers.map((user) => (
                <Avatar
                  key={user.email}
                  className="inline-block border-2 border-background"
                >
                  {user.avatar ? (
                    <AvatarImage src={user.avatar.url} />
                  ) : (
                    <AvatarFallback>
                      {user?.firstName ? user?.firstName[0] : "A"}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select team members to add to this work.
            </p>
          )}
          <Button
            onClick={() => {
              if (updateTeamAccess) {
                updateTeamAccess();
              }
              setOpen(false);
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
