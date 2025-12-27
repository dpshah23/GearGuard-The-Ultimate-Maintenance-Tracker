"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/alert";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { LoginSchema } from "@/schemas";
import { signInAction } from "@/actions/sign-in";

export const SignInForm = ({ redirectTo }: { redirectTo?: string }) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();
  // const urlError = searchParams.get("error");
  // const { update } = useSession();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    // reValidateMode: "onChange",
  });

  useEffect(() => {
    const urlError = new URLSearchParams(window.location.search).get("error");

    if (urlError === "OAuthAccountNotLinked") {
      setMessage(
        "This email is already associated with another account. Please sign in using your original method.",
      );
      setError(true);
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    form.trigger();
    setSuccess(false);
    setError(false);
    setMessage("");
    setValidationErrors({});

    startTransition(async () => {
      try {
        console.log("data", data);
        const result = await signInAction(data, {
          redirectTo: redirectTo,
        });

        if (!result.success && result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            if (messages.length > 0) {
              form.setError(field as keyof typeof data, {
                type: "server",
                message: messages[0], // show only the first message
              });
            }
          });

          return;
        }

        if (result.success) {
          setSuccess(true);
          setError(false);
          setMessage(result.message);
          setValidationErrors({});
          form.reset();
          await new Promise((resolve) => setTimeout(resolve, 1500));
          if (redirectTo) router.push("/admin/dashboard");
          router.refresh();
        } else {
          setError(true);
          setSuccess(false);
          setMessage(result.message);
          form.reset(
            {
              email: data.email,
            },
            {
              keepErrors: true,
              keepDirty: false,
              keepTouched: false,
              keepIsSubmitted: false,
            },
          );
        }
        console.log(data);

        
      } catch (error: any) {
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
                onClear={() => {
                  form.setValue("email", "", {
                    shouldValidate: true,
                  });
                }}
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
                autoComplete="current-password"
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
        Sign in
      </Button>
    </Form>
  );
};
