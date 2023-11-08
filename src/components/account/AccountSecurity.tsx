import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import useRegister from "~/hooks/useRegister";
import { api } from "~/utils/api";
import PasswordValidation from "../authentication/PasswordValidation";
import SpinnerButton from "../common/SpinnerButton";
import { notify, notifyError } from "../ReactHotToast";
import Modal from "../common/AlertModal";
import moment from "moment";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form";
import { Input } from "../common/input";
import {
  UpdateUserSecurity,
  updateUserSecuritySchema,
} from "~/validation/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export const AccountSecurity = ({ profile, isInvite, token }) => {
  const {
    setIsPasswordFocused,
    isPasswordFocused,
    showPassword,
    setShowPassword,
    setIsPasswordValid,
  } = useRegister();

  const [open, setOpen] = useState(false);
  const formattedDate = moment(profile?.user?.passwordLastUpdate).format(
    "MMMM Do YYYY"
  );

  const router = useRouter();

  const { mutateAsync: updateUserPassword, isLoading } =
    api.profile.updateUserPassword.useMutation();

  const {
    mutateAsync: userSetNewPassword,
    isSuccess,
    isLoading: userSetsNewPwisLoading,
  } = api.authentication.userSetNewPassword.useMutation();

  useEffect(() => {
    if (profile?.user?.email) {
      form.setValue("email", profile.user.email);
    }
  }, [profile]);
  console.log("profileprofile", profile);

  const onSubmit = async () => {
    const data = form.getValues();

    try {
      const updatedFields = {};

      // Handle isInvite case: Only update the password and sign in
      if (isInvite) {
        if (data.newPassword) {
          updatedFields.newPassword = data.newPassword;
          updatedFields.confirmPassword = data.confirmPassword;
        } else {
          notify({ message: "New password is required." });
          return;
        }
        // Update the password
        await userSetNewPassword({
          ...updatedFields,
          token: token,
          isInvite,
        }).then(async (payload) => {
          notify({ message: payload.message });
        });
        return;
      }

      // The rest of the logic for non-invite cases
      if (data.newPassword) {
        updatedFields.newPassword = data.newPassword;
        updatedFields.confirmPassword = data.confirmPassword;
      }
      if (profile && data.email !== profile.user.email) {
        updatedFields.email = data.email;
      }
      if (Object.keys(updatedFields).length === 0) {
        notify({ message: "No fields have been modified." });
        return;
      }
      if (profile ?? profile.user) {
        updatedFields.userId = profile.user.id;
      } else {
        console.error("Profile or user is undefined");
        return;
      }
      await updateUserPassword(updatedFields).then((payload) => {
        notify({ message: payload.message });
        form.reset(); // Reset form values
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const form = useForm<UpdateUserSecurity>({
    resolver: zodResolver(updateUserSecuritySchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      email: "",
    },
  });

  useEffect(() => {
    if (isSuccess) void router.push("/user/dashboard");
  }, [isSuccess]);

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        func={() => handleSecurityUpdate()}
        title={"Change security details"}
        message={"Are you sure you want to proceed?"}
        actionBtn={"continue"}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mx-5 my-5"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      {...field}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="text-gray-400" />
                      ) : (
                        <Eye className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* PASSWORD MEETS REQS */}
          <div
            className={`absolute  transition duration-300 ease-in-out  ${
              isPasswordFocused ? "opacity-100" : "opacity-0"
            }`}
            style={{
              pointerEvents: isPasswordFocused ? "auto" : "none",
            }}
          >
            <PasswordValidation
              password={form.watch("newPassword")}
              setIsPasswordValid={setIsPasswordValid}
            />
          </div>
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isInvite ? null : (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex items-center justify-end  border-t border-gray-900/10  py-4 ">
            <SpinnerButton
              loading={isLoading || userSetsNewPwisLoading}
              disabled={isLoading || userSetsNewPwisLoading}
              type="submit"
              className="flex justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              {isLoading || userSetsNewPwisLoading ? "Saving" : "Save"}
            </SpinnerButton>
          </div>
        </form>
      </Form>
    </>
  );
};
