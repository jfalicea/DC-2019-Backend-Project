const db = require('../db');
const bcrypt = require('bcrypt');
const Swal = require('sweetalert2');


async function getUsers() {
    const users = await db.any(`
        select * from company
    `);

    return users;
}

async function getAll(id) {
    try {

        const user = await db.one(`
            select * from company where id=$1    
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
            email: 'Sorry, no user found.'
        }
        
    }
}

async function createUser({ first_name, last_name, email, company_name, password }) {
    try {
        const hash = bcrypt.hashSync(password, 10);

        const checkUser = await db.any(`
    
            select * from company where email = $1
    
        `, [email]);
    
        const newUserInfo = await db.one(`
    
            insert into company
                (first_name, last_name, email, company_name, password)
            values ($1, $2, $3, $4, $5)
    
            returning id
    
        `, [first_name, last_name, email, company_name, hash]);

        if(checkUser.length > 0) {
            return 'Error: User Exists';
        } else {
            return newUserInfo;
        }

    } catch (error) {
        console.log(error);
        return {
            msg: "Unable to create user."
        }

    }
}

async function checkQuery(req) {
    const email = req.body.email;
    const password = req.body.password;
    try{

        const query = await db.one(`

            SELECT * FROM company WHERE email=$1

       `, [email]);

        const correctPass = bcrypt.compareSync(password, query.password);
        console.log(correctPass);

        if (correctPass) {
            return {
                email: query.email,
                id: query.id
            };
        } else {
            return {
                message: 'Sorry this user doesnt exist or the password was incorrect'
            };
        }

    } catch (error) {

        console.log('ERROR');
        return {
            message: 'Error'
        }

    }
}

module.exports = {

    getUsers,
    getAll,
    createUser,
    checkQuery

}