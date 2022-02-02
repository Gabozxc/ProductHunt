import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import FileUploader from "react-firebase-file-uploader";
import styled from "@emotion/styled";
import { firebaseContext } from "../firebase";

import Layout from "../components/Layout/Layout";
import Loading from "../components/ui/Loading";
import {
  Formulario,
  CampoInputs,
  InputSubmit,
  ParrafoError,
} from "../components/ui/StylesComponent/Formulario";

import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../reglasValidacion/validarCrearProducto";

const TituloH1 = styled.h1`
  text-align: center;
  margin-top: 5rem;
`;

const NuevoProducto = () => {
  // states para controlar la subida de imagen
  const [nombreimagen, guardarNombre] = useState("");
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState("");

  //Mi estate inicial del formulario
  const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    url: "",
    descripcion: "",
  };

  const { state, errores, handleSubmit, handleChange, handleBlur } =
    useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  //object destructuring de mis valores del state que recibo del hook
  const { nombre, empresa, url, descripcion } = state;

  // hook de routing para redireccionar
  const router = useRouter();

  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(firebaseContext);

  // funciones de la libreria de react-firebase-files
  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
  };

  const handleProgress = (progreso) => guardarProgreso({ progreso });

  const handleUploadError = (error) => {
    guardarSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (nombre) => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre);
    firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        guardarUrlImagen(url);
      });
  };

  //funcion de crear producto
  async function crearProducto() {
    if (!usuario) {
      return router.push("/login");
    }

    // crear un  objeto que sera el producto, sus valores vienen del object destructuring que se hizo arriba del state que recibimos, el urlImagen viene de su propio state, no tienen valores pq su nombre son las variables
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName,
      },
      haVotado: [],
    };

    firebase.db.collection("productos").add(producto);
    return router.push("/");
  }

  if (typeof window !== "undefined") {
    if (!usuario) {
      router.push("/");
    }
  }

  return (
    <div>
      <Layout>
        <>
          <TituloH1>Nuevo Producto</TituloH1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Información General </legend>

              <CampoInputs>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Nombre del Producto"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </CampoInputs>

              {errores.nombre && <ParrafoError>{errores.nombre}</ParrafoError>}

              <CampoInputs>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  placeholder="Nombre Empresa o Compañia"
                  name="empresa"
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </CampoInputs>
              {errores.empresa && (
                <ParrafoError>{errores.empresa}</ParrafoError>
              )}

              <CampoInputs className="imagen-input">
                <label htmlFor="imagen">Imagen</label>
                <FileUploader
                  accept="image/*"
                  id="imagen"
                  name="imagen"
                  randomizeFilename
                  storageRef={firebase.storage.ref("productos")}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                  style={{display: 'none'}}
                />

                <input
                  type="button"
                  value="Buscar..."
                  style={{cursor: 'pointer'}}
                  onClick={() => document.getElementById('imagen').click()}
                />
              </CampoInputs>
              {subiendo ? <Loading /> : null}
              <CampoInputs>
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  placeholder="URL de tu producto"
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </CampoInputs>

              {errores.url && <ParrafoError>{errores.url}</ParrafoError>}
            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>

              <CampoInputs>
                <label htmlFor="descripcion">Descripcion</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </CampoInputs>

              {errores.descripcion && (
                <ParrafoError>{errores.descripcion}</ParrafoError>
              )}
            </fieldset>

            {subiendo ? (
              <InputSubmit value="Cargando imagen" disabled />
            ) : (
              <InputSubmit type="submit" value="Crear Producto" />
            )}
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default NuevoProducto;
