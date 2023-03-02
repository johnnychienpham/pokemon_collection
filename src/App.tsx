import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import PokemonColection from './components/PokemonColection';
import { Pokemon } from './interface';
// type Name ={
//   name:string,

// }
// ke thua
// type StudentDetail= Name & {
//   age:number,
//   address:string
// }

interface Pokemons{
  name:string;
  url:string;
}

export interface Detail{
  id:number;
  isOpened:boolean;
}


const App:React.FC = ()=> {
  const [pokemons,setPokemons]= useState<Pokemon[]>([]);
  const [nextUrl,setNextUrl]= useState<string>("");
  const [loading,setLoading]=useState<boolean>(true)
  const [viewDetail,setDetail]=useState<Detail>({
    id:0,
    isOpened:false,
  })
  useEffect(()=>{
    const getPokemon = async()=>{
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20")
      //next là lấy url mới để hiển thị các con pokemon tiếp theo
      setNextUrl(res.data.next)
      res.data.results.forEach(async(pokemon:Pokemons)=>{
        const poke= await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        console.log(poke.data)
        setPokemons((p)=>[...p,poke.data])
        setLoading(false);
      })
    }
    getPokemon();
  },[])

  const nextPage= async()=>{
    setLoading(true);
    let res = await axios.get(nextUrl);
    //vì lấy r nên setNextUrl phải lấy thằng next nữa
    setNextUrl(res.data.next)
    res.data.results.forEach(async(pokemon:Pokemons)=>{
      const poke= await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      setPokemons((p)=>[...p,poke.data]);
      setLoading(false);
    })
  }
  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header"> Pokemon</header>
        <PokemonColection pokemons={pokemons} viewDetail={viewDetail} setDetail={setDetail}/>
        {/* nếu mà đóng thì xài button "Load more" */}
        {!viewDetail.isOpened&&(
          <div className="btn">
          <button onClick={nextPage}>
            {loading? "Loading..." : "Load more"}
          </button>
        </div>
        )}
        
      </div>  
    </div>
  );
}

export default App;
