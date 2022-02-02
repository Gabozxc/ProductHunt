import styled from "@emotion/styled";
import { useContext } from "react";
import Link from "next/link";
import Navegacion from "./Navegacion";
import Buscador from "../ui/Buscador";
import Boton from "../ui/StylesComponent/Boton";

import { firebaseContext } from "../../firebase";

const HeaderContent = styled.header`
  border-bottom: 1px solid var(--gris2);
  padding: 1rem 0;
`;

const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
  .link-1 {
    display: flex;
    align-items: center;
  }
  .link-2 {
    display: flex;
    align-items: center;
     p {
      margin-right: 2rem;
     }
  }
`;

const Logo = styled.p`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto Slab", serif;
  margin-right: 2rem;
`;

const Header = () => {
  const { usuario, firebase } = useContext(firebaseContext);

  return (
    <HeaderContent>
      <ContenedorHeader>
        <div className="link-1">
          <Link href="/">
            <a>
              <Logo>P</Logo>
            </a>
          </Link>
          <Buscador />
          <Navegacion />
        </div>
        <div className="link-2">
          {usuario ? (
            <>
              <p>
                Hola: {usuario.displayName}
              </p>
              <Boton bgColor="true" onClick={() => firebase.cerrarSesion()}>
                Cerrar sesion
              </Boton>
            </>
          ) : (
            <>
              <Link href="/login">
                <Boton bgColor="true">Log in</Boton>
              </Link>
              <Link href="/crear-cuenta">
                <Boton>Sign up</Boton>
              </Link>
            </>
          )}
        </div>
      </ContenedorHeader>
    </HeaderContent>
  );
};

export default Header;
