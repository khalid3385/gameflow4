
type DoelstellingenKeuzeProps = {
  doelstellingen: string[]
  beginWaarden: number[]
  gekozenDoelstellingen: number[]
  bijDoelstellingKeuze: (index: number) => void
}


  //Toont de doelstellingen die de gebruiker kan selecteren.
  // De gebruiker mag maximaal drie doelstellingen kiezen.

  export default function DoelstellingenKeuze({
  doelstellingen,
  beginWaarden,
  gekozenDoelstellingen,
  bijDoelstellingKeuze,
}: DoelstellingenKeuzeProps) {
  return (
    <div className="goal-selection">
      <h2>Kies je doelstellingen</h2>

      <p>
        Selecteer precies 3 doelstellingen.
        Elke gekozen doelstelling krijgt 7 punten erbij.
      </p>

      <p className="selected-count">
        Geselecteerd: {gekozenDoelstellingen.length} / 3
      </p>

      <div className="goal-list">
        {doelstellingen.map((doelstelling, index) => {
          // Controleer of deze doelstelling al geselecteerd is.
          const isGeselecteerd = gekozenDoelstellingen.includes(index)

          // Als er al drie gekozen zijn, kunnen andere keuzes niet aangevinkt worden.
          const isUitgeschakeld =
            gekozenDoelstellingen.length === 3 && !isGeselecteerd

          return (
            <label className="goal-option" key={doelstelling}>
              <input
                type="checkbox"
                checked={isGeselecteerd}
                disabled={isUitgeschakeld}
                onChange={() => bijDoelstellingKeuze(index)}
              />

              <span>{doelstelling}</span>

              <span className="goal-start-value">
                {beginWaarden[index]} punten
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
