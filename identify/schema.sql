create table company (
    id serial primary key not null,
    first_name text not null,
    last_name text not null,
    email text not null,
    company_name text not null,
    password text not null
);

create table employees (
    id serial primary key not null,
    first_name text not null,
    last_name text not null,
    email text not null,
    password text not null,
    app_role boolean not null,
    status boolean not null,
    company_id integer references company(id)
);