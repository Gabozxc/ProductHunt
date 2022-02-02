import Layout from '../components/Layout/Layout'
import DetallesProducto from '../components/Layout/DetallesProducto'
import useProductos from '../hooks/useProductos.js'


const Home = () => {

 const {productos} = useProductos('creado')

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
 
export default Home;