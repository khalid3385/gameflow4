import { useState } from "react";
import { Card2 } from "../../util/card/Card2";
import { CardHeader } from "../../util/card/CardHeader";
import JoinTeamForm from "./JoinTeamForm";
import AddMemberForm from "./AddMemberForm";
import Button from "../../util/Button";

export type JoinedTeam = {
  id: number;
  name: string;
  profileNumber: number;
  joinCode: string;
  members: string[];
};

export default function JoinSession() {
  const [team, setTeam] = useState<JoinedTeam | null>(null);
  const [members, setMembers] = useState(["jacob"]);

  function handleAddMember(name) {
    setMembers(m => [...m, name])
  }

  function handleDeleteMember(name) {
    setMembers(m => m.filter(n => n !== name))
  }

  return !team ? (
    <div className="flex flex-1  items-center justify-center">
      <Card2 className="w-110">
        <JoinTeamForm setTeam={setTeam} />
      </Card2>
    </div>
  ) : (
    <div className="flex flex-1 flex-col m-10 ">
      <Card2 className="flex flex-col gap-5 flex-1">
        <CardHeader
          title={<span>You joined team: <span className="font-bold">{team.name}</span></span>}
          size="lg"
          align="left"
          className="mb-2"
          description="Add your team members and await the host to start the game!"
        />
        <section className="mt-4  flex flex-col min-h-0 justify-start items-start">
          <CardHeader
            className="mb-2"
            title="Add Member"
            size="md"
            align="left"
          />
          <AddMemberForm handleAddMember={(name: string) => handleAddMember(name)} />
        </section>
        <div className="flex-1 w-full p-5 border border-context-border rounded-xl flex flex-col gap-2">
          {members.length > 0 ? (
            members.map(m => 
              <MemberRow key={m} handleDeleteMember={() => handleDeleteMember(m)} name={m} />
            )
          ) : (
            <div className="flex-1 flex justify-center items-center opacity-50">
              No team members added
            </div>
          )}
        </div>
      </Card2>
    </div>
  );
}



const MemberRow = ({name, handleDeleteMember}) => {
  return (
    <div className="flex items-center justify-between border border-context-border bg-white p-3 rounded-xl ">
      {name}

      <Button onClick={handleDeleteMember} className="bg-red-500 text-white" >
        Delete
      </Button>
    </div>

  );
}



