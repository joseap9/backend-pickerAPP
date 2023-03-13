const axios = require('axios');

const authenticate = async () => {

    try {
        const response = await axios.post("https://metabase.ecomm.cencosud.com/api/session", {
            username: "EF3671",
            password: "Cd022023$"
        });
        
        console.log("metabase online");

        return response.data.id;
        
    } catch (error) {
        console.log(error);
    }
    
};

module.exports={
    authenticate
}