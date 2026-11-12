const CreateTeamForm = ({ handleAddTeam }) => {
  const {
    register,
    handleSubmit,
    setError,
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
        registration={register("profileNumber", {
          required: "Profile number can not be empty",
        })}
        errorContent={errors?.profileNumber?.message}
        labelContent={"Profile Number"}
        containerClassName="mt-0!"

        // maxLength={30}
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