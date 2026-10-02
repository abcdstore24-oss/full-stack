import {useParams} from "react-router-dom"
export default function Account(){
  const {id}=useParams();
  return (
    <>
        <h1>Account Number: {id}</h1>
    </>
  )
}