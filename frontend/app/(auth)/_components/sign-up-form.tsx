"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { Alert } from "@heroui/alert";
import { useRouter } from "next/navigation";

import { RegisterSchema } from "@/schemas";

export const SignUpForm = ({ redirectTo }: { redirectTo?: string }) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    form.trigger();
    setSuccess(false);
    setError(false);
    setMessage("");
    setValidationErrors({});
    form.clearErrors();

    startTransition(async () => {
      try {
        console.log("data", data);
        // const result = await signUpAction(data, {
        //   redirectTo: redirectTo,
        // });

        // if (!result.success && result.fieldErrors) {
        //   Object.entries(result.fieldErrors).forEach(([field, messages]) => {
        //     if (messages.length > 0) {
        //       form.setError(field as keyof typeof data, {
        //         type: "server",
        //         message: messages[0],
        //       });
        //     }
        //   });
        // }
        // if (result.success) {
        //   setSuccess(true);
        //   setError(false);
        //   setMessage(result.message);
        //   setValidationErrors({});
        //   form.reset();
        //   if (redirectTo) router.push(redirectTo);
        // } else {
        //   setSuccess(false);
        //   setError(true);
        //   setMessage(result.message);
        //   form.reset(
        //     {
        //       email: data.email,
        //       name: data.name,
        //     },
        //     {
        //       keepErrors: true,
        //       keepDirty: false,
        //       keepTouched: false,
        //       keepIsSubmitted: false,
        //     },
        //   );
        // }
      } catch (error: any) {
        // console.error("Sign-up error:", error);
        setError(true);
        setMessage(error.message || "An error occurred. Please try again.");
      }
    });
  };

  return (
    <Form
      className="flex flex-col w-full gap-4"
      method="post"
      validationErrors={validationErrors}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {!success && (
        <>
          <Controller
            control={form.control}
            name="name"
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <Input
                ref={ref}
                isClearable
                isRequired
                autoCapitalize="name"
                autoComplete="name"
                errorMessage={error?.message}
                isDisabled={isPending}
                isInvalid={invalid}
                label="Name"
                labelPlacement="outside"
                name={name}
                placeholder="Enter your name"
                startContent={<User className="text-gray-400" size={16} />}
                type="text"
                validationBehavior="aria"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                onClear={() => {
                  form.setValue("name", "", {
                    shouldValidate: true,
                  });
                }}
              />
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <Input
                ref={ref}
                isClearable
                isRequired
                autoComplete="email"
                errorMessage={error?.message}
                inputMode="email" // optional: shows email keyboard on mobile
                isDisabled={isPending}
                isInvalid={invalid}
                label="Email"
                labelPlacement="outside"
                name={name}
                placeholder="Enter your email"
                startContent={<Mail className="text-gray-400" size={16} />}
                type="text"
                validationBehavior="aria"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                onClear={() =>
                  form.setValue("email", "", {
                    shouldValidate: true,
                  })
                }
              />
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <Input
                ref={ref}
                isRequired
                autoComplete="new-password"
                endContent={
                  <span>
                    <Button
                      isIconOnly
                      className="absolute right-0 -translate-y-1/2 top-1/2"
                      variant="flat"
                      onPress={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="text-gray-400" size={16} />
                      ) : (
                        <Eye className="text-gray-400" size={16} />
                      )}
                    </Button>
                  </span>
                }
                errorMessage={error?.message}
                isDisabled={isPending}
                isInvalid={invalid}
                label="Password"
                labelPlacement="outside"
                name={name}
                placeholder="Enter your password"
                startContent={<Lock className="text-gray-400" size={16} />}
                type={showPassword ? "text" : "password"}
                validationBehavior="aria"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({
              field: { name, value, onChange, onBlur, ref },
              fieldState: { invalid, error },
            }) => (
              <Input
                ref={ref}
                isClearable
                isRequired
                autoComplete="new-password"
                endContent={
                  <span>
                    <Button
                      isIconOnly
                      className="absolute right-0 -translate-y-1/2 top-1/2"
                      variant="flat"
                      onPress={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="text-gray-400" size={16} />
                      ) : (
                        <Eye className="text-gray-400" size={16} />
                      )}
                    </Button>
                  </span>
                }
                errorMessage={error?.message}
                isDisabled={isPending}
                isInvalid={invalid}
                label="Confirm Password"
                labelPlacement="outside"
                name={name}
                placeholder="Confirm your password"
                startContent={<Lock className="text-gray-400" size={16} />}
                type={showConfirmPassword ? "text" : "password"}
                validationBehavior="aria"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                onClear={() =>
                  form.setValue("confirmPassword", "", {
                    shouldValidate: true,
                  })
                }
              />
            )}
          />
        </>
      )}
      {success && (
        <div className="flex items-center w-full my-3">
          <Alert color="success" title={message} />
        </div>
      )}

      {error && (
        <div className="flex items-center w-full my-3">
          <Alert color="danger" title={message} />
        </div>
      )}
      {!success ? (
        <Button
          className="w-full mt-2"
          color="primary"
          isDisabled={
            Object.keys(form.formState.errors).length !== 0 || isPending
          }
          isLoading={isPending}
          type="submit"
          variant="solid"
        >
          Sign Up
        </Button>
      ) : (
        <p className="mt-2 text-sm text-gray-500">
          A verification email has been sent, please check your inbox to
          continue. You can close this tab.
        </p>
      )}
    </Form>
  );
};
