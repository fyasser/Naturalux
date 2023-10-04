CREATE TABLE IF NOT EXISTS Naturalux.users
(
    id SERIAL NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    roleid INTEGER NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Naturalux.sessions
(
    id SERIAL NOT NULL,
    userid INTEGER NOT NULL,
    token TEXT NOT NULL,
    expiresat TIMESTAMP NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Naturalux.roles
(
    id SERIAL NOT NULL,
    role TEXT NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Naturalux.products
(
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL,
    quantity INT,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Naturalux.cart
(
    productsid SERIAL NOT NULL,
    total INT,
    quantity INT,
    CONSTRAINT cart_pkey PRIMARY KEY (productsid),
    FOREIGN KEY (productsid) REFERENCES Naturalux.products (id)
);

CREATE TABLE IF NOT EXISTS Naturalux.orders
(
    id SERIAL NOT NULL,
    status TEXT NOT NULL,
    paymentmethod TEXT NOT NULL,
    orderprice INT NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);