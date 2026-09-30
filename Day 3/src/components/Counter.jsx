import {useState} from "react"
function Counter() {
        //variable, update func
  const [count, setCount] = useState(1);
  function inc(){
    setCount(count*2);
  }
  return (
    <>
      <p>Multiplying by 2</p>
      <p>{count}</p>
      <button onClick={()=>inc()}>Count</button>
    </>
  )
}

export default Counter;
