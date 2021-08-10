'use strict'

const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element)

const getCliente = async ( url ) => fetch ( url ).then ( res => res.json() );

const createPreco = async(preco) =>{
  const url = 'http://api.fastparking.com.br/precos';
  const options = {
    method: 'POST',
    body: JSON.stringify(preco)
  }
  await fetch(url, options);
}

const createClient = async(newClient) =>{
  const url = 'http://api.fastparking.com.br/clientes';
  const options = {
    method: 'POST',
    body: JSON.stringify(newClient)
  }
  await fetch(url, options);
}

const deleteClient = async(idClient) =>{
  const url = `http://api.fastparking.com.br/clientes/${idClient}`;
  const options = {
    method: 'DELETE',
    body: JSON.stringify(idClient)
  }
  await fetch(url, options);
  updateTable();
}

const updateClint = async(idClient) =>{
  const url = `http://api.fastparking.com.br/clientes/${idClient.id}`;
  const options = {
    method: 'PUT',
    body: JSON.stringify(idClient)
  }
  await fetch(url, options);
}

const editClient = async(idClient) =>{
  const url = `http://api.fastparking.com.br/clientes/${idClient}`;
  const client = await getCliente(url);
  $('#nome').value = client.nome;
  $('#placa').value = client.placa;
  document.getElementById('nome').dataset.idcontact = client.id
  document.getElementById('primeiraHora').disabled = true;
  document.getElementById('segundaHora').disabled = true;
}

function animacaoTblComprovante(){
  const sessaoPrecos = $('.sessaoComprovante');
  sessaoPrecos.style.animation = 'back-go 1s';
}

const openModalSaida = () => $('.comprovanteSaida').classList.add('active')

const closeModalSaida = () => $('.comprovanteSaida').classList.remove('active')

const criarComprovante = (cliente) =>{
  animacaoTblComprovante();
  const sessaoComprovante = $('.sessaoComprovante').classList.remove('opacity'); 
  const sessaoPrecos = $('#dados');
  sessaoPrecos.innerHTML = `
    <h3>Comprovante de entrada</h3>
    <hr>
    <label for="nome">Nome: ${cliente.nome}</label>
    <label for="placa">Placa: ${cliente.placa}</label>
    <label for="data">Data: ${cliente.dataEstacionado}</label>
    <label for="hora">Hora: ${cliente.hora}</label>
    <div id="acaoImpressao">
      <button type='button'>Imprimir</button>
      <button id="buttonCancelar">Cancelar</button>
    </div>
  `;
}

const data = () =>{
  let data = new Date();
  let dia = data.getDate();
  let mes = data.getMonth()+1;
  let ano = data.getFullYear();

  if(dia.toString().length == 1) dia = '0'+dia;
  if(mes.toString().length == 1) mes = '0'+mes;

  return `${dia}/${mes}/${ano}`
  
}

const horaSaida = () =>{
  let hora = new Date().getHours();
  let minutos = new Date().getMinutes();
  return hora + ":" + minutos;
}

const criarComprovanteSaida = (cliente) =>{
  const sessaoComprovanteSaida = $('.sessaoComprovanteSaida').innerHTML = ` 
    <h3>Comprovante de saída</h3>
    <hr>
    <label for="nome">Nome: ${cliente.nome}</label>
    <label for="placa">Placa: ${cliente.placa}</label>
    <label for="data">Data da saída: ${data()}</label>
    <label for="hora">Hora saída: ${horaSaida()}</label>
    <label>Valor a pagar: R$${cliente.primeiraHora} </label>
    <div id="acaoImpressao">
      <button type='button'>Imprimir</button>
      <button id="buttonCancelar">Cancelar</button>
    </div>`
}

const acoesBotoesModalSaida = (event) =>{
  const botao = event.target.type;
  if(botao == 'button'){
    window.print();
  }else if(botao == 'submit'){
    closeModalSaida();
  }
}

const fecharComprovanteEntrada = () =>{
  const comprovante = $('.comprovante').classList.add('none')
}

const abrirComprovanteEntrada = () =>{
  const comprovante = $('.comprovante').classList.remove('none')
}

const acaoBotaoImprimir = (event) =>{
  const botao = event.target.type
  if(botao == 'button'){
    window.print();
  }else if(botao == 'submit'){
    const sessaoComprovante = $('.sessaoComprovante').classList.add('opacity'); 
    fecharComprovanteEntrada();
  }
}

const acoesBotoes = async(click) =>{
  const botao = click.target;
  const id = click.path[2].cells[0].firstChild.data;
  
  if(botao.type == 'button' && botao.innerHTML == "Editar"){
    fecharTabelaPrecos();
    fecharComprovanteEntrada();
    await editClient(id);
  }else if(botao.type == 'button' && botao.innerHTML == "Comp."){
    const url = `http://api.fastparking.com.br/clientes/${id}`;
    const client = await getCliente(url);
    criarComprovante(client);
    abrirComprovanteEntrada();
  }else if(botao.type == 'submit'){
    const url = `http://api.fastparking.com.br/clientes/${id}`;
    const client = await getCliente(url);
    if(confirm("Deseja mesmo sair?")){  
      openModalSaida();
      criarComprovanteSaida(client);
      fecharComprovanteEntrada();
      await deleteClient(id);
    } 
  }
}

function animacoes(){
  const sessaoPrecos = $('.sessaoPrecos');
  sessaoPrecos.style.animation = 'go-back 1s';
}

const criarTabelaPrecos = () =>{
  const sessaoTabelaPrecos = $('.precos').classList.remove('none') 
  animacoes();
}

const fecharTabelaPrecos = () =>{
  const sessaoTabelaPrecos = $('.precos').classList.add('none') 
}

const limparInputs = () =>{
  const inputs1 = Array.from($$('.inputs input'));
  const inputs2 = Array.from($$('.precos input'));
  inputs1.forEach(input => input.value = '');
  inputs2.forEach(input => input.value = '');
  document.getElementById('nome').dataset.idcontact = 'new';
  document.getElementById('primeiraHora').disabled = false;
  document.getElementById('segundaHora').disabled = false;
} 

const criarNovaLinha = (cliente, indice) => {
  const linhaClienteCadastrado = document.createElement('tr')
    const tbody = $('#cadastros #tbody')
    linhaClienteCadastrado.innerHTML = `
      <td>${cliente.id}</td>    
      <td>${cliente.nome}</td>
      <td>${cliente.placa}</td>
      <td>${cliente.dataEstacionado}</td>
      <td>${cliente.hora}</td>
      <td>
        <button type='button' id="telaComprovante" data-acao="comprovante-${indice}">Comp.</button>
        <button type='button' data-acao="editar-${indice}">Editar</button>
        <button>Saída</button>
      </td>
    `
    tbody.appendChild(linhaClienteCadastrado);
}

const limparTela = () =>{
  const tbody = document.getElementById('tbody')
  while(tbody.firstChild){
    tbody.removeChild(tbody.lastChild);
  }
}

const updateTable = async () => {
  limparTela();
  const url = "http://api.fastparking.com.br/clientesPreco";
  const clientes = await getCliente(url);
  clientes.forEach(criarNovaLinha)
}

const mascaraPlaca = (evento) => {
  var cleave = new Cleave('#placa', {
    delimiter: '-',
    blocks: [3, 4],
    uppercase: true
});
}

const validarCampos = () => {
  if($('#placa').reportValidity() && $('#nome').reportValidity()){
    return true;
  }
}

const adicionarCliente = async() => {
  const idContact = document.getElementById('nome').dataset.idcontact
  if(idContact == 'new'){
    if($('#primeiraHora').value == '' && $('#segundaHora').value == ''){
      alert('Preencha os campos de preços');
    }else{
      if(validarCampos()){
        const dadosPreco = {
          "primeiraHora": $('#primeiraHora').value,
          "segundaHora": $('#segundaHora').value
        }

        const dadosCliente = {
          "nome": $('#nome').value,
          "placa": $('#placa').value,
          "primeiraHora": $('#primeiraHora').value,
          "segundaHora": $('#segundaHora').value
        }
        await createPreco(dadosPreco);
        await createClient(dadosCliente);
        updateTable();
        limparInputs();
      }
    }
  }else{
    const dadosClienteUp = {
      "nome": $('#nome').value,
      "placa": $('#placa').value
    }
    dadosClienteUp.id = idContact
    console.log(dadosClienteUp)
    await updateClint(dadosClienteUp);
    
    updateTable();
    limparInputs();
  }
} 

$('#buttonAdicionar').addEventListener('click', adicionarCliente);
$('#buttonPreco').addEventListener('click', criarTabelaPrecos)
$('#buttonCancelar').addEventListener('click', () => {fecharTabelaPrecos(); limparInputs();})
$('#placa').addEventListener('keyup', mascaraPlaca)
$('tbody').addEventListener('click', acoesBotoes);
$('#salvarPrecos').addEventListener('click', () => {
  adicionarCliente();
  fecharTabelaPrecos();
})
$('#dados').addEventListener('click', acaoBotaoImprimir)
$('.sessaoComprovanteSaida').addEventListener('click', acoesBotoesModalSaida)
updateTable()