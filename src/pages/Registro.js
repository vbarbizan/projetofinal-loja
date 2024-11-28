import React, { useState, useContext } from "react";
import api from "../services/api";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Registro() {
  // Definindo o estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    password: "",
    cpf: "",
    cep: "",
    cidade: "",
    bairro: "",
    logradouro: "", // Deve corresponder ao nome do campo no estado
    complemento: "",
    numero: "",
  });

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Função para alternar a visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Função para manipular o envio do formulário de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Prepare os dados com o campo 'role'
    const registrationData = {
      ...formData,
      role: "USER", // Adicionando o campo role com valor USER
    };

    // Exibe os dados que serão enviados no console
    console.log("Dados a serem enviados:", registrationData);

    try {
      await api.post("/auth/registro", registrationData); // Envia os dados para a API
      alert("Cadastro realizado com sucesso!");
      navigate("/login"); // Redireciona para a página de login após sucesso
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Erro desconhecido. Por favor, tente novamente.");
      }
    }
  };

  // Função para alterar os dados do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <p className="login-title">GAMELAND</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            className="login-input"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="login-input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Senha"
              className="login-input"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-toggle"
              tabIndex={-1} // Impede que o botão seja focado pelo teclado
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            className="login-input"
            value={formData.telefone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            className="login-input"
            value={formData.cpf}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            className="login-input"
            value={formData.cep}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            className="login-input"
            value={formData.cidade}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="bairro"
            placeholder="Bairro"
            className="login-input"
            value={formData.bairro}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="logradouro"
            placeholder="Endereço Completo"
            className="login-input"
            value={formData.logradouro}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="numero"
            placeholder="Número"
            className="login-input"
            value={formData.numero}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="complemento"
            placeholder="Complemento"
            className="login-input"
            value={formData.complemento}
            onChange={handleInputChange}
          />
          <button type="submit" className="login-button">
            Cadastrar
          </button>
        </form>
        <p className="button-possui">
          Já possui conta? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
