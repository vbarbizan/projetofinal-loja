import express from "express";
import upload from "../middleware/multerConfig.js";

import {
  criarProdutoController,
  obterProdutos,
  obterProduto,
  editarProduto,
  removerProduto,
} from "../controllers/produtoController.js";

import {
  verificarToken,
  verificarAdmin,
  verificarTokenOpcional,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota pública para listar todos os produtos
router.get("/produtos", verificarTokenOpcional, obterProdutos);

// Rota pública para obter um produto específico por ID
router.get("/produtos/:produtoId", verificarTokenOpcional, obterProduto);

// Rota para cadastrar um novo produto (Admin Only)
router.post(
  "/produtos",
  upload.array("imagens", 10),
  verificarToken,
  verificarAdmin,
  criarProdutoController
);

router.put(
  "/produtos/:produtoId",
  upload.array("imagens", 4), // Adiciona o middleware de upload
  verificarToken,
  verificarAdmin,
  editarProduto
);

// Rota para remover um produto (Admin Only)
router.delete(
  "/produtos/:produtoId",
  verificarToken,
  verificarAdmin,
  removerProduto
);

export default router;
