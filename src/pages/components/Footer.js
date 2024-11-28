import React from "react";
import "../../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <h3>GAMELAND</h3>
          <p>O melhor site para jogos e novidades do mundo gamer!</p>
        </div>
        <div className="footer-links">
          <h4>Links Úteis</h4>
          <ul>
            <li><a>Home</a></li>
            <li><a>Jogos</a></li>
            <li><a>Contato</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Nos Siga</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 GameLand. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
