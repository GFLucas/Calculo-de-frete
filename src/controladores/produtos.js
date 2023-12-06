const produtos = require('../bancodedados/produtos');
const { getStateFromZipcode } = require('utils-playground');

const buscarProdutos = async (req, res) => {
    try {
        return res.status(200).json(produtos)
    }
    catch (erro) {
        return res.json(`Deu erro: ${erro.mensage}`)
    }
};

const detalharProduto = async (req, res) => {
    const { idProduto } = req.params;

    try {

        const produto = produtos.find(produto => produto.id === Number(idProduto)
        );

        if (!produto) {
            res.status(404).json({ MENSAGEM: 'Produto não encontrado!!' })
        };

        return res.json(produto)
    }
    catch (erro) {
        return res.json(`Deu erro: ${erro.mensage}`)
    }
};

const calcularFrete = async (req, res) => {
    const { idProduto, cep } = req.params;

    try{

    const produto = produtos.find(produto => produto.id === Number(idProduto)
    );

    if (!produto) {
        res.status(404).json({ MENSAGEM: 'Produto não encontrado!!' })
    };

    const estado = await getStateFromZipcode(cep);

    let valorFrete = 0;

    if (estado === 'SP' || estado === 'RJ') {
        valorFrete = produto.valor * 0.15;

        return res.json({
            produto: produto,
            estado: estado,
            frete: valorFrete
        })
    };

    if (estado === 'BA' || estado === 'SE' || estado === 'AL' || estado === 'PE' || estado === 'PB') {
        valorFrete = produto.valor * 0.10;

        return res.json({
            produto: produto,
            estado: estado,
            frete: valorFrete
        })
    }

    else {
        valorFrete = produto.valor * 0.12;

        return res.json({
            produto: produto,
            estado: estado,
            frete: valorFrete
        })

    }
    return res.json(estado)
}
catch (erro) {
    return res.json(`Deu erro: ${erro.mensage}`)
} 
}

module.exports = {
    buscarProdutos,
    detalharProduto,
    calcularFrete
}