function StudentCard({name, marks}){
    return (
        <div>
            <h1>Hello {name}</h1>
            <p>Marks: {marks}</p>
            <p>Status: {marks>50?"Pass":"Fail"}</p>
        </div>
    )
}
export default StudentCard;