import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/usuarios.css";
import Footer from './components/Footer';
import Header from './components/Header';


function TabelaUsuarios() {
  const { user } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/users");
        setUsuarios(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Erro desconhecido. Por favor, tente novamente.");
        }
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [user.token]);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmed) {
      try {
        await api.delete(`/users/${userId}`);
        setUsuarios((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.id !== userId)
        );
        alert("Usuário excluído com sucesso!");
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Erro desconhecido. Por favor, tente novamente.");
        }
      }
    }
  };

  const handleEdit = (userId) => {
    navigate(`/admin/usuarios/${userId}`);
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1, marginTop: 60, backgroundColor: "black" }}>
        <div className="container-usuarios">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textAlign: 'center' }}>GESTÃO DE USUÁRIOS</h1>


          <div className="table-container-usuarios">
            <table className='tabela-usuarios'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefone}</td>

                    <td>{usuario.cpf}</td>
                    <td>
                      <button onClick={() => handleDelete(usuario.id)} className="delete-button">DELETAR</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default TabelaUsuarios;
