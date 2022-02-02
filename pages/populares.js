import React from 'react';
import Layout from '../components/Layout/Layout'
import DetallesProducto from '../components/Layout/DetallesProducto'
import useProductos from '../hooks/useProductos'

const Populares = () => {

      const {productos} = useProductos('votos')

  return ( 
     
          <Layout>
            <div className="listado-productos">
                <div className="contenedor">
                  <div className="bg-white">
                    <ul>
                    {productos.map(producto => (
                          <DetallesProducto 
                              key={producto.id}
                              producto={producto}
                          />
                    ))}
                    </ul>
                  </div>
                </div>
            </div>
          </Layout>
     
   );
}
 
export default Populares;