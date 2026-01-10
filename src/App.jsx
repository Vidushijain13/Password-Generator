import React, { useState } from 'react'
import {Check, Copy, Eye, EyeOff} from "lucide-react";

const App = () => {

  const getRandomChar = {
    upper:()=>String.fromCharCode(65+Math.floor(Math.random()*26)),
    lower:()=>String.fromCharCode(97+Math.floor(Math.random()*26)),
    number:()=>String.fromCharCode(48+Math.floor(Math.random()*10)),
    symbol:()=>String.fromCharCode(33+Math.floor(Math.random()*15)),
  }

  const calculateStrength = (password) =>{
    let strength = 0;
    if(password.length>=8) strength++;
    if(/[A-Z]/.test(password)) strength++;
    if(/[a-z]/.test(password)) strength++;
    if(/[0-9]/.test(password)) strength++;
    if(/[^A-Za-z0-9]/.test(password)) strength++;
    if(strength<=1) return "weak";
    if(strength===2 || strength===3 ) return "Moderate"
    return "strong"
  }
  
  const [length,setLength] = useState(8)
  const [upper,setUpper] = useState(false)
  const [lower,setLower] = useState(false)
  const [number,setNumber] = useState(false)
  const [symbol,setSymbol] = useState(false)
  const [visible,setVisible] = useState(false)
  const [password,setPassword] = useState("")
  const [copy,setcopy] = useState(false)
  const [strength,setStrength] = useState("weak")
  const [show, setShow] = useState(false)

  const generatePassword = () =>{
    let charTypes = [];

    if( upper) charTypes.push("upper")
    if( lower) charTypes.push("lower")
    if( number) charTypes.push("number")
    if( symbol) charTypes.push("symbol")

    if(charTypes.length ===0){
      return setPassword("")
    }

    let password =""
    for(let i=0;i<length;i++){
      //[u,l,n,s]           floor(0-1*4)=>3 chartypes[3]=symbol
      const type = charTypes[Math.floor(Math.random()*charTypes.
        length)]
      password += getRandomChar[type]();
      // password = password + getRandomChar[symbol]()
    }
    setPassword(password)
    setStrength(calculateStrength(password))
  }

  const copyToClipboard = () =>{
    navigator.clipboard.writeText(password);
    setcopy(true)
    setTimeout(() =>{
      setcopy(false);
    },2000);
  }

  return (
    <div className='min-h-screen w-full bg-gray-900 flex 
    items-center justify-center'>
      <div className='h-150 w-full max-w-2xl rounded-xl shadow-lg p-6
      border-2 border-yellow-400 mx-2'>
        <h1 className='text-center text-5xl font-semibold mb-13 mt-4
         text-yellow-300'>
          Classic Password Generator
          </h1>
        <div className='flex w-full mb-8 items-center space-x-2
         bg-gray-700 p-2 rounded-lg justify-between border-yellow-300 border'>
          <input type={visible?"text":"password"}
          readOnly 
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          className='flex outline-none bg-transparent text-xl w-1/2
          md:3/4 text-yellow-200 font-semibold'
          />
          <div className='flex items-center gap-4'>
            <button className='text-white' onClick={() =>setVisible
            (!visible)}>{visible?<Eye/>:<EyeOff />}</button>
            <button className='text-white' onClick={copyToClipboard}
            >{copy?<Check/>:<Copy/>}</button>
          </div>
        </div>
        <div className='mt-2 text-right text-sm font-bold
        text-yellow-300'>
          Strength: <span className={strength==="weak"
          ?'text-red-400':strength==="Moderate"
          ?"text-yellow-400"
          :"text-green-400"
      }
    >
      {strength}
      </span>
    </div>
        <div className='grid grid-cols-2 gap-4 my-6 text-yellow-200'>
          <label className='flex items-center text-xl mb-6 gap-3 cursor-pointer'>
            <input type="checkbox" checked={upper} onChange={() => 
            setUpper(!upper)} />Uppercase
          </label>
          <label className='flex items-center text-xl mb-6 gap-3 cursor-pointer'>
            <input type="checkbox" checked={lower} onChange={() => 
            setLower(!lower)} />Lowercase
          </label>
          <label className='flex items-center text-xl gap-3 cursor-pointer'>
            <input type="checkbox" checked={number} onChange={() => 
            setNumber(!number)} />Number
          </label>
          <label className='flex items-center text-xl gap-3 mb-6 cursor-pointer'>
            <input type="checkbox" checked={symbol} onChange={() => 
            setSymbol(!symbol)} />Symbol
          </label>
        </div>
        <div className='my-6'>
          <label className='block mb-1 font-semibold text-yellow-300'>
            <input type="number" 
            value={length}
            min={4}
            max={20}
            onChange={(e) =>setLength(e.target.value)}
            className='w-full p-2 rounded-lg border-2
            border-yellow-300 bg-gray-700 text-yellow-200 
            focus:outline-none focus:ring-2  focus:ring-yellow-400'/>
          </label>
        </div>
        <button onClick={generatePassword} className='w-full md:mt-6
        mt-2 bg-blue-500 py-2 rounded-lg font-bold text-white 
        shadow-md transition-all md:text-2xl text-xl 
        hover:bg-blue-600'>Generate Password</button>
      </div>
    </div>
  )
}

export default App
