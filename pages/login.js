import React, { useState } from "react";

import Router from "next/router";

import useValidacion from "../hooks/useValidacion";

import validarIniciarSesion from "../reglasValidacion/validarIniciarSesion";

import firebase from "../firebase/firebase";
import Layout from "../components/Layout/Layout";
import {
  Formulario,
  CampoInputs,
  InputSubmit,
  ParrafoError,
} from "../components/ui/StylesComponent/Formulario";
import styled from "@emotion/styled";

const TituloH1 = styled.h1`
  text-align: center;
  margin-top: 5rem;
`;

const Login = () => {
  {
    const STATE_FORMULARIO = {
      email: "",
      password: "",
    };

    const [error, setError] = useState(false);

    const iniciarSesion = async () => {
      try {
        await firebase.login(email, password);
        Router.push("/");
      } catch (error) {
        setError(true);
      }
    };

    const { state, errores, handleChange, handleSubmit, handleBlur } =
      useValidacion(STATE_FORMULARIO, validarIniciarSesion, iniciarSesion);

    const { email, password } = state;

    return (
      <Layout>
        <TituloH1>Iniciar sesion</TituloH1>

        <Formulario onSubmit={handleSubmit}>
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
          <InputSubmit type="submit" value="Iniciar sesion" />
          {error && (
            <ParrafoError>Ha ocurrido un error al autenticar </ParrafoError>
          )}
        </Formulario>
      </Layout>
    );
  }
};

export default Login;
