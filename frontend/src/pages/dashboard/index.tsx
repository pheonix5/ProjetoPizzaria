import { useState } from "react";
import Head from "next/head";
import { FiRefreshCcw } from "react-icons/fi";

import { Header } from "../../components/Header";
import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from "./styles.module.scss";
import { setupAPICliente } from "../../services/api";
import { toast } from "react-toastify";

import { ModalOrder } from '../../components/ModalOrder'

import Modal from 'react-modal';

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
};

interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemProps ={
  id: string;
  amount: number;
  order_id: string;
  product_id: string
  product:{
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string
  }
  order:{
    id: string;
    table: string | number;
    status: boolean;
    neme: string | null;
  }
}

export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);

  const [modalItem, setModalItem] = useState<OrderItemProps[]>()
  const [modalVisible, setModalVisible] = useState(false);


  function handleCloseModal (){
    setModalVisible(false);
  }

	async function handleOpenModalView (id: string){
	   const apiCliente = setupAPICliente();

    const response = await apiCliente.get('/order/detail', {
      params:{
        order_id: id
      }
    })

    setModalItem(response.data);
    setModalVisible(true);
	}

  async function handleFinishItem(id: string){
    const apiCliente = setupAPICliente();

    await apiCliente.put('order/finish',{
      order_id: id
    })

    const response = await apiCliente('orders')

    setOrderList(response.data)
    setModalVisible(false)
  }
    
  async function handleRefreshOrders(){
    const apiCliente = setupAPICliente();

    const response = await apiCliente.get('/orders');
    setOrderList(response.data)
  }

  Modal.setAppElement('#__next')

  return (
    <>
      <Head>
        <title>Panel - Sujeito Pizzaria</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <div className={styles.containerHeader}>
            <h1>Últimos Pedidos</h1>
            <button onClick={handleRefreshOrders}>
              <FiRefreshCcw size={25} color="#3FFFA3" />
            </button>
          </div>

          <article className={styles.listOrders}>

            {orderList.length === 0 && (
              <span className={styles.emptyList}>
                Nenhum pedido aberto foi encontrado...
              </span>
            )}

						{orderList.map( item => (
							
							<section key={item.id} className={styles.orderItem}>
              <button onClick={() => handleOpenModalView(item.id)}>
                <div className={styles.tag}></div>
                <span>Mesa {item.table}</span>
              </button>
            </section>
						))}

          </article>
        </main>

        { modalVisible && (
          <ModalOrder
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            order={modalItem}
            handleFinishOrder={ handleFinishItem }
          />
        )}

      </div>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPICliente(ctx);

  const response = await apiClient.get("/orders");

  //console.log(response.data);

  return {
    props: {
      orders: response.data,
    },
  };
});
