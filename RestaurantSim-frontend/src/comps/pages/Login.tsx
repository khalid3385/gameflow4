import Input from "../util/TextInput";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "../util/TextInput";
import { SubmitButton } from "../util/Button";
import { useLocation, useNavigate } from "react-router";
import { Card2, CardBody } from "../util/card/Card2";
import { CardHeader } from "../util/card/CardHeader";


import {useAuth} from "../../auth/AuthContext";
type FormFields = {
  password: string;
  email: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const {login } = useAuth()
  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    clearErrors("root.serverError");

    try {
      const response = await login ({
          email: String(data.email ?? "").trim(),
          password: String(data.password ?? ""),
        })

      if (!response.ok) {
        setError("root.serverError", {
          type: "custom",
          message: "Email and password don't match.",
        });
        return;
      }

      nav("/create");
    } catch {
      setError("root.serverError", {
        type: "custom",
        message: "Could not reach the server, try again later.",
      });
    }
  };

  const nav = useNavigate();

  


  const { state, search } = useLocation();
  const accountCreated = state?.accountCreated === true;
  const redirectedFromCreate =
    new URLSearchParams(search).get("reason") === "create";
  const serverError = errors?.root?.serverError;

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card2 className="w-110">
        <CardHeader
          title="Login"
          size="lg"
          description="Enter your details to login."
        />
        <CardBody>
          {(accountCreated || redirectedFromCreate) && (
            <p className="mb-3 text-sm" role="status">
              {accountCreated
                ? "Account created. Log in to continue."
                : "Please log in to create a session."}
            </p>
          )}

          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              registration={register("email", {
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
            />
            <Input
              type="password"
              registration={register("password", {
                required: "Enter a password",
              })}
              errorContent={
                errors?.password?.message || (serverError?.message ? " " : "")
              }
              labelContent={"Password"}
            />
            <SubmitButton
              className="mt-2! py-3"
              disabled={isSubmitting}
              text={isSubmitting ? "Logging in..." : "Login"}
            />
          </form>
        </CardBody>

        {serverError?.message && (
          <ErrorMessage errorContent={serverError.message} />
        )}
      </Card2>
    </div>
  );
};

export default Login;
