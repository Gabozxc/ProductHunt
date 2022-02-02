import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { firebaseContext } from "../../firebase/index";
import Error404 from "../../components/Layout/Error404";
import Layout from "../../components/Layout/Layout";
import styled from "@emotion/styled";
import {formatDistanceToNow} from "date-fns";
import { es } from "date-fns/locale";
import {
  CampoInputs,
  InputSubmit,
} from "../../components/ui/StylesComponent/Formulario";
import Boton from "../../components/ui/StylesComponent/Boton";
import Loading from "../../components/ui/Loading";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
  .h2-titulo {
    margin: 2rem 0;
  }
  .span-escrito {
    font-weight: bold;
  }
  .li-comentario {
    border: 1px solid #e1e1e1;
    padding: 2rem;
  }
  .votos-div {
    margin-top: 5rem;
    .parrafo-voto {
      text-align: center;
    }
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #ffff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;
const TituloH1 = styled.h1`
  text-align: center;
  margin-top: 5rem;
`;

const Producto = () => {
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [consultarDB, setConsultarDB] = useState(true);

  const { firebase, usuario } = useContext(firebaseContext);

  const router = useRouter();

  //PaginProducto es un ID que traigo del query del router, q es basicamente la url gracias a esto next me puede ayudar a crear paginas dinamicas

  const {
    query: { PaginaProducto },
  } = router;

  useEffect(() => {
    if (PaginaProducto && consultarDB) {
      const traerProductos = async () => {
        const productoQuery = await firebase.db
          .collection("productos")
          .doc(PaginaProducto);
        const producto = await productoQuery.get();

        if (producto.exists) {
          setProducto(producto.data());
          setConsultarDB(false);
          console.log("existe");
        } else {
          setError(true);
        }
      };
      traerProductos();
    }
  }, [PaginaProducto, consultarDB]);

  const {
    comentarios,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    creado,
    id,
    haVotado,
  } = producto;

  if (Object.keys(producto).length === 0 && !error) return <p>Cargando...</p>;

  const votar = () => {
    if (!usuario) {
      return router.push("/login");
    }
    const nuevoTotal = votos + 1;

    //verificar si el usuario actual ha votado

    if (haVotado.includes(usuario.uid)) {
      console.log("no voto");
      return;
    }

    //guardar el id del usuario que ha votado

    const nuevoHavotado = [...haVotado, usuario.uid];

    //actualizar BD
    firebase.db.collection("productos").doc(PaginaProducto).update({
      votos: nuevoTotal,
      haVotado: nuevoHavotado,
    });

    //actualizar en la base de datos y el state
    setProducto({
      ...producto,
      votos: nuevoTotal,
    });

    setConsultarDB(true); //consultar base de datos
  };

  const comentarioChange = (e) => {
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value,
      usuarioId: usuario.uid,
      usuarioNombre: usuario.displayName,
    });
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    //Tomar copias de comentarios

    const nuevosComentarios = [comentario, ...comentarios];

    console.log(nuevosComentarios);

    if (!comentario.usuarioId || !comentario.usuarioNombre) {
      console.log("entro");
      setEnviandoComentario(true);

      return;
    }

    setEnviandoComentario(false);

    //Actualizar la BD
    firebase.db.collection("productos").doc(PaginaProducto).update({
      comentarios: nuevosComentarios,
    });

    //actualizar el state
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    setConsultarDB(true);
  };

  const identificarComentarioAdmin = (id) => {
    if (creador.id == id) {
      return true;
    }
  };

  const verificarQueElcreador = (e) => {
    if (!usuario) {
      return false;
    }

    if (creador.id === usuario.uid) {
      return true;
    }
  };

  const eliminarProducto = async (e) => {
    if (!usuario) {
      return router.push("/login");
    }

    if (creador.id !== usuario.uid) {
      return router.push("/");
    }

    try {
      console.log(producto);

      await firebase.db.collection("productos").doc(PaginaProducto).delete();
      router.push("/");
    } catch (error) {
      console.log("hubo un error");
    }
  };

  return (
    <Layout>
      {error ? (
        <Error404 />
      ) : (
        <div className="contenedor">
          <TituloH1>{nombre}</TituloH1>
          <ContenedorProducto>
            <div>
              <p>
                Publicado hace:{" "}
                {formatDistanceToNow(new Date(creado), { locale: es })}
              </p>
              <p>
                Por: {creador.nombre} de {empresa}
              </p>
              <img src={urlimagen} />
              <p>{descripcion}</p>
              {usuario && (
                <>
                  <h2>Agrega tu comentario</h2>
                  <form onSubmit={agregarComentario}>
                    <CampoInputs>
                      <input
                        type="text"
                        name="mensaje"
                        placeholder="Escribir comentario"
                        onChange={comentarioChange}
                      />
                    </CampoInputs>
                    {enviandoComentario ? <Loading /> : null}
                    <InputSubmit type="submit" value="Agregar comentario" />
                  </form>
                </>
              )}
              <h2 className="h2-titulo">Comentarios</h2>
              {comentarios.length === 0 ? (
                <p>Aun no hay comentarios</p>
              ) : (
                <ul>
                  {comentarios.map((comentario, index) => (
                    <li
                      key={`${comentario.usuarioId}-${index}`}
                      className="li-comentario"
                    >
                      <p>{comentario.mensaje}</p>
                      <p>
                        Escrito por
                        <span className="span-escrito"></span>{" "}
                        {comentario.usuarioNombre}
                      </p>
                      {identificarComentarioAdmin(comentario.usuarioId) && (
                        <CreadorProducto>Es creador </CreadorProducto>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <aside>
              <Boton target="_blank" bgColor="true" href={url}>
                Visitar URl{" "}
              </Boton>

              <div className="votos-div">
                <p className="parrafo-voto">{votos} Votos</p>
                {usuario && <Boton onClick={votar}>Votar</Boton>}
              </div>
            </aside>
          </ContenedorProducto>
          {verificarQueElcreador() && (
            <Boton onClick={eliminarProducto}>Eliminar producto</Boton>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Producto;
