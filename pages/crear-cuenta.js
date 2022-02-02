import React, { useState } from "react";

/// styles components

import Layout from "../components/Layout/Layout";
import {
  Formulario,
  CampoInputs,
  InputSubmit,
  ParrafoError,
} from "../components/ui/StylesComponent/Formulario";
import styled from "@emotion/styled";
import Router from "next/router";

import useValidacion from "../hooks/useValidacion";

import validarCrearCuenta from "../reglasValidacion/validarCrearCuenta";

import firebase from "../firebase/firebase";

const Titulo = styled.h1`
  text-align: center;
  margin-top: 5rem;
`;

const CrearCuenta = () => {
  const STATE_FORMULARIO = {
    nombre: "",
    email: "",
    password: "",
  };

  const [error, setError] = useState(false);

  const crearCuenta = async () => {
    try {
      await firebase.registrar(nombre, email, password);
      setError(false);
      Router.push("/");
    } catch (error) {
      setError(true);
    }
  };

  const { state, errores, handleChange, handleSubmit, handleBlur } =
    useValidacion(STATE_FORMULARIO, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = state;

  return (
    <Layout>
      <Titulo>Crear cuenta</Titulo>

      <Formulario onSubmit={handleSubmit}>
        <CampoInputs>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            placeholder="Tu nombre"
            name="nombre"
            value={nombre}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </CampoInputs>

        {errores.nombre && <ParrafoError> {errores.nombre}</ParrafoError>}

        <CampoInputs>
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            placeholder="Tu correo"
            name="email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </CampoInputs>
        {errores.email && <ParrafoError> {errores.email}</ParrafoError>}

        <CampoInputs>
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            placeholder="Tu Password"
            name="password"
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </CampoInputs>
        {errores.password && <ParrafoError> {errores.password}</ParrafoError>}
        <InputSubmit type="submit" value="Crear cuenta" />
        {error && (
          <ParrafoError>Un cuenta ya esta usando este correo </ParrafoError>
        )}
      </Formulario>
    </Layout>
  );
};

export default CrearCuenta;
