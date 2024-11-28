import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login(email, password);
      navigate("/"); // Redireciona após login bem-sucedido
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Erro desconhecido. Por favor, tente novamente.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">GAMELAND</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Entrar
          </button>
          <p className="forgot-password">Esqueceu a senha?</p>
        </form>
        <p className="cadastro">
          Não possui conta? <a href="/registro">Cadastrar</a>
        </p>
      </div>
    </div>
  );
}
