import formaDePagamento from "./resources/formaDePagamento.js"
import cardapio from "./resources/cardapio.js"

class CaixaDaLanchonete {
    calcularValorDaCompra(metodoDePagamento, itens) {

        if (itens.length === 0) {
            return "Não há itens no carrinho de compra!";
        }

        if (!Object.keys(formaDePagamento).includes(metodoDePagamento)) {
            return "Forma de pagamento inválida!";
        }

        let totalCompra = 0;
        let itensPrincipais = {};
        let itensExtras = {};
        let quantidadeItens = 0

        for (const itemInfo of itens) {
            const [codigo, quantidade] = itemInfo.split(",");

            if (!cardapio[codigo]) {
                return "Item inválido!";
            }

            if (quantidade == "0") {
                continue;
            }

            const itemDescricao = cardapio[codigo].descricao;

            if (itemDescricao.includes("extra")) {
                itensExtras[codigo] = cardapio[codigo];
            } else {
                itensPrincipais[codigo] = cardapio[codigo];
            }
            totalCompra += cardapio[codigo].valor * parseInt(quantidade);
            quantidadeItens += parseInt(quantidade)
        }

        if (quantidadeItens === 0) {
            return "Quantidade inválida!";
        }

        function buscaItemPrincipalDoItemSecundario(descricao) {
            return descricao.split(" (extra do ")[1].split(")")[0];
        }

        function verificaItemPrincipal(itensPrincipais, itemPrincipal) {
            return Object.values(itensPrincipais).some(item => item.descricao.includes(itemPrincipal));
        }

        for (const itemExtra of Object.values(itensExtras)) {
            const itemPrincipal = buscaItemPrincipalDoItemSecundario(itemExtra.descricao);
            if (!verificaItemPrincipal(itensPrincipais, itemPrincipal)) {
                return "Item extra não pode ser pedido sem o principal";
            }
        }

        if (metodoDePagamento === "dinheiro") {
            totalCompra *= formaDePagamento.dinheiro;
        } else if (metodoDePagamento === "credito") {
            totalCompra *= formaDePagamento.credito;
        }

        return `R$ ${totalCompra.toFixed(2).replace('.', ',')}`;
    }
}

export { CaixaDaLanchonete };
