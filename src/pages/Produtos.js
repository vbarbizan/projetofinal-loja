import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";  // Importe sua API (ajuste o caminho conforme necessário)
import Header from "./components/Header";
import Footer from "./components/Footer";
import '../styles/adicionarProduto.css';  // Adicione o CSS conforme necessário

export default function AdicionarProduto() {
  const [nome, setNome] = useState("");  // Nome do produto
  const [descricao, setDescricao] = useState("");  // Descrição do produto
  const [preco, setPreco] = useState("");  // Preço do produto
  const [estoque, setEstoque] = useState("");  // Quantidade em estoque
  const [imagens, setImagens] = useState([]);  // Imagens do produto
  const [error, setError] = useState("");  // Mensagens de erro
  const [successMessage, setSuccessMessage] = useState("");  // Mensagens de sucesso
  const navigate = useNavigate();  // Para redirecionar após sucesso

  const handleAddProduto = async (e) => {
    e.preventDefault();  // Evitar o comportamento padrão do formulário

    // Criando o objeto FormData para envio do formulário
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("preco", Number(preco));  // Convertendo para número
    formData.append("estoque", Number(estoque));  // Convertendo para número

    // Adicionando as imagens ao FormData
    Array.from(imagens).forEach((imagem) => {
      formData.append("imagens", imagem);
    });

    try {
      // Enviando os dados para o servidor (ajuste o endpoint conforme necessário)
      await api.post("/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Produto adicionado com sucesso!");
      navigate("/");  // Redireciona para a página inicial após sucesso
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);  // Mensagem de erro vinda do servidor
      } else {
        setError("Erro desconhecido. Por favor, tente novamente.");
      }
    }
  };

  const handleImageChange = (e) => {
    setImagens(e.target.files);  // Atualiza o estado das imagens
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}>
      <Header />
      <div className="centro-adicionar">
        <div className="add-product-container">
          <h1 className="title">Adicionar Novo Produto</h1>
          {error && <p className="error-message">{error}</p>}  {/* Exibe mensagem de erro */}
          {successMessage && <p className="success-message">{successMessage}</p>}  {/* Exibe mensagem de sucesso */}

          <form className="add-product-form" onSubmit={handleAddProduto}>
            <div className="form-top-section">
              <div className="coluna-escrita">
                {/* Campo Nome */}
                <div className="form-group">
                  <label htmlFor="productName">Nome do Produto</label>
                  <input
                    type="text"
                    id="productName"
                    className="form-control"
                    placeholder="Nome do Produto"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}  // Atualiza o estado de nome
                    required
                  />
                </div>

                {/* Campo Preço */}
                <div className="form-group">
                  <label htmlFor="productPrice">Preço</label>
                  <input
                    type="text"
                    id="productPrice"
                    className="form-control"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}  // Atualiza o estado de preço
                    required
                  />
                </div>

                {/* Campo Estoque */}
                <div className="form-group">
                  <label htmlFor="productStock">Estoque</label>
                  <input
                    type="number"
                    id="productStock"
                    className="form-control"
                    placeholder="Estoque"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}  // Atualiza o estado de estoque
                    required
                  />
                </div>
              </div>

              {/* Campo Imagens */}
              <div className="tamanho-adicionar">
                <label>Imagens:</label>
                <div className="image-upload-box">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}  // Atualiza o estado das imagens
                  />
                </div>
              </div>
            </div>

            {/* Campo Detalhes */}
            <div className="form-group">
              <label htmlFor="productDetails">Detalhes do Produto</label>
              <textarea
                id="productDetails"
                className="form-control"
                placeholder="Digite os detalhes do produto"
                rows="5"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}  // Atualiza o estado de descrição
                required
              ></textarea>
            </div>

            {/* Botão Adicionar */}
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Adicionar Produto
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
