const db = require('../db');
const bcrypt = require('bcrypt');
const Swal = require('sweetalert2');


async function getUsers(id) {
    const users = await db.any(`
        select * from employees where company_id=$1
    `, [id]);

    return users
}

async function getAll(id) {
    try {

        const user = await db.one(`
            select * from company where id=$1    
        `, [id]);

        return user;

    } catch (error) {

        console.log('ERROR');
        return {
            id: 0,
            email: 'Sorry, no user found.'
        }
        
    }
}

async function adminCreate({ first_name, last_name, email, user_role, emp_status }, user_id) {
    // think about adding checkUser functionality

    // const company_id = user_id;

    try {

        const newEmployee = await db.one(`

            insert into employees
                (first_name, last_name, email, user_role, emp_status, company_id)
            values ($1, $2, $3, $4, $5, $6)

            returning id, first_name, last_name, email, user_role, emp_status

        `, [first_name, last_name, email, user_role, emp_status, user_id]);

        const queryAll = await db.any(`

            select * from employees where company_id=$1

        `, [user_id]);

        return queryAll;

    } catch (error) {
        console.log(error);
        console.log('hey');
    }
}

async function createUser({ first_name, last_name, email, company_name, password }) {
    try {

        const hash = bcrypt.hashSync(password, 10);

        const company = await db.one(`
        
            insert into company
                (company_name)
            values ($1)

            returning id

        `, [company_name]);

        const refId = await db.one(`
        
            select id from company where company_name=$1

        `, [company_name]);

        const employeesForCompany = await db.one(`
            insert into employees
                (first_name, last_name, email, password, user_role, emp_status, company_id)
            values ($1, $2, $3, $4, $5, $6, $7)

            returning id, email

        `, [first_name, last_name, email, hash, 'true', 'true', refId.id]);
        
        company.employees = employeesForCompany;

        return company;

    } catch (error) {
// Will almost certainly not ever happen
        return {
            msg: "different error"
        }

    }
}

async function checkUser({ first_name, last_name, email, company_name, password }) {
    try {

        const checkUser = await db.any(`
    
            select * from company, employees where company_name=$1 OR email=$2
    
        `, [company_name, email]);

        if(checkUser.length > 0) {
            return {
                msg: "error"
            }
        } else {
            return createUser({ first_name, last_name, email, company_name, password });
        }

    } catch (error) {
// Will almost certainly not ever happen
        return {
            msg: "error"
        }

    }
}

async function checkQuery(req) {
    const email = req.body.email;
    const password = req.body.password;
    try{

        const query = await db.one(`

            SELECT * FROM employees WHERE email=$1

       `, [email]);

       const refId = await db.one(`

            select company_id from employees where email=$1

       `, [email]);

       console.log('lskdjflskdjflksd------klsdflkdsjdslkj');
       console.log(refId);

        const correctPass = bcrypt.compareSync(password, query.password);
        console.log(correctPass);

        if (correctPass) {
            return {
                id: query.id,
                ref_id: refId.company_id,
                user_email: email
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

async function removeEmployee(email) {
    console.log(email);
    try {

        const delEmployee = await db.one(`
        
            delete from employees where email=$1 

        `, [email]);

        return {
            message: 'Success'
        }

    } catch (error) {

        return {
            message: 'Error'
        }

    }
}

module.exports = {

    getUsers,
    getAll,
    adminCreate,
    checkUser,
    checkQuery,
    removeEmployee

}