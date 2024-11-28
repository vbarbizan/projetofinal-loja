import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "../styles/home.css";
import impact from "../assets/images/genimpact.jpg"

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  const games = [
    {
      title: "EA SPORTS FC™ 25",
      description:
        "O EA SPORTS FC™ 25 oferece mais maneiras de ganhar pelo clube...",
      releaseDate: "",
      price: "R$ 299",
      imageUrl: "https://encurtador.com.br/fzogC",
    },
    {
      title: "Red Dead Redemption",
      description:
        "Pela primeira vez em seu célebre legado, jogue Red Dead Redemption no PC...",
      releaseDate: "29 de Outubro",
      price: "R$ 249,50",
      imageUrl: "https://encurtador.com.br/RdUYa",
    },
    {
      title: "Genshin Impact",
      description:
        "Embarque em uma jornada por Teyvat para encontrar o único parente...",
      releaseDate: "",
      price: "Gratuito",
      imageUrl: impact,
    },
    {
      title: "Until Dawn™",
      description:
        "Recriado e aprimorado para PC, Until Dawn convida você a reviver o pesadelo...",
      releaseDate: "Lançamento em breve",
      price: "R$ 299,90",
      imageUrl: "https://encurtador.com.br/NwJlp",
    },
    {
      title: "Off The Grid",
      description: "TEARDROP ISLAND DESPERATELY NEEDS A SAVIOR...",
      releaseDate: "Em breve",
      price: "Gratuito",
      imageUrl: "https://curt.link/VhRaS",
    },
  ];

  const [selectedGameIndex, setSelectedGameIndex] = useState(0);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao carregar os produtos", error);
      }
    };
    fetchProdutos();
  }, []);

  // Troca automática de jogos no carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedGameIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [games.length]);

  const handleGameClick = (game) => {
    navigate(`/jogo/${game.title}`);
  };

  const selectedGame = games[selectedGameIndex];

  return (
    <div className="body">
      <Header />
      <div className="carousel-container">
        {/* Seção principal */}
        <div
          className="carousel-highlight"
          style={{
            backgroundImage: `url(${selectedGame.imageUrl})`,
          }}
        >
          <div className="highlight-content">
            <h1>{selectedGame.title}</h1>
            <p className="release-date">{selectedGame.releaseDate}</p>
            <p className="description">{selectedGame.description}</p>
            <p className="price">{selectedGame.price}</p>
          </div>
        </div>

        {/* Barra lateral */}
        <div className="carousel-sidebar">
          {games.map((game, index) => (
            <div
              key={index}
              className={`sidebar-item ${selectedGameIndex === index ? "active" : ""}`}
              onClick={() => setSelectedGameIndex(index)}
            >
              <img src={game.imageUrl} alt={game.title} />
              <div className="sidebar-details">
                <p>{game.title}</p>
              </div>

              {/* Barra de progresso (temporizador) */}
              {selectedGameIndex === index && (
                <div className="progress-bar">
                  <div className="progress"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Seção "Descubra algo novo" */}
      <div className="container-imgs">
        <h2>Descubra algo novo</h2>
        <div className="cards-container">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="product-item"
              onClick={() => navigate(`/produto/${produto.id}`)}
            >
              <div className="product-image">
                <img
                  src={produto.imagens[0]}
                  alt={produto.nome}
                  className="product-thumbnail"
                />
              </div>
              <p className="product-nome">{produto.nome}</p>
              <p className="product-preço">{`R$ ${produto.preco.toFixed(2)}`}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
