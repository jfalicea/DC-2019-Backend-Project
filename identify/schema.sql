create table company (
    id serial primary key not null,
    name text not null,
    logo text not null
);

create table employees (
    id serial primary key not null,
    first_name text not null,
    last_name text not null,
    email text not null,
    password varchar(10) not null,
    app_role boolean not null,
    status boolean not null,
    company_id integer references company(id)
);