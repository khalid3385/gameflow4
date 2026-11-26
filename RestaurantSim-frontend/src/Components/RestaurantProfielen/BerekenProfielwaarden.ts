
import { doelstellingen } from './ProfielGegevens'

/**
 * Type voor het resultaat van de profielberekening.
 *
 * waarden: de nieuwe puntenverdeling.
 * foutmelding: een melding als de berekening niet mogelijk is.
 */
export type BerekenResultaat = {
  waarden: number[]
  foutmelding: string | null
}

/**
 * Berekent de nieuwe puntenverdeling op basis van drie gekozen doelstellingen.
 *
 * Regels:
 * - De drie gekozen doelstellingen krijgen elk 7 punten erbij.
 * - Er komen dus in totaal 21 punten bij.
 * - De overige doelstellingen leveren samen 21 punten in.
 * - Een niet-gekozen doelstelling mag nooit lager dan 2 worden.
 * - Punten worden zoveel mogelijk verdeeld over de hoogste waarden.
 *
 * @param beginWaarden De oorspronkelijke punten van het restaurant.
 * @param gekozenDoelstellingen De indices van de drie gekozen doelstellingen.
 */
export function berekenProfielWaarden(
  beginWaarden: number[],
  gekozenDoelstellingen: number[],
): BerekenResultaat {
  // Er moeten precies drie doelstellingen gekozen zijn.
  if (gekozenDoelstellingen.length !== 3) {
    return {
      waarden: [...beginWaarden],
      foutmelding: null,
    }
  }

  // Maak een kopie zodat de oorspronkelijke gegevens niet veranderen.
  const nieuweWaarden = [...beginWaarden]

  // Geef iedere gekozen doelstelling 7 extra punten.
  gekozenDoelstellingen.forEach((index) => {
    nieuweWaarden[index] += 7
  })

  // We moeten in totaal 21 punten van de overige doelstellingen afhalen.
  let teVerwijderenPunten = 21

  // Bereken hoeveel punten de niet-gekozen doelstellingen maximaal kunnen inleveren.
  const beschikbarePunten = nieuweWaarden.reduce(
    (totaal, waarde, index) => {
      // Gekozen doelstellingen leveren geen punten in.
      if (gekozenDoelstellingen.includes(index)) {
        return totaal
      }

      // Een doelstelling mag niet onder de 2 punten komen.
      return totaal + Math.max(0, waarde - 2)
    },
    0,
  )

  // Controleer of er genoeg punten beschikbaar zijn om te verdelen.
  if (beschikbarePunten < teVerwijderenPunten) {
    return {
      waarden: [...beginWaarden],
      foutmelding:
        'Deze verdeling is niet mogelijk. De niet-gekozen doelstellingen kunnen niet genoeg punten inleveren zonder onder 2 te komen.',
    }
  }

  // Verwijder de punten zolang er nog punten verdeeld moeten worden.
  while (teVerwijderenPunten > 0) {
    // Zoek welke niet-gekozen doelstellingen nog punten kunnen inleveren.
    const beschikbareIndices = nieuweWaarden
      .map((waarde, index) => ({ waarde, index }))
      .filter(
        (item) =>
          !gekozenDoelstellingen.includes(item.index) && item.waarde > 2,
      )

    // Stop met een foutmelding als er geen waarden meer beschikbaar zijn.
    if (beschikbareIndices.length === 0) {
      return {
        waarden: [...beginWaarden],
        foutmelding: 'De berekening kon niet worden uitgevoerd.',
      }
    }

    // Bepaal de hoogste waarde van de niet-gekozen doelstellingen.
    const hoogsteWaarde = Math.max(
      ...beschikbareIndices.map((item) => item.waarde),
    )

    // Zoek alle doelstellingen die deze hoogste waarde hebben.
    const hoogsteIndices = beschikbareIndices
      .filter((item) => item.waarde === hoogsteWaarde)
      .map((item) => item.index)

    // Verdeel de vermindering zo gelijkmatig mogelijk over de hoogste waarden.
    for (const index of hoogsteIndices) {
      // Controleer of er nog punten verwijderd moeten worden.
      if (teVerwijderenPunten <= 0) {
        break
      }

      // Controleer of de waarde niet onder de minimumwaarde komt.
      if (nieuweWaarden[index] > 2) {
        nieuweWaarden[index] -= 1
        teVerwijderenPunten -= 1
      }
    }
  }

  // Geef de berekende waarden terug zonder foutmelding.
  return {
    waarden: nieuweWaarden,
    foutmelding: null,
  }
}
