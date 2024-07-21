import { useAuth0 } from "@auth0/auth0-react";
import "./css/Home.css";
import Hero from "../components/hero/Hero";
import Popular from "../components/popular/Popular";

export default function Home() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <div>
      <Hero />
      <Popular />
    </div>
  );
}
