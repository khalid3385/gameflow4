import CreatorLoginForm from './Components/temp_loginForm'
import CreateSessionPanel from './Components/temp_createsessionpanel'
import JoinSessionForm from './Components/temp_joinsessionform'
import CreatorRegistrationForm from './Components/temp_creatorregirstrationfrom'

export default function App() {
  return (
    <main>
      <h1>RestaurantSim</h1>

      <JoinSessionForm />

      <hr />

      <CreatorRegistrationForm/>
      <CreatorLoginForm />
      <CreateSessionPanel/>
    </main>
  )
}