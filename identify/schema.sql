create table company (

   id serial primary key not null,
   company_name text UNIQUE not null
);

create table employees (
   id serial primary key not null,
   first_name text not null,
   last_name text not null,
   email text UNIQUE not null,
   password text,
   user_role boolean,
   emp_status boolean,
   company_id integer references company(id)
);