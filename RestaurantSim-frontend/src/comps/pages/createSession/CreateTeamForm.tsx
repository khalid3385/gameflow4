import { SubmitButton } from "../../util/Button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "../../util/TextInput";

export type TeamInput = {
  name: string;
  profileNumber: number;
};

const CreateTeamForm = ({
  handleAddTeam,
  usedProfiles = [],
}: {
  handleAddTeam: (name: string, profileNumber: number) => void;
  usedProfiles?: number[];
}) => {
  const {
    register,
    handleSubmit,
    // setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TeamInput>();

  const onSubmit: SubmitHandler<TeamInput> = async (data: TeamInput) => {
    clearErrors("root.serverError");

    handleAddTeam(data.name, data.profileNumber);
  };

  return (
    <form className="flex gap-4  w-full " onSubmit={handleSubmit(onSubmit)}>
      <Input
        registration={register("name", {
          required: "Team Name can not be empty",
        })}
        errorContent={errors?.name?.message}
        labelContent={"Team Name"}
        containerClassName="flex-1 h-full mt-0!"

        // maxLength={30}
      />

      <Input
        type="number"
        min={1}
        max={8}
        registration={register("profileNumber", {
          required: "Profile number can not be empty",
          valueAsNumber: true,
          min: { value: 1, message: "Profile number must be between 1 and 8" },
          max: { value: 8, message: "Profile number must be between 1 and 8" },
          validate: (value) =>
            !usedProfiles.includes(value) ||
            "This profile is already used by another team",
        })}
        errorContent={errors?.profileNumber?.message}
        labelContent={"Profile Number"}
        containerClassName="mt-0!"
      />

      <SubmitButton
        disabled={isSubmitting}
        className="h-13"
        text={isSubmitting ? "Creating..." : "+ Add Team"}
      />
    </form>
  );
};

export default CreateTeamForm;