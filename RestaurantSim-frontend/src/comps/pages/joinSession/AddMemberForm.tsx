import { SubmitButton } from "../../util/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "../../util/TextInput";
export type Member = {
  name: string;
};

type AddMemberProps = {
  handleAddMember: (name: string) => void | Promise<void>;
};

const AddMemberForm = ({ handleAddMember }: AddMemberProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Member>();

  const onSubmit: SubmitHandler<Member> = async ({ name }) => {
    try {
      await handleAddMember(name.trim());
      reset();
    } catch (error) {
      setError("name", {
        type: "server",
        message:
          error instanceof Error ? error.message : "Could not add the member.",
      });
    }
  };

  return (
    <form className="flex gap-4  w-full " onSubmit={handleSubmit(onSubmit)}>
      <Input
        registration={register("name", {
          required: "Member Name can not be empty",
        })}
        errorContent={errors?.name?.message}
        labelContent={"Member Name"}
        containerClassName="flex-1 h-full mt-0!"

        // maxLength={30}
      />

      <SubmitButton
        disabled={isSubmitting}
        className="h-13"
        text={isSubmitting ? "Creating..." : "+ Add"}
      />
    </form>
  );
};

export default AddMemberForm;