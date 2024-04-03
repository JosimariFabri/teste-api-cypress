/// <reference types= "cypress"/>
import contrato from '../contratos/produtos.contratos'

describe('Teste de API - produtos', () => {

    let token
    beforeEach(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => {
            token = tkn
        })
    });

    it.only('Deve validar contrato de produtos com sucesso ', () => {
        cy.request('produtos').then(response =>{
            return contrato.validateAsync(response.body)
        })
    });

    it('Deve listar produtos com sucesso - GET', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).should((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
        })
        
    });

    /* EXEMPLO PARA ESTUDOS FUTUROS 
    it('Cadastrar produto - POST', () => {
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 1000000000)
        cy.request({
            method: 'POST',
            url: 'produtos',
            headers: {authorization: token},
            body: {
                "nome": produto,
                "preco": 15,
                "descricao": "Cabo USB do tipo C",
                "quantidade": 100
              }
        }).should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })*/

    it('Deve cadastrar produto com sucesso - POST', () => {
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 1000000000)
        cy.cadastrarProduto(token, produto, 10, 'Cabo UBS C', 100)
        .should((response) => {
            expect(response.status).equal(201)
            expect(response.body.message).equal('Cadastro realizado com sucesso')
        })    
        
    });

    it('Deve validar mensagem de produto cadastrado anteriormente', () => {
        cy.cadastrarProduto(token, 'Cabo USB 003', 10, 'Cabo UBS C', 10)
        .should((response) => {
            expect(response.status).equal(400)
            expect(response.body.message).equal('Já existe produto com esse nome')
        })
    });

    it('Deve editar um produto com sucesso', () => {
        let produto = 'Produto EBAC ' + Math.floor(Math.random() * 1000000000)
        cy.cadastrarProduto(token, produto, 10, 'Produto EBAC editado', 100)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'PUT', 
                    url: `produtos/${id}`,
                    headers: {authorization: token},
                    body: {
                        "nome": produto,
                        "preco": 500,
                        "descricao": "Produto editado",
                        "quantidade": 100
                      }
                }).should(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                    expect(response.status).to.equal(200)
                })
        })
        
    });

    it('Deve deletar um produto com sucesso', () => {
        cy.cadastrarProduto(token, 'Produto EBAC a ser deletado', 100, 'Delete', 50)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `produtos/${id}`,
                    headers: {authorization: token}
                }).should(resp => {
                    expect(resp.body.message).to.equal('Registro excluído com sucesso')
                    expect(resp.status).to.equal(200)
                })
            })
        
    });
    
});