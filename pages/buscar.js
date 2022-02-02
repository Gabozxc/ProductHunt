import React, {useState, useEffect} from 'react'
import Layout from '../components/Layout/Layout'
import {useRouter} from "next/router"
import DetallesProducto from '../components/Layout/DetallesProducto'
import useProductos from '../hooks/useProductos'

const Buscar = () => {

      const router = useRouter();
      const {query: {q}} = router

      //todos los productos
      const {productos} = useProductos('creado')

      const [resultado, setResultado] = useState('')

      useEffect(() => {

            if(q){
                  const busqueda = q.toLowerCase()
                  const filtro = productos.filter(producto => {

      
                        return (
                              producto.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(busqueda) ||
                              producto.descripcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(busqueda)
              
                        )
                  })

                  setResultado(filtro)


            }


      }, [q, productos])
      


      return (
    
            <Layout>
            <div className="listado-productos">
                <div className="contenedor">
                  <div className="bg-white">
                    <ul>
                    {resultado ? resultado.map(producto => (
                          <DetallesProducto 
                              key={producto.id}
                              producto={producto}
                          />
                    )) : null}
                    </ul>
                  </div>
                </div>
            </div>
          </Layout>  
      );
}
 
export default Buscar;