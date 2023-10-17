CREATE TABLE IF NOT EXISTS naturalux.users
(
    id SERIAL NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    roleid INTEGER NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS naturalux.sessions
(
    id SERIAL NOT NULL,
    userid INTEGER NOT NULL,
    token TEXT NOT NULL,
    expiresat TIMESTAMP NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS naturalux.roles
(
    id SERIAL NOT NULL,
    role TEXT NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS naturalux.products
(
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    quantity INT,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS naturalux.cart
(
    productsid SERIAL NOT NULL,
    total INT,
    quantity INT,
    CONSTRAINT cart_pkey PRIMARY KEY (productsid),
    FOREIGN KEY (productsid) REFERENCES naturalux.products (id)
);

CREATE TABLE IF NOT EXISTS naturalux.orders
(
    id SERIAL NOT NULL,
    userid int not null,
    status TEXT NOT NULL,
    paymentmethod TEXT NOT NULL,
    orderprice INT NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);