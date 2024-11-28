import React, { useContext, useEffect, useState } from "react";
import '../styles/perfil.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

export default function Perfil() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    password: "",
    cpf: "",
    cep: "",
    cidade: "",
    bairro: "",
    logradouro: "",
    complemento: "",
    numero: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [historicoCompras, setHistoricoCompras] = useState([]);
  const { user, loading } = useContext(AuthContext);

  // Buscar dados do perfil
  useEffect(() => {
    if (!user || loading) return;

    const fetchPerfil = async () => {
      try {
        const responsePerfil = await api.get("/perfil");
        setFormData({
          nome: responsePerfil.data.nome,
          email: responsePerfil.data.email,
          telefone: responsePerfil.data.telefone,
          password: "",
          cpf: responsePerfil.data.cpf,
          cep: responsePerfil.data.endereco.cep,
          cidade: responsePerfil.data.endereco.cidade,
          bairro: responsePerfil.data.endereco.bairro,
          logradouro: responsePerfil.data.endereco.logradouro,
          complemento: responsePerfil.data.endereco.complemento,
          numero: responsePerfil.data.endereco.numero,
        });
      } catch (error) {
        setError(error.response?.data?.message || "Erro ao carregar os dados do perfil.");
      }
    };

    fetchPerfil();
  }, [user, loading]);

  // Buscar histórico de compras
  useEffect(() => {
    if (!user || loading || user.role === "ADMIN") return;

    const fetchHistoricoCompras = async () => {
      try {
        const responseHistorico = await api.get(`/pedidos?userId=${user.id}`);
        setHistoricoCompras(responseHistorico.data);
      } catch (error) {
        setError(error.response?.data?.message || "Erro ao carregar histórico de compras.");
      }
    };

    fetchHistoricoCompras();
  }, [user, loading]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await api.patch("/perfil/update", formData);
      setSuccessMessage("Perfil atualizado com sucesso!");
      setDisabled(true);
    } catch (error) {
      setError(error.response?.data?.message || "Erro desconhecido. Por favor, tente novamente.");
    }
  };

  const handleEdit = () => setDisabled(false);

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "100vh" }}>
      <Header />
      <div className="profile-container">
        <div className="centro-perfil">
          <div className="profile-picture">
            <div className="circle-perfil"></div>
          </div>
          <p className="username">{formData.nome || "Usuário"}</p>

          <div className="input-container-perfil">
            {["nome", "email", "telefone", "cpf", "logradouro"].map((field) => (
              <div className="input-box-perfil" key={field}>
                <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={disabled}
                />
                {!disabled && (
                  <button type="button" onClick={handleEdit} className="edit-button-perfil">
                    ✎
                  </button>
                )}
              </div>
            ))}
            {!disabled && <button type="submit" onClick={handleSave} className="save-button">Salvar</button>}
          </div>
        </div>

        {user?.role !== "ADMIN" && (
          <div className="history-container">
            <h1 className="history-title">Histórico de Compras</h1>
            <div className="history-list">
              {historicoCompras.length > 0 ? (
                historicoCompras.map((compra) => (
                  <div className="history-item" key={compra.id}>
                    <div className="product-details">
                      <p><strong>Data:</strong> {new Date(compra.data).toLocaleDateString()}</p>
                      <p><strong>Total:</strong> R$ {compra.total.toFixed(2)}</p>
                      <h3>Itens:</h3>
                      {compra.itens.map((item) => (
                        <div key={item.id}>
                          <p><strong>Produto:</strong> {item.produto.nome}</p>
                          <p><strong>Preço:</strong> R$ {item.preco.toFixed(2)}</p>
                          <p><strong>Quantidade:</strong> {item.quantidade}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'white' }}>Nenhum histórico de compras encontrado.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
