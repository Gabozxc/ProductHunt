import React, {useState} from "react";
import styled from "@emotion/styled";
import Router from 'next/router'

const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;

const InputSumbit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url("/static/img/buscar.png");
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 1px;
  background-color: transparent;
  border: none;
  text-indent: -9999px;

  
  &:hover {
    cursor: pointer;
  }

 
`;

const Form = styled.form`
    position: relative;

`



const Buscador = () => {

  const [busqueda, setBuscador] = useState('')

  const buscarProducto = e => {

      e.preventDefault()

      if(busqueda.trim() === '') return 

      //se recomienda q de query para el enlace

    Router.push({
      pathname: '/buscar',
      query: {q: busqueda}
    })

  }

  return (
    <Form
      onSubmit={buscarProducto}
    >
      <InputText 
      type="text" 
      placeholder="Buscar productos" 
      onChange={e => setBuscador(e.target.value)}  
      />
      <InputSumbit type="submit">Buscar</InputSumbit>
    </Form>
  );
};

export default Buscador;
