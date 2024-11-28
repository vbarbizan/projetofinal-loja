import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/home.css";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redireciona para a página de login após logout
  };

  return (
    <header className="header">
      <div className="content">
        <a className="logo" href="/">
          <p style={{color:'white'}}>GAMELAND</p>
        </a>
        <nav>
          <ul>
            {/* Exibe "Meu Perfil" apenas quando o usuário estiver logado */}
            {user && (
              <li>
                <Link to="/perfil">Meu Perfil</Link>
              </li>
            )}

            {/* Exibe "Carrinho" apenas para usuários normais */}
            {user && user.role === "USER" && (
              <li>
                <Link to="/carrinho">Carrinho</Link>
              </li>
            )}

            {/* Exibe links específicos para Admin */}
            {user && user.role === "ADMIN" && (
              <>
                <li>
                  <Link to="/admin/usuarios">Gerenciar Usuários</Link>
                </li>
                <li>
                  <Link to="/admin/vendas">Vendas</Link>
                </li>
                <li>
                  <Link to="/admin/produtos">Adicionar Produto</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="auth-buttons">
        {user ? (
          <button className="btn-login" onClick={handleLogout}>
            Sair
          </button>
        ) : (
          <button className="btn-login">
            <Link to="/login" style={{ color: "white" }}>
              Entrar
            </Link>
          </button>
        )}
      </div>
    </header>
  );
}
