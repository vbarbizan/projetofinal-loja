import prisma from "./prismaClient.js";

export const criarProduto = async (data) => {
  const { nome, preco, estoque, descricao, visibilidade, imagens } = data;

  return await prisma.produto.create({
    data: {
      nome,
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
      descricao,
      visibilidade: visibilidade !== undefined ? visibilidade : true, // Define a visibilidade do produto
      imagens: {
        create: imagens.map((imagem) => ({ url: imagem })), // Cria uma entrada para cada imagem
      },
    },
  });
};

export const listarProdutos = async (isAdmin = false) => {
  const produtos = await prisma.produto.findMany({
    where: isAdmin ? {} : { visibilidade: true }, // Filtra apenas produtos visíveis para usuários comuns
    include: { imagens: true },
  });

  // Formata a URL das imagens
  const produtosFormatados = produtos.map((produto) => {
    const imagensFormatadas = produto.imagens.map((imagem) => {
      return `${process.env.BASE_URL}/${imagem.url.replace(/\\/g, "/")}`;
    });

    return {
      ...produto,
      imagens: imagensFormatadas,
    };
  });

  return produtosFormatados;
};

export const obterProdutoPorId = async (produtoId, isAdmin = false) => {
  const produto = await prisma.produto.findUnique({
    where: { id: produtoId },
    include: { imagens: true },
  });

  // Verifica se o produto é visível para usuários comuns
  if (!produto || (!isAdmin && produto.visibilidade === false)) {
    return null; // Retorna null se o produto não for encontrado ou não for visível para o usuário comum
  }

  // Formata a URL das imagens
  const imagensFormatadas = produto.imagens.map((imagem) => {
    return `${process.env.BASE_URL}/${imagem.url.replace(/\\/g, "/")}`;
  });

  return {
    ...produto,
    imagens: imagensFormatadas,
  };
};

export const atualizarProduto = async (produtoId, data) => {
  const { nome, preco, estoque, descricao, visibilidade, imagens } = data;

  const visibilidadeBoolean = visibilidade === "true"; // Converte para booleano

  let updateData = {
    nome,
    preco: parseFloat(preco),
    estoque: parseInt(estoque),
    descricao,
    visibilidade: visibilidadeBoolean, // Usa o valor booleano correto
  };

  if (imagens && imagens.length > 0) {
    updateData.imagens = {
      deleteMany: {},
      create: imagens.map((imagem) => ({ url: imagem })),
    };
  }

  return await prisma.produto.update({
    where: { id: produtoId },
    data: updateData,
    include: {
      imagens: true,
    },
  });
};

export const deletarProduto = async (produtoId) => {
  // Verifica se o produto existe
  const produtoExistente = await prisma.produto.findUnique({
    where: { id: produtoId },
    include: {
      pedidoItens: true, // Inclui itens de pedidos relacionados
      carrinho: true, // Inclui itens no carrinho relacionados
      imagens: true, // Inclui imagens relacionadas
    },
  });

  if (!produtoExistente) {
    throw new Error("Produto não encontrado.");
  }

  // Se o produto já foi vendido (pedidoItens existe), não podemos deletar o histórico de vendas
  if (produtoExistente.pedidoItens.length > 0) {
    throw new Error(
      "Não é possível excluir o produto, pois ele já foi vendido."
    );
  }

  try {
    // Exclui os itens do carrinho relacionados ao produto, se houver
    if (produtoExistente.carrinho.length > 0) {
      await prisma.carrinho.deleteMany({
        where: { produtoId: produtoId },
      });
    }

    // Exclui as imagens relacionadas ao produto, se houver
    if (produtoExistente.imagens.length > 0) {
      await prisma.imagemProduto.deleteMany({
        where: { produtoId: produtoId },
      });
    }

    // Agora, finalmente, exclui o produto
    return await prisma.produto.delete({
      where: { id: produtoId },
    });
  } catch (error) {
    throw new Error(`Erro ao deletar o produto: ${error.message}`);
  }
};
