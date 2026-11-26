
type WaardenTabelProps = {
  doelstellingen: string[]
  beginWaarden: number[]
  nieuweWaarden?: number[]
}

/**
 * Toont de beginwaarden van een restaurantprofiel.
 * Als nieuwe waarden zijn meegegeven, toont de tabel ook de verschillen.
 */
export default function WaardenTabel({
  doelstellingen,
  beginWaarden,
  nieuweWaarden,
}: WaardenTabelProps) {
  // Bereken de som van de beginwaarden.
  const beginTotaal = beginWaarden.reduce(
    (totaal, waarde) => totaal + waarde,
    0,
  )

  // Bereken de som van de nieuwe waarden als die beschikbaar zijn.
  const nieuwTotaal = nieuweWaarden
    ? nieuweWaarden.reduce((totaal, waarde) => totaal + waarde, 0)
    : null

  // Controleer of er nieuwe waarden zijn meegegeven.
  const toontNieuweWaarden = nieuweWaarden !== undefined

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Doelstelling</th>
            <th>Beginwaarde</th>

            {toontNieuweWaarden && (
              <>
                <th>Nieuwe waarde</th>
                <th>Verschil</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {doelstellingen.map((doelstelling, index) => {
            // Bereken het verschil tussen de oude en nieuwe waarde.
            const verschil = toontNieuweWaarden
              ? nieuweWaarden[index] - beginWaarden[index]
              : 0

            return (
                
              <tr key={doelstelling}>
                <td>{doelstelling}</td>
                <td>{beginWaarden[index]}</td>
                {toontNieuweWaarden && (
                  <>
                    <td>{nieuweWaarden[index]}</td>

                    <td
                      className={
                        verschil > 0
                          ? 'positive-change'
                          : verschil < 0
                            ? 'negative-change'
                            : ''
                      }
                    >
                      {verschil > 0 ? '+' : ''}
                      {verschil}
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Toon het totaal van de beginwaarden. */}
      <p className="profile-total">
        Totaal beginwaarden: {beginTotaal} / 100
      </p>

      {/* Toon het totaal van de nieuwe waarden als deze beschikbaar zijn. */}
      {toontNieuweWaarden && (
        <p className="new-total">
          Totaal nieuwe waarden: {nieuwTotaal} / 100
        </p>
      )}
    </div>
  )
}
