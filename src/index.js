import express, { request } from 'express';
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.status(200).send('<h1>Bem-vindo ao sistema de recados</h1>');
});

app.listen(8080, () => console.log('Servidor iniciado'));

//○ Identificador
//○ Nome
//○ E-mail
//○ Senha

//DADOS

const user = []
const recados = []

// CADASTRO

app.post('/create', (request,response) => {

    const dados = request.body

    const newUser = {
        id:new Date().getTime(),
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        logado:false
    }

    if(!dados.nome){
        return response.status(400).json("O campo nome é obrigatório!")
    }
    if (!dados.email){
        return response.status(400).json("O campo E-mail é obrigatório!")
    }
    if (!dados.senha){
        return response.status(400).json("O campo senha é obrigatório!")
    }
    if(dados.senha.length < 6){
        return response.status(400).json("A senha deve conter mais de 5 digitos.")
    }

    if (!dados.email || !dados.email.includes('@') || !dados.email.includes('.com')){
        return response.status(400).json({
            sucesso: false,
            dados: null,
            mensagem: 'Informe um e-mail válido para cadastro.'
        })
    }

    if (user.some((users) => users.email === dados.email)){
        return response.status(400).json({
            sucesso: false,
            mensagem: 'Usuario já cadastrado.'
        })
    }


    user.push(newUser)
    console.log(user)
    return response.status(201).json({
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso.',
        dado: newUser
    })
});

app.get('/listaRecados', (request, response) => {

    const id = parseInt(request.params.id)
    if (isNaN(id) || id <= 0) {
      return response.status(400).send('Informe um id que é válido');
    }
    response.status(200).json(recados);
});

//LOGIN

app.post('/login',(request, response) => {
    const data = request.body

    const usuario = user.some((user) => user.email === data.email)
    const senha = user.some((user) => user.senha === data.senha)

    if(!usuario || !senha){
        return response.status(400).json({
            sucesso: false,
            mensagem: 'Email ou senha incorreto.',
            dado: {}
        })
    }
    user.forEach(user => user.logado = false)

    const usuarioLogado = user.find((user) => user.email === data.email)

    usuarioLogado.logado = true

    return response.status(201).json({
        sucesso: true,
        mensagem: 'Logado com sucesso.',
        dado: {}
    })
});

//RECADOS ID

app.put('/recados/update/:id', (request, response) => {
    const atualizacao = request.params.id;
    const atualizacaoRecado = request.body

    const recadoNovo = recados.findIndex(recado => recado.id == atualizacao)
    if(recadoNovo < 0){
        return response.status(400).json('Recado não encontrado!')
    } else {
        recados.titulo = atualizacaoRecado.titulo
        recados.descricao = atualizacaoRecado.descricao
    }
    console.log(recados)
    return response.json('Recado atualizado com sucesso!')
});

//RECADOS 

app.post('/recados',(request, response) => {
    const dados = request.body

    const userLogado = user.find(user => user.logado === true)

    if(!userLogado){
        return response.status(400).json({
            sucesso: false,
            mensagem: "Precisa estar logado!",
            data:{}
        })
    }

    const recado = {
        id:new Date().getTime(),
        titulo: dados.titulo,
        descricao: dados.descricao,
        autor: user
    }

    recados.push(recado)
    console.log(recados)

    return response.json({
        sucesso: true,
        mensagem: "Recado inserido!",
        data:recado
    })

});

//DELETAR RECADOS

app.delete('/recados/delete/:id', (request, response) => {
    const idDelete = request.params.id;

    const recadoExiste = recados.findIndex(recado => recado.id == idDelete)

    if(recadoExiste < 0){
        return response.status(400).json('Recado não encontrado.')
    }

    recados.splice(recadoExiste, 1)

    console.log(recados)

    return response.json('Recado deletado com sucesso.')
});
