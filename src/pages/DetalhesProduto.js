import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaShoppingCart } from "react-icons/fa"; // Ícones
import { AuthContext } from "../contexts/AuthContext"; // Para acessar o usuário logado
import "../styles/detalhesProduto.css"; // Importando o CSS

const DetalhesProduto = () => {
  const { id } = useParams(); // Recupera o ID do produto da URL
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Para capturar erros
  const { user } = useContext(AuthContext); // Acessa o usuário logado
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get(`/produtos/${id}`); // Busca o produto por ID
        setProduto(response.data); // Armazena o produto na state
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // Verifica se a API retornou uma mensagem de erro
        setError(
          error.response?.data?.message || "Erro desconhecido. Tente novamente."
        );
      }
    };

    fetchProduto(); // Chama a função para carregar o produto
  }, [id]);

  if (loading) {
    return <div>Carregando produto...</div>; // Exibe uma mensagem enquanto carrega
  }

  if (error) {
    return <div>{error}</div>; // Exibe o erro caso haja algum problema
  }

  if (!produto) {
    return <div>Produto não encontrado</div>; // Caso o produto não exista
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      return navigate("/login"); // Redireciona para o login caso não esteja logado
    }

    try {
      // Verificar se o produto já está no carrinho do usuário
      const response = await api.get("/carrinho", { params: { userId: user.id } });
      const carrinhoExistente = response.data["produtos-carrinho"] || [];

      // Verifica se o produto já está no carrinho
      const produtoExistente = carrinhoExistente.find(item => item.produtoId === produto.id);
      
      if (produtoExistente) {
        alert("Este produto já está no seu carrinho.");
        return; // Impede adicionar novamente se já existir no carrinho
      }

      // Adiciona o produto no carrinho
      await api.post("/carrinho", {
        userId: user.id, // ID do usuário logado
        produtoId: produto.id, // ID do produto
        quantidade: 1, // Quantidade do produto
      });
      alert("Produto adicionado ao carrinho com sucesso!");
      navigate("/carrinho"); // Redireciona para o carrinho
    } catch (error) {
      setError("Erro ao adicionar o produto ao carrinho.");
    }
  };

  return (
    <div className="detalhes-container">
      <button onClick={() => navigate(-1)} className="voltar-btn">
        Voltar
      </button>

      <div className="produto-detalhes">
      <h2>{produto.nome}</h2>
        <div className="imagem-container">
          <img src={produto.imagens[0]} alt={produto.nome} className="produto-imagem" />
          <p className="preco">R$ {produto.preco.toFixed(2)}</p>
        </div>

        <div className="produto-info">
          <p>{produto.descricao}</p>
          {user && user.role !== "ADMIN" && (
            <button
              onClick={handleAddToCart}
              className="adicionar-carrinho-btn"
            >
              <FaShoppingCart /> Adicionar ao Carrinho
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesProduto;
