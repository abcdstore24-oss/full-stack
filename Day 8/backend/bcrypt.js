const bcrypt = require("bcrypt")
async function demo(){
    const password = "Pinkey@123";
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    console.log(await bcrypt.compare("Pinkey@123", hashedPassword))
    console.log(await bcrypt.compare("Wrong@123", hashedPassword))
}
demo()