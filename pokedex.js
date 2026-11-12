let estadoPokedex = {
    digitando : false,
    pokeShiny : false,
}

let numPokemon = '';

const key1 = document.querySelector('#key-1');
const key2 = document.querySelector('#key-2');
const key3 = document.querySelector('#key-3');
const key4 = document.querySelector('#key-4');
const key5 = document.querySelector('#key-5');
const key6 = document.querySelector('#key-6');
const key7 = document.querySelector('#key-7');
const key8 = document.querySelector('#key-8');
const key9 = document.querySelector('#key-9');
const key10 = document.querySelector('#key-10')

const btnWhiteLeft = document.querySelector('#btn-white-left');
const btnWhiteRight = document.querySelector('#btn-white-right');
const btnLeft = document.querySelector('#btn-left'); //-1
const btnRight = document.querySelector('#btn-right'); //+1
const btnShiny = document.querySelector('#led-yellow');
const btnUp = document.querySelector('#btn-up')
const btnDown = document.querySelector('#btn-down')

const numberDisplay = document.querySelector('#number-display');
const infoScreen = document.querySelector('#info-screen');
const mainScreen = document.querySelector('#main-screen');
const smallDisplayLeft = document.querySelector('#small-display-left');
const smallDisplayRight = document.querySelector('#small-display-right');


key1.addEventListener('click', () => leituraTeclado('1'));
key2.addEventListener('click', () => leituraTeclado('2'));
key3.addEventListener('click', () => leituraTeclado('3'));
key4.addEventListener('click', () => leituraTeclado('4'));
key5.addEventListener('click', () => leituraTeclado('5'));
key6.addEventListener('click', () => leituraTeclado('6'));
key7.addEventListener('click', () => leituraTeclado('7'));
key8.addEventListener('click', () => leituraTeclado('8'));
key9.addEventListener('click', () => leituraTeclado('9'));
key10.addEventListener('click', () => leituraTeclado('0'));

btnWhiteLeft.addEventListener('click', buscarPokemon);
btnWhiteRight.addEventListener('click', apagar);

btnRight.addEventListener('click', () => {
    if (Number(numPokemon) + 1 <= 1025) {
        numPokemon = String(Number(numPokemon) + 1);
        estadoPokedex.digitando = true;
        atualizarNumero(numPokemon);
    }
});

btnLeft.addEventListener('click', () => {
    if (Number(numPokemon) - 1 >= 1) {
        numPokemon = String(Number(numPokemon) - 1);
        estadoPokedex.digitando = true;
        atualizarNumero(numPokemon);
    }
});

btnUp.addEventListener('click', () => {
    let novoNumero = Number(numPokemon) + 10;
    
    if (novoNumero > 1025) novoNumero = 1025; 
    numPokemon = String(novoNumero);
    estadoPokedex.digitando = true;
    atualizarNumero(numPokemon);
});

btnDown.addEventListener('click', () => {
    let novoNumero = Number(numPokemon) - 10;
    
    if (novoNumero < 1) novoNumero = 1; 
    numPokemon = String(novoNumero);
    estadoPokedex.digitando = true;
    atualizarNumero(numPokemon);
});

btnShiny.addEventListener('click', () => {
    estadoPokedex.pokeShiny = !estadoPokedex.pokeShiny;
    carregarFoto(numPokemon);
});

function leituraTeclado(tecla)
{
    if(estadoPokedex.digitando === false){
        infoScreen.textContent = ''
        estadoPokedex.digitando = true
    }
    numPokemon += tecla;
    infoScreen.textContent = numPokemon
}

function apagar()
{
    if(estadoPokedex.digitando)
    {
        numPokemon = numPokemon.slice(0, -1)
        if(numPokemon.length < 1){
            estadoPokedex.digitando = false;
            infoScreen.textContent = 'Aguardando dados…'
        }
        else{
            infoScreen.textContent = numPokemon
        }
        numberDisplay.textContent = '#000'
        mainScreen.innerHTML = "Nenhum Pokémon carregado";
        smallDisplayRight.textContent = "---";
        smallDisplayLeft.textContent = "---";
    }
}

function atualizarNumero(id)
{
    let idString = id.toString();
    while(idString.length < 3) idString = '0' + idString;
    idString = '#' + idString;
    numberDisplay.textContent = idString;
}

async function consultarApi(msg)
{
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${msg}`);
        const data = await response.json();

        const procurarEspecie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${msg}/`);
        const especie = await procurarEspecie.json();

        carregarFoto(msg);
        atualizarNumero(data.id);
        exibirDados(data, especie);
    }
    catch(erro)
    {
        console.log("Ocorreu um erro:", erro.message)
         if(Number(msg) < 1 || Number(msg) > 1025) {
            numberDisplay.textContent = '#000';
            infoScreen.textContent = "Ocorreu um Erro, tente novamente..."
            smallDisplayLeft.textContent = '---';
            smallDisplayRight.textContent = '---';
         }
    }
}

function buscarPokemon()
{
    if(estadoPokedex.digitando) consultarApi(numPokemon)
}

async function carregarFoto(img)
{
    try{
        if(img > 0 && img <= 1025){
            const imagem = document.createElement("img");

            if (estadoPokedex.pokeShiny) {
                imagem.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${img}.png`;
            } else {
                imagem.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${img}.png`;
            }

            if(window.innerWidth < 600){ // mobile
                imagem.style.width = '100px';
            }
            else{ // desktop
                imagem.style.width = '240px';
                imagem.style.transform = 'translate(0, 15px)';
            }

            mainScreen.innerHTML = "";
            mainScreen.appendChild(imagem);
        } else {
            mainScreen.innerHTML = "NÃO ENCONTRADO";
        }
    } catch(erro){
        console.log(erro.message)
         mainScreen.innerHTML = "NÃO ENCONTRADO";
    }
} 

function descobrirRegiao(especie)
{
    const geracao = especie.generation.name;

        if (geracao === 'generation-i') { return 'Kanto'; }
    else
        if (geracao === 'generation-ii') { return 'Johto'; }
    else 
        if (geracao === 'generation-iii') { return 'Hoenn'; }
    else 
        if (geracao === 'generation-iv') { return 'Sinnoh'; }
    else 
        if (geracao === 'generation-v') { return 'Unova'; }
    else 
        if (geracao === 'generation-vi') { return 'Kalos'; }
    else 
        if (geracao === 'generation-vii') { return 'Alola'; }
    else 
        if (geracao === 'generation-viii') { return 'Galar'; }
    else 
        if (geracao === 'generation-ix') { return 'Paldea'; }
    else { return 'Desconhecida'; }
}

function exibirDados(data, especie)
{
    infoScreen.textContent = '';
    const nome = document.createElement('p');
    nome.textContent = capitalizar(data.name);
    nome.style.fontSize = '1.5rem';
    nome.style.fontWeight = 'bold';
    const tipo = document.createElement('p');
    tipo.textContent = 'Tipo: ' + capitalizar(data.types.map(t => t.type.name).join(', '));
    const pesoKg = data.weight / 10;
    let peso = 0;
    let unidadePeso = '';
    if(pesoKg < 1){
        peso = Math.round(pesoKg * 1000);
        unidadePeso = 'g';
    }
    else{
        peso = Math.round(pesoKg);
        unidadePeso = 'Kg'
    }
    const regiao = document.createElement('p');
    regiao.textContent = 'Região: ' + descobrirRegiao(especie);

    infoScreen.append(nome, tipo, regiao);

    smallDisplayLeft.textContent = 'Peso: ' + (data.weight / 10) + 'kg';
    smallDisplayRight.textContent = 'Altura: ' + (data.height / 10) + 'm'
}

function capitalizar(str)
{
    const strCapitalizada = str.charAt(0).toUpperCase() + str.slice(1);
    return strCapitalizada;
}
