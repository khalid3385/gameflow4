import { useId, useRef, useState, type KeyboardEvent } from "react";

type DiscussionRole = {
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

// Fill in each role here. Use a public path such as /roles/chef.webp for imageSrc.
const TEAM_ROLES: DiscussionRole[] = [
  { name: "Headchef", description: "Hier moet nog wat geschreven worden", imageSrc: "/roles/headchef.jpg", imageAlt: "" },
  { name: "Floormanager", description: "Hier moet nog wat geschreven worden", imageSrc: "/roles/floormanager.jpg", imageAlt: "" },
  { name: "Sales", description: "Hier moet nog wat geschreven worden", imageSrc: "/roles/sales-department.jpg", imageAlt: "" },
  { name: "HR", description: "Hier moet nog wat geschreven worden", imageSrc: "/roles/HR.jpg", imageAlt: "" },
  { name: "Financiën", description: "Hier moet nog wat geschreven worden", imageSrc: "/roles/Financiën.jpg", imageAlt: "" },
];

type TeamRolesPageProps = {
  teamName: string;
  memberCount: number | null;
};

export default function TeamRolesPage({
  teamName,
  memberCount,
}: TeamRolesPageProps) {
  const pageId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const countLabel =
    memberCount === null
      ? "Member count unavailable"
      : `${memberCount} ${memberCount === 1 ? "member" : "members"}`;

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const count = TEAM_ROLES.length;
    let nextIndex: number;

    switch (event.key) {
      case "ArrowLeft":
        nextIndex = (index + count - 1) % count;
        break;
      case "ArrowRight":
        nextIndex = (index + 1) % count;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = count - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  let discussionText: string;

  if (memberCount === null) {
    discussionText = "Review the five roles together.";
  } else if (memberCount > 5) {
    discussionText = "Discuss which roles teammates can share.";
  } else if (memberCount === 5) {
    discussionText = "Discuss who will take each of the five roles.";
  } else {
    discussionText = "Discuss who can take on more than one role.";
  }

  return (
    <section className="team-roles" aria-labelledby={`${pageId}-title`}>
      <header className="team-roles__header">
        <div>
          <h2 id={`${pageId}-title`}>Discuss roles</h2>
          <p>{discussionText}</p>
        </div>
        <div className="team-roles__team">
          <strong>{teamName}</strong>
          <p role="status">{countLabel}</p>
        </div>
      </header>

      <div className="team-roles__tabs" role="tablist" aria-label="Roles">
        {TEAM_ROLES.map((role, index) => (
          <button
            key={index}
            id={`${pageId}-tab-${index}`}
            ref={(button) => {
              tabRefs.current[index] = button;
            }}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`${pageId}-panel-${index}`}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            {role.name}
          </button>
        ))}
      </div>

      {TEAM_ROLES.map((role, index) => (
        <div
          key={index}
          id={`${pageId}-panel-${index}`}
          className="team-roles__panel"
          role="tabpanel"
          aria-labelledby={`${pageId}-tab-${index}`}
          tabIndex={0}
          hidden={index !== activeIndex}
        >
          <div>
            <h3>{role.name}</h3>
            {role.description && (
              <p className="team-roles__description">{role.description}</p>
            )}
          </div>

          <div className="team-roles__image">
            {role.imageSrc && (
              <img src={role.imageSrc} alt={role.imageAlt} loading="lazy" />
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
