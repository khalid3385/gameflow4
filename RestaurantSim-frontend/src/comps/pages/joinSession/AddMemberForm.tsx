import { SubmitButton } from "../../util/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "../../util/TextInput";
export type Member = {
  name: string;

};

const AddMemberForm = ({ handleAddMember }) => {
  const {
    register,
    handleSubmit,
    // setError,
    setValue,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<Member>();

  const onSubmit: SubmitHandler<Member> = async (data: Member) => {
    clearErrors("root.serverError");

    handleAddMember(data.name);
    reset()
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