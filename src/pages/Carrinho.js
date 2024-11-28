import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import '../styles/carrinho.css';

function App() {
  const { user, loading: authLoading } = useContext(AuthContext); // Pega o usuário logado e o estado de loading
  const [carrinho, setCarrinho] = useState([]); // Estado inicial do carrinho
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Loading para a requisição
  const [metodoPagamento, setMetodoPagamento] = useState(); // Método de pagamento
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está carregado para fazer a requisição
    if (!user || authLoading) {
      return;
    }

    const fetchCarrinho = async () => {
      try {
        const response = await api.get('/carrinho', {
          params: { userId: user.id }, // Passa o userId para identificar o carrinho
        });

        // Verifica a resposta da API
        console.log(response.data);

        setCarrinho(response.data['produtos-carrinho'] || []); // Atualiza o carrinho
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        setError('Erro ao carregar carrinho. Tente novamente.');
        setLoading(false);
      }
    };

    fetchCarrinho(); // Carrega o carrinho assim que o usuário está disponível
  }, [user, authLoading]);

  // Função para atualizar a quantidade no carrinho
  const handleQuantidadeChange = async (produtoId, quantidade) => {
    setCarrinho((prevCarrinho) =>
      prevCarrinho.map((item) =>
        item.produtoId === produtoId
          ? { ...item, quantidade: Number(quantidade) } // Atualiza a quantidade
          : item
      )
    );

    try {
      // Atualiza a quantidade no servidor
      await api.put('/carrinho', { produtoId, quantidade: Number(quantidade) }, {
        params: { userId: user.id },
      });
    } catch (error) {
      setError('Erro ao atualizar quantidade. Tente novamente.');
    }
  };

  // Função para deletar um item do carrinho
  const handleDeletarItem = async (produtoId) => {
    try {
      await api.delete(`/carrinho/${produtoId}`, {
        params: { userId: user.id }, // Identifica o carrinho do usuário
      });
      // Atualiza o carrinho após deletar o item
      setCarrinho((prevCarrinho) =>
        prevCarrinho.filter((item) => item.produtoId !== produtoId)
      );
    } catch (error) {
      setError('Erro ao remover item. Tente novamente.');
    }
  };

  // Função para criar o pedido
  const handleCriarPedido = async () => {
    if (!metodoPagamento) {
      setError('Por favor, selecione um método de pagamento.');
      return; // Se não houver método de pagamento, não cria o pedido
    }

    try {
      await api.post('/pedidos', { metodoPagamento });
      alert('Pedido realizado com sucesso!');
      setCarrinho([]); // Limpa o carrinho após o pedido
      navigate('/'); // Redireciona para a página inicial
    } catch (error) {
      setError('Erro ao criar pedido. Tente novamente.');
    }
  };

  if (authLoading || loading) {
    return <p>Carregando carrinho...</p>; // Exibe mensagem de carregamento
  }

  if (error) {
    return <p>{error}</p>; // Exibe mensagem de erro, se houver
  }

  console.log('carrinho', carrinho);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "100vh" }}>
        <Header />

        <main className="main-content">
          <h1>Meu Carrinho</h1>
          <div className='container-carrinho'>
            {carrinho.length === 0 ? (
              <p>Seu carrinho está vazio.</p>
            ) : (
              <div className='container-car'>
                <div className='container-produtos'>
                  {carrinho.map((item) => (
                    <div className="product-card" key={item.produtoId}>
                      <img
                        src={
                          item.produto.imagens[0] // Primeira imagem disponível
                        }
                        alt={item.produto.nome || "Produto sem nome"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-image.jpg"; // Imagem padrão
                        }}
                      />
                      <div className="product-info">
                        <h2>{item.produto.nome}</h2>
                        <p className="price">
                          R$ {item.produto.preco.toFixed(2)}
                        </p>

                        <button
                          className="remove-button"
                          onClick={() => handleDeletarItem(item.produtoId)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="payment-summary">
                  <p>
                    Subtotal: R${" "}
                    {carrinho
                      .reduce(
                        (total, item) => total + item.produto.preco * item.quantidade,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <label>
                    Método de Pagamento:
                    <select
                      value={metodoPagamento}
                      onChange={(e) => setMetodoPagamento(e.target.value)}
                    >
                      <option disabled value="">
                        Selecione
                      </option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Boleto">Boleto</option>
                      <option value="Pix">Pix</option>
                    </select>
                  </label>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <button
                    className="finalize-button"
                    onClick={handleCriarPedido}
                    disabled={!metodoPagamento}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
