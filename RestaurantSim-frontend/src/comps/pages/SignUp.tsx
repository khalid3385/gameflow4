import FormCard, { FormHeader } from "../util/FormCard";
import TextInput from "../util/TextInput";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "../util/TextInput";
import { SubmitButton } from "../util/Button";
import { useNavigate } from "react-router";

type FormFields = {
  password: string;
  confirmPassword: string;
  email: string;
};

type RegistrationProblem = {
  title?: string;
  errors?: Record<string, string[]>;
};

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    clearErrors("root.serverError");


    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          email: String(data.email ?? "").trim(),
          password: String(data.password ?? ""),
        }),
      });

      if (!response.ok) {
        const problem: RegistrationProblem | null = await response
          .json()
          .catch(() => null);

        const errors = Object.values(problem?.errors ?? {})
          .flat()
          .join(" ");

        // extend later!!!
        if (problem?.errors.DuplicateUserName) {
          setError("email", {
            type: "custom",
            message: "Email is already taken",
          });
        }
        return;
      }

      // navigate to create page
      nav("/create");
    } catch {
      setError("root.serverError", {
        type: "custom",
        message: "Could not reach the server, try again later.",
      });
    }
  };

  const nav = useNavigate();
  const serverError = errors?.root?.serverError;

  return (
    <div className="flex flex-1 items-center justify-center">
      <FormCard width="w-110">
        <div>
          <FormHeader
            title="Sign up"
            description="Enter your details to sign up."
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
              errorContent={
                errors?.email?.message || (serverError?.message ? " " : "")
              }
              labelContent={"Email"}

              // required
            />
            <TextInput
              {...register("password", {
                required: "Enter a password",
                pattern: {
                  value: PWD_REGEX,
                  message:
                    "Password should be 8-24 characters and include at least 1 letter, 1 number and 1 special character",
                },
              })}
              errorContent={
                errors?.password?.message || (serverError?.message ? " " : "")
              }
              labelContent={"Password"}
            />

            <TextInput
              {...register("confirmPassword", {
                validate: (val: string) => {
                  if (errors?.password) return;

                  if (watch("password") && !val) {
                    return "Confirm your password";
                  }

                  if (watch("password") && watch("password") != val) {
                    return "Password does not match";
                  }
                },
              })}
              errorContent={
                errors?.confirmPassword?.message ||
                (serverError?.message ? " " : "")
              }
              labelContent={"Confirm Password"}
            />
            <SubmitButton
              disabled={isSubmitting}
              text={isSubmitting ? "Signing in..." : "Sign up"}
            />
          </form>
        </div>
        {serverError && <ErrorMessage errorContent={serverError?.message} />}
      </FormCard>
    </div>
  );
};

export default SignUp;
