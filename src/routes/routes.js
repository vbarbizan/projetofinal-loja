import React from "react";
import { AuthContext } from "../contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Home from "../pages/Home";
import DetalhesProduto from "../pages/DetalhesProduto";
import Carrinho from "../pages/Carrinho";
import HistoricoCompras from "../pages/HistoricoCompras";
import Perfil from "../pages/Perfil";
import Produtos from "../pages/Produtos";
import Vendas from "../pages/Vendas";
import Usuarios from "../pages/Usuarios";
import DetalhesVenda from "../pages/DetalhesVendas";
import PrivateRoutes from "./PrivateRoutes";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        
        <Route element={<PrivateRoutes/>}>
        <Route path="/produto/:id" element={<DetalhesProduto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/historico-compras" element={<HistoricoCompras />} />
        <Route path="/perfil" element={<Perfil />} />
        </Route>



        <Route element={<AdminRoutes/>}>
        <Route path="/admin/produtos" element={<Produtos />} />
        <Route path="/admin/vendas" element={<Vendas />} />
        <Route path="/admin/vendas/:id" element={<DetalhesProduto/>} />
        <Route path="/admin/usuarios" element={<Usuarios />} />
        </Route>
      </Routes>
    </Router>
  );
}
