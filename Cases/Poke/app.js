var pokeAPI = 'https://pokeapi.co/api/v2/'
/*
https://pokeapi.co/docs/v2.html

pokemon/
pokemon/{name || id}/
type/
type/{name || id}/
ability/
ability/{name || id}/

pokemon.count = 964

Evolution => /pokemon-species/{name || id}/
*/

/* 
TO-DO
evo-chain for stone evo -> ex.evee
seperate hash and search
*/

var pokeMain = document.querySelector('.poke_main')
var searchForm = document.querySelector('.search')
var searchInput = document.querySelector('.search-field')
var searchResult = document.querySelector('.search-result')
var searchEvoChain = document.querySelector('.search-evo-chain')
var randomResult = document.querySelector('.poke-random-result')

const state = {}

//charmeleon

class Poke{
    constructor(query){
        this.query = query
    }

    seperateTypes(allTypes){
        let types = []
        for(let i = allTypes.length-1 ; i >= 0 ; i--){
            types.push(allTypes[i].type.name)
        }
        return types
    }

    getPokeIDbyURL(url){
        let urls = url.split("/")
        return urls[urls.length-2]
    }

    async getPokeEvolutionChain(){
        try{
            let chain_url, current_chain;
            let response = await fetch(`${pokeAPI}pokemon-species/${this.query}/`)
            response = await response.json()
            chain_url = response.evolution_chain.url

            response = await fetch(chain_url)
            response = await response.json()

            current_chain = response.chain
            let evoChain = []
            evoChain.push(this.getPokeIDbyURL(current_chain.species.url))
            if(current_chain.evolves_to.length > 0){
                current_chain = current_chain.evolves_to[0]
                evoChain.push(this.getPokeIDbyURL(current_chain.species.url))
                if(current_chain.evolves_to.length > 0){
                    evoChain.push(this.getPokeIDbyURL(current_chain.evolves_to[0].species.url))
                }
            }
            return evoChain
        }catch(error){
            console.log(`getPoke ${error}`)
        }
    }


    async getPoke() {
        try{
            let response = await fetch(`${pokeAPI}pokemon/${this.query}/`)
            response = await response.json()
            this.id = response.id
            this.name = response.name
            this.img = response.sprites.front_default
            //console.log(`${this}`)
        }catch(error){
            console.log(`getPoke ${error}`)
        }
    }
    
    async getPokeForEvoChain(name) {
        try{
            let response = await fetch(`${pokeAPI}pokemon/${name}/`)
            response = await response.json()
            return {id:response.id,name:response.name,img:response.sprites.front_default}
            //console.log(`${this}`)
        }catch(error){
            console.log(`getPoke ${error}`)
        }
    }

    async getPokeAllDetail(){
        try{
            let response = await fetch(`${pokeAPI}pokemon/${this.query}/`)
            response = await response.json()
            this.id = response.id
            this.name = response.name
            this.img = response.sprites.front_default
            this.types = this.seperateTypes(response.types)
            this.height = response.height
            this.weight = response.weight
            this.speed = response.stats[0].base_stat
            this.spDef = response.stats[1].base_stat
            this.spAtk = response.stats[2].base_stat
            this.def = response.stats[3].base_stat
            this.atk = response.stats[4].base_stat
            this.hp = response.stats[5].base_stat
            this.evoChain = await this.getPokeEvolutionChain()
            //console.log(this.evoChain)
            for(let i=0; i< this.evoChain.length; i++){
                this.evoChain[i] = await this.getPokeForEvoChain(this.evoChain[i])
            }
        }catch(error){
            console.log(`getPokeAllDetail ${error}`)
        }
    }
}

const clearRandomPoke = () => {
    randomResult.innerHTML = ``
}

const clearPokeDetail = () => {
    searchResult.innerHTML = ``
    searchEvoChain.innerHTML = ``
}

const clearSearchInput = () => {
    searchInput.value = ``
}

const clearLoader = () => {
    const loader = document.querySelector('.loader')
    if(loader) loader.parentElement.removeChild(loader)
}

const renderLoader = (el) => {
    const loader = `<div class="loader"></div>`
    el.insertAdjacentHTML('afterBegin',loader)
}

const renderRandomPoke = (randomPoke) => {
    let markup = ``;
    for(let i=0; i<randomPoke.length;i++){
        markup += `<a href="#${randomPoke[i].id}" class="random-result">
                    <img class="random-result-img" src="${randomPoke[i].img}">
                    <p class="random-result-name">${randomPoke[i].name}</p>
                </a>`
    }
    randomResult.insertAdjacentHTML('afterBegin',markup)
}

const renderPokeDetail = (poke) =>{
    let markup = `<h1 class="search-result-name">${poke.name}</h1>
                    <img class="search-result-img" src="${poke.img}">
                    <p class="search-result-id">National no. : ${poke.id}</p>
                    <div class="search-result-detail">
                        <p>Type: ${poke.types}</p>
                        <p>Height: ${poke.height}</p>
                        <p>Weight: ${poke.weight}</p>
                    </div>
                    <div class="search-result-stats">
                        <p>Speed: ${poke.speed}</p>
                        <p>Sp.Def: ${poke.spDef}</p>
                        <p>Sp.Atk: ${poke.spAtk}</p>
                        <p>Defense: ${poke.def}</p>
                        <p>Attack: ${poke.atk}</p>
                        <p>HP: ${poke.hp}</p>
                    </div>`
    searchResult.insertAdjacentHTML('afterBegin',markup)
    renderPokeEvoChain(poke.evoChain)
}

const renderPokeEvoChain = (evoChain) => {
    let markup = ``;
    for(let i=0; i<evoChain.length;i++){
        markup += `<a href="/#${evoChain[i].id}" class="evo">
                        <img class="random-result-img" src="${evoChain[i].img}">
                        <p class="random-result-name">${evoChain[i].name}</p>
                    </a>`
    }
    searchEvoChain.insertAdjacentHTML('afterBegin',markup)
}

const ctrlSearch = async() => {
    const serchInput = (searchInput.value).toLowerCase()
    const hashID = window.location.hash.replace('#','')
    const query = serchInput !== '' ? serchInput : hashID
    if(query !== ''){
        try{
            clearPokeDetail()
            renderLoader(searchResult)
            clearSearchInput()
            state.poke = new Poke(query)
            await state.poke.getPokeAllDetail()
            if(state.poke.name)  {
                clearLoader(searchResult)
                renderPokeDetail(state.poke)
            }
        }catch(error){
            console.log(`ctrlSearch ${error}`)
        }
    }
}

const ctrlRandom = async() => {
    clearRandomPoke()
    renderLoader(randomResult)
    const rand = [Math.floor(Math.random()*807)+1,
                Math.floor(Math.random()*807)+1,
                Math.floor(Math.random()*807)+1,
                Math.floor(Math.random()*807)+1]
    try{
        state.randomPoke = [new Poke(rand[0]), new Poke(rand[1]), new Poke(rand[2]), new Poke(rand[3])]
        for(let i=0; i<4; i++){
            await state.randomPoke[i].getPoke()
        }
        clearLoader()
        renderRandomPoke(state.randomPoke)
    }catch(error){
        console.log(`ctrlRandom ${error}`)
    }
}

const init = () => {
    window.addEventListener('hashchange', ctrlSearch)
    pokeMain.addEventListener('click', ctrlRandom)
    searchForm.addEventListener('submit', function(event){
        event.preventDefault()
        ctrlSearch()
    })
    ctrlRandom()
}

init()