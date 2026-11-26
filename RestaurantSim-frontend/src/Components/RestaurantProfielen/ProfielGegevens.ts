
/**
 * Dit bestand bevat alle vaste gegevens voor de restaurantprofielen.
 * De beginwaarden worden gebruikt bij het weergeven en aanpassen
 * van de doelstellingen.
 */

// De tien doelstellingen van het restaurantsimulatiespel.
export const doelstellingen = [
  'Winst',
  'Servicesnelheid',
  'Klanttevredenheid',
  'Voedselkwaliteit',
  'Hygiëne',
  'Ordernauwkeurigheid',
  'Capaciteitsbenutting',
  'Personeelstevredenheid',
  'Reputatie',
  'Voedselverspilling',
]

// Type dat beschrijft hoe een restaurantprofiel eruitziet.
export type RestaurantProfiel = {
  id: number
  naam: string
  waarden: number[]
}

// De acht restaurantprofielen met hun beginwaarden.
// De volgorde van de waarden komt overeen met de doelstellingen hierboven.
export const restaurantProfielen: RestaurantProfiel[] = [
  {
    id: 1,
    naam: 'Fastfood',
    waarden: [18, 16, 14, 12, 12, 10, 8, 5, 3, 2],
  },
  {
    id: 2,
    naam: 'Fine dining',
    waarden: [12, 4, 18, 20, 15, 6, 4, 5, 12, 4],
  },
  {
    id: 3,
    naam: 'Casual dining',
    waarden: [17, 8, 14, 14, 10, 10, 8, 6, 5, 8],
  },
  {
    id: 4,
    naam: 'Café',
    waarden: [16, 10, 15, 12, 10, 7, 7, 8, 8, 7],
  },
  {
    id: 5,
    naam: 'Bar',
    waarden: [20, 15, 12, 8, 7, 7, 6, 9, 10, 6],
  },
  {
    id: 6,
    naam: 'Diner',
    waarden: [17, 12, 13, 13, 10, 10, 8, 6, 4, 7],
  },
  {
    id: 7,
    naam: 'Hibachi',
    waarden: [14, 5, 14, 18, 15, 7, 5, 6, 11, 5],
  },
  {
    id: 8,
    naam: 'Catering',
    waarden: [22, 10, 6, 11, 13, 12, 8, 5, 3, 10],
  },
]
