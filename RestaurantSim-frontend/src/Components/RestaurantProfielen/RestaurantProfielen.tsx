
import { useMemo, useState } from 'react'

import './RestaurantProfielen.css'

import {
  doelstellingen,
  restaurantProfielen,
} from './ProfielGegevens'

import { berekenProfielWaarden } from './BerekenProfielwaarden'

import ProfielKeuzeknoppen from './ProfielKeuzeknoppen'
import DoelstellingenKeuze from './DoelstellingenKeuze'
import WaardenTabel from './WaardenTabel'

/**
 * Hoofdcomponent voor het bekijken en aanpassen van restaurantprofielen.
 *
 * Dit component:
 * - Beheert het geselecteerde restauranttype.
 * - Beheert de gekozen doelstellingen.
 * - Laat de beginwaarden zien.
 * - Bereken de nieuwe waarden.
 * - Toont het resultaat van de berekening.
 */
export default function RestaurantProfielen() {
  // Bewaar het ID van het geselecteerde restaurantprofiel.
  const [geselecteerdProfielId, setGeselecteerdProfielId] =
    useState<number>(1)

  // Bewaar de indices van de gekozen doelstellingen.
  const [gekozenDoelstellingen, setGekozenDoelstellingen] =
    useState<number[]>([])

  // Zoek het geselecteerde restaurantprofiel op.
  const geselecteerdProfiel = restaurantProfielen.find(
    (profiel) => profiel.id === geselecteerdProfielId,
  )

  // Bereken de nieuwe waarden zodra de selectie verandert.
  const berekening = useMemo(() => {
    // Als er geen profiel gevonden is, geef dan een foutmelding terug.
    if (!geselecteerdProfiel) {
      return {
        waarden: [],
        foutmelding: 'Het restaurantprofiel kon niet worden gevonden.',
      }
    }

    return berekenProfielWaarden(
      geselecteerdProfiel.waarden,
      gekozenDoelstellingen,
    )
  }, [geselecteerdProfiel, gekozenDoelstellingen])

  /**
   * Verander het geselecteerde restaurantprofiel.
   * De gekozen doelstellingen worden opnieuw leeggemaakt.
   */
  function kiesProfiel(profielId: number) {
    setGeselecteerdProfielId(profielId)
    setGekozenDoelstellingen([])
  }

  /**
   * Selecteer of deselecteer een doelstelling.
   * Er mogen maximaal drie doelstellingen geselecteerd zijn.
   */
  function wisselDoelstelling(index: number) {
    setGekozenDoelstellingen((huidigeKeuze) => {
      // Als de doelstelling al gekozen is, verwijder deze uit de selectie.
      if (huidigeKeuze.includes(index)) {
        return huidigeKeuze.filter(
          (gekozenIndex) => gekozenIndex !== index,
        )
      }

      // Laat geen vierde doelstelling toe.
      if (huidigeKeuze.length >= 3) {
        return huidigeKeuze
      }

      // Voeg de nieuwe doelstelling toe.
      return [...huidigeKeuze, index]
    })
  }

  // Toon een melding als er geen profiel gevonden is.
  if (!geselecteerdProfiel) {
    return (
      <section className="restaurant-profiles">
        <p className="calculation-error">
          Het restaurantprofiel kon niet worden gevonden.
        </p>
      </section>
    )
  }

  return (
    <section className="restaurant-profiles">
      <h2>Restaurantprofielen</h2>

      <p>
        Kies een restauranttype om de beginwaarden te bekijken
        en selecteer vervolgens drie doelstellingen.
      </p>

      {/* Knoppen om het restauranttype te kiezen. */}
      <ProfielKeuzeknoppen
        profielen={restaurantProfielen}
        geselecteerdProfielId={geselecteerdProfielId}
        bijProfielKeuze={kiesProfiel}
      />

      <hr />

      {/* Toon de gegevens van het geselecteerde restaurant. */}
      <div className="profile-details">
        <h2>{geselecteerdProfiel.naam}</h2>

        <h3>Beginwaarden</h3>

        <WaardenTabel
          doelstellingen={doelstellingen}
          beginWaarden={geselecteerdProfiel.waarden}
        />
      </div>

      <hr />

      {/* Laat de gebruiker drie doelstellingen selecteren. */}
      <DoelstellingenKeuze
        doelstellingen={doelstellingen}
        beginWaarden={geselecteerdProfiel.waarden}
        gekozenDoelstellingen={gekozenDoelstellingen}
        bijDoelstellingKeuze={wisselDoelstelling}
      />

      {/* Toon de berekening zodra drie doelstellingen gekozen zijn. */}
      {gekozenDoelstellingen.length === 3 && (
        <div className="calculation-result">
          <hr />

          <h2>Nieuwe puntenverdeling</h2>

          {/* Toon een foutmelding als de berekening niet mogelijk is. */}
          {berekening.foutmelding ? (
            <p className="calculation-error" role="alert">
              {berekening.foutmelding}
            </p>
          ) : (
            <>
              <p className="calculation-note">
                De gekozen doelstellingen krijgen elk 7 punten erbij.
                De overige doelstellingen leveren samen 21 punten in.
              </p>

              {/* Toon de beginwaarden, nieuwe waarden en verschillen. */}
              <WaardenTabel
                doelstellingen={doelstellingen}
                beginWaarden={geselecteerdProfiel.waarden}
                nieuweWaarden={berekening.waarden}
              />
            </>
          )}
        </div>
      )}
    </section>
  )
}
