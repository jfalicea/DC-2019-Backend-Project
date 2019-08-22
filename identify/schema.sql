create table company (
    id serial primary key not null,
    company_name text not null
);

create table employees (
    id serial primary key not null,
    first_name text not null,
    last_name text not null,
    email text not null,
    password text not null,
    user_role boolean not null,
    emp_status boolean not null,
    company_id integer references company(id)
);