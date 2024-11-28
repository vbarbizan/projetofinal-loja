import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/vendas.css"; // Adicionando o CSS

export default function Vendas() {
  const { user } = useContext(AuthContext);  // Obtendo o usuário do contexto
  const [vendas, setVendas] = useState([]);   // Armazenando as vendas
  const [loading, setLoading] = useState(true);  // Estado de carregamento
  const [error, setError] = useState("");  // Estado de erro
  const navigate = useNavigate();  // Navegação, se necessário

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        if (!user?.token) {
          setError("Usuário não autenticado.");
          setLoading(false);
          return;
        }

        const response = await api.get("/vendas", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setVendas(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Erro ao carregar vendas.");
        setLoading(false);
      }
    };

    fetchVendas();
  }, [user?.token]);

  // Exibe uma mensagem de carregamento ou erro
  if (loading) return <p>Carregando vendas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
      <Header />

      <h2>Detalhes das vendas realizadas</h2>

      {/* Renderiza as vendas dinâmicas */}
      <div className="table">
        <div className="table-row header">
          <div className="table-cell">Nome do Cliente</div>
          <div className="table-cell">Data da venda</div>
          <div className="table-cell">Qtde. Produtos</div>
          <div className="table-cell">Valor Total</div>
        </div>
        {vendas.length > 0 ? (
          vendas.map((venda) => (
            <div key={venda.id} className="table-row">
              <div className="table-cell">{venda.user.nome}</div>
              <div className="table-cell">{new Date(venda.data).toLocaleDateString()}</div>
              <div className="table-cell">{venda.itens.length}</div>
              <div className="table-cell">
                R$ {venda.itens.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div className="table-row">
            <div className="table-cell" colSpan={5}>Nenhuma venda encontrada</div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
