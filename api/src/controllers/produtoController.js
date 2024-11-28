import {
  criarProduto,
  listarProdutos,
  obterProdutoPorId,
  atualizarProduto,
  deletarProduto,
} from "../services/produtoService.js";

// Controller para criar um novo produto com imagem
// Controller para criar um novo produto com imagem e visibilidade
export const criarProdutoController = async (req, res) => {
  const { nome, preco, estoque, descricao, visibilidade } = req.body;
  const imagens = req.files ? req.files.map((file) => file.path) : [];

  try {
    // Chama o serviço para criar o produto com o campo de visibilidade
    const produto = await criarProduto({
      nome,
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
      descricao,
      visibilidade: visibilidade !== undefined ? visibilidade : true, // Adiciona o campo de visibilidade com default true
      imagens,
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obterProdutos = async (req, res) => {
  try {
    // Se o usuário for administrador, ele pode ver todos os produtos
    const userRole = req.user?.role || "USER"; // Verifica o papel do usuário
    const produtos = await listarProdutos(userRole === "ADMIN");

    return res.json(produtos);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const obterProduto = async (req, res) => {
  const { produtoId } = req.params;
  const userRole = req.user?.role || "USER"; // Verifica o papel do usuário

  try {
    const produto = await obterProdutoPorId(
      parseInt(produtoId),
      userRole === "ADMIN"
    );

    if (!produto) {
      return res
        .status(404)
        .json({ error: "Produto não encontrado ou não visível" });
    }

    res.json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const editarProduto = async (req, res) => {
  const { produtoId } = req.params;
  const { nome, preco, estoque, descricao, visibilidade } = req.body;
  const imagens = req.files ? req.files.map((file) => file.path) : []; // Pega os arquivos de imagem enviados

  const dadosAtualizados = {
    nome,
    preco: parseFloat(preco),
    estoque: parseInt(estoque),
    descricao,
    visibilidade: visibilidade !== undefined ? visibilidade : true, // Adiciona a visibilidade à atualização
    imagens,
  };

  try {
    const produto = await atualizarProduto(
      parseInt(produtoId),
      dadosAtualizados
    );
    res.json(produto);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const removerProduto = async (req, res) => {
  const { produtoId } = req.params;

  try {
    await deletarProduto(parseInt(produtoId));
    res.status(204).send(); // Produto deletado com sucesso
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
