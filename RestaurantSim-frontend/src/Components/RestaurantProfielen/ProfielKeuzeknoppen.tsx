
import type { RestaurantProfiel } from './ProfielGegevens'

type ProfielKeuzeknoppenProps = {
  profielen: RestaurantProfiel[]
  geselecteerdProfielId: number
  bijProfielKeuze: (profielId: number) => void
}

// Toont de knoppen waarmee de gebruiker een restaurantprofiel kiest.
 
export default function ProfielKeuzeknoppen({
  profielen,
  geselecteerdProfielId,
  bijProfielKeuze,
}: ProfielKeuzeknoppenProps) {
  return (
    <div className="restaurant-toggles">
      {profielen.map((profiel) => (
        <button
          key={profiel.id}
          type="button"
          className={
            geselecteerdProfielId === profiel.id
              ? 'restaurant-toggle active'
              : 'restaurant-toggle'
          }
          aria-pressed={geselecteerdProfielId === profiel.id}
          onClick={() => bijProfielKeuze(profiel.id)}
        >
          {profiel.naam}
        </button>
      ))}
    </div>
  )
}
