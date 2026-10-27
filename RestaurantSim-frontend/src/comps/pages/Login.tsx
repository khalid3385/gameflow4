import { useState } from "react";
import FormCard, { FormHeader } from "../util/FormCard";
import TextInput from "../util/TextInput";
import Button from "../util/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "../util/TextInput";
import { SubmitButton } from "../util/Button";
import { useNavigate } from "react-router";

type FormFields = {
  password: string;
  email: string;
  request: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    console.log("rna");

    try {
      const response = await fetch("/auth/login?useCookies=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: String(data.email ?? "").trim(),
          password: String(data.password ?? ""),
        }),
      });

      if (!response.ok) {
        setError("request", {
          type: "custom",
          message: "Email and password don't match.",
        });
        return;
      }

      nav("/create");
    } catch {
      setError("request", {
        type: "custom",
        message: "Could not reach the server, try again later.",
      });
    }
  };

  const nav = useNavigate();

  async function logout() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!response.ok && response.status !== 401) {
        setMessage("Could not log out.");
        return;
      }

      setMessage("Logged out.");
    } catch {
      setMessage("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <FormCard width="w-110">
        <div>
          <FormHeader
            title="Login"
            description="Enter your details to login."
            marginBottom="2rem"
          />
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              {...register("email", {
                required: "Enter an email adress",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Enter a valid email adress",
                },
              })}
              onInput={() => clearErrors(["request"])}
              errorContent={
                errors?.email?.message || (errors?.request?.message ? " " : "")
              }
              placeholder="johndoe@gmail.com"
              labelContent={"Email"}
              name="email"
              maxLength={30}
              // required
            />
            <TextInput
              onInput={() => clearErrors(["request"])}
              {...register("password", {
                required: "Enter a password",
              })}
              placeholder="Enter password"
              errorContent={
                errors?.password?.message ||
                (errors?.request?.message ? " " : "")
              }
              labelContent={"Session password"}
              name="password"
              type="password"

              // required
            />
            <SubmitButton
              disabled={isSubmitting}
              text={isSubmitting ? "Logging in..." : "Login"}
            />
          </form>
        </div>
        {errors?.request && (
          <ErrorMessage errorContent={errors?.request?.message} />
        )}
      </FormCard>
    </div>
  );
};

export default Login;
