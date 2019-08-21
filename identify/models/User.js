const db = require('../db');
const bcrypt = require('bcrypt');

async function getAll(id) {
    try {

        const user = await db.one(`
            select * from users where id=$1    
        `, [id]);
        // const userFavorites = await db.any(`
        //     select * from favorites where user_id=$1
        // `, [id]);

        // user.favorites = userFavorites;
        return user;

    } catch (error) {

        console.log('ERROR');
        return {
            id: 0,
            displayname: 'Sorry, no user found.'
        }
        
    }
}

// async function getFavorites(id) {
//     try {

//         const user = await db.one(`
//             select * from users where id=$1
//         `, [id]);
//         const userFavorites = await db.one(`
//             select * from favorites where user_id=$1
//         `, [id]);

//         user.favorites = userFavorites;
//         return user;

//     } catch (error) {

//         console.log('ERROR');
//         return {
//             id: 0,
//             displayname: 'Sorry, no user found.'
//         }

//     }
// }

async function createUser({ username, email, password }) {
    try {

        const hash = bcrypt.hashSync(password, 10);

        const checkUser = await db.any(`
    
            select * from users where username = $1 OR email = $2
    
        `, [username, email]);
    
        const newUserInfo = await db.one(`
    
            insert into users
                (username, email, password)
            values ($1, $2, $3)
    
            returning id
    
        `, [username, email, hash]);
    
        if(checkUser.length > 0) {
            return 'Error: User Exists';
        } else {
            return newUserInfo;
        }

    } catch (error) {

        console.log('ERROR');
        return {
            msg: "Unable to create user."
        }

    }
}

async function checkQuery(req) {
    const username = req.body.username;
    const password = req.body.password;
    try{

        const query = await db.one(`

            SELECT * FROM users WHERE username=$1

       `, [username]);

        // console.log(req.session.username);
        const correctPass = bcrypt.compareSync(password, query.password);
        console.log(correctPass);

        if (correctPass) {
            return {
                username: query.username,
                email: query.email,
                id: query.id
            }
        } else {
            return {
                message: 'Sorry this user doesnt exist or the password was incorrect',
                username: 'Error',
                email: 'Error',
                id: 0
            }
        }

    } catch (error) {

        console.log('ERROR');
        return 'error';

    }
}

module.exports = {

    getAll,
    createUser,
    checkQuery

}