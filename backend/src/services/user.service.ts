'use strict';
import userModel from '../models/user.model'
import hashing from '../utilities/hashing';
import encryption from '../appConfigs/utilities/encryption';
import CONFIGS from "../config";



const loginWithEmail = async (req: any) => {
    // Fetch user details
    const user = await userModel.fetchUserInfoByEmail(req.body.email);
    console.log("user ",user, " req -> ",req.body)

    if (user.length == 0) throw new Error("Invalid credentials");

    if (user.length && user[0].status == 0) {
        throw new Error("User is not authorized..!!");
    }

    // Password bcrypt and verify
    const match = await hashing.verifyHash(req.body.password, user[0].password);
    if (!match) throw new Error("Invalid password");
    let authority ;
    if(user[0].role == 1){
        authority =  ["admin"];
        user[0].authority = ["admin"];
    }
    else{
        authority =  ["user"];
        user[0].authority = ["user"];
    }

    const token = await encryption.generateJwtToken({
        id: user[0].id,
        role: user[0].role,
        authority,
        expires_in: CONFIGS.SECURITY.JWT_TOKEN.EXPIRY
    });

    user[0].token = token;
    delete user[0].password;
    return {
        ...user[0],
    };
}
export default {
    loginWithEmail
}
