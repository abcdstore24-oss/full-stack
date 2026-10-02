import {useNavigate} from "react-router";
export default function Account(){
  const navigate = useNavigate();
  function create(){
    // to create account
    console.log("account created")
    const id=78
    navigate(`/accounts/${id}`)
  }

  return (
    <>
        <button onClick={()=>create()}>Create Account</button>
    </>
  )
}