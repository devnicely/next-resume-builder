import React, { FC, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form";
import { Input } from "~/components/common/input";
import { Label } from "~/components/common/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/common/button";
import {
  type UpdateUserDetails,
  updateUserDetailsSchema,
  type UserProfile,
} from "~/validation/profile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/date-picker/popover";
import { cn } from "~/components/common/Classnames";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/common/command";
import countries from "~/utils/countries";
import SpinnerButton from "../common/SpinnerButton";
import { api } from "~/utils/api";
import { notify } from "../ReactHotToast";
import convertFileToBase64 from "~/helpers/convertFileToBase64";
interface AccountDetailsProps {
  profile: { user: UserProfile };
  refetchProfile: () => void;
  changeActiveStep?: (newStep: string) => void;
}

export const AccountDetails: FC<AccountDetailsProps> = ({
  profile,
  refetchProfile,
  changeActiveStep,
}) => {
  const [base64Avatar, setBase64Avatar] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const { mutateAsync: updateUserDetails, isLoading } =
    api.profile.updateUserDetails.useMutation();

  const { mutateAsync: uploadAvatar, isLoading: isUploadLoading } =
    api.upload.uploadAvatar.useMutation();

  const form = useForm<UpdateUserDetails>({
    resolver: zodResolver(updateUserDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      // avatar: {},
    },
  });

  useEffect(() => {
    if (profile?.user) {
      const { country, firstName, lastName, avatar } = profile.user;
      const dirtyFields = form.formState.dirtyFields;

      if (!dirtyFields.firstName) form.setValue("firstName", firstName ?? "");
      if (!dirtyFields.lastName) form.setValue("lastName", lastName ?? "");
      if (!dirtyFields.country) form.setValue("country", country ?? "");
      if (!dirtyFields.avatar) form.setValue("avatar", avatar?.url ?? "");
    }
  }, [profile]);

  const onSubmit = async (data: UpdateUserDetails) => {
    let isChanged = false;
    const updatedData: UpdateUserDetails = {
      userId: profile?.user?.id ?? "",
    };

    Object.keys(form.formState.dirtyFields).forEach((key) => {
      if (key !== "avatar") {
        updatedData[key] = data[key];
        isChanged = true;
      }
    });

    if (base64Avatar) {
      try {
        const path = `${profile?.user.id}/profile_logo`;

        const input = {
          userId: profile?.user?.id,
          file: base64Avatar,
          path: path,
          imgName: uploadedFileName,
        };

        const uploadResponse = await uploadAvatar(input);

        if (uploadResponse && uploadResponse.success) {
          updatedData.avatar = uploadResponse.image;
          isChanged = true;
        }
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }
    }

    if (!isChanged) {
      notify({ message: "Nothing to update." });
      return;
    }

    await updateUserDetails(updatedData).then(
      (payload: { message: string }) => {
        notify({ message: payload.message });
        // refetchProfile();
        if (changeActiveStep) {
          changeActiveStep("Step 2");
        }
      }
    );
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mx-5 my-5"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? countries.find(
                              (country) => country.value === field.value
                            )?.value
                          : "Select country"}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] h-[300px] p-0 ">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="overflow-y-auto">
                        {countries.map((country) => (
                          <CommandItem
                            value={country.value}
                            key={country.value}
                            onSelect={() => {
                              field.onChange(country.value);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                country.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {country.value}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the country that will be used in the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <Label id="avatar">
                Avatar
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) {
                      try {
                        const base64data = await convertFileToBase64(file);
                        setBase64Avatar(base64data);
                      } catch (error) {
                        console.error(
                          "Error converting file to Base64:",
                          error
                        );
                      }
                      setUploadedFileName(file.name);
                    }
                    field.onChange(file);
                  }}
                />
              </Label>
            )}
          />
          <div className="flex items-center justify-end  border-t border-gray-900/10 px-4 py-4 ">
            <SpinnerButton
              loading={isLoading || isUploadLoading}
              disabled={isLoading || isUploadLoading}
              type="submit"
              className="flex justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {isLoading || isUploadLoading ? "Saving" : "Save"}
            </SpinnerButton>
          </div>
        </form>
      </Form>
    </>
  );
};
