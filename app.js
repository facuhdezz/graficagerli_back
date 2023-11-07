const express = require("express");
const mariadb = require("mariadb");

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Facu_db';
const DB_DATABASE = process.env.DB_DATABASE || 'gerli';
const DB_PORT = process.env.DB_PORT || 3306;

const pool = mariadb.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT
});

const app = express();
const port = 3000;

app.use(express.json());
const trabajos = require("./json/trabajos.json");

const cors = require('cors');
const config = {
    application: {
        cors: {
            server: [
                {
                    origin: "*",
                    credentials: true
                }
            ]
        }
    }
}

app.use(cors(
    config.application.cors.server
  ));

/*  IMPLEMENTACIÓN DE METODOS DE API  */

app.get("/", (req, res) => {
    res.send("<h1>Bienvenido al servidor de Gráfica Gerli</h1>")
});

// USUARIOS
app.get("/users", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(
            `SELECT * FROM users`
        );
        res.json(rows);
    } catch(err) {
        res.status(500).json({message: "Error en la solicitud; no se pudo acceder al servidor"});
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
});

app.get("/users/:email", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(
            `SELECT * FROM users WHERE email=?`,
            [req.params.email]
        );
        res.json(rows[0]);
    } catch(err) {
        res.status(500).json({message: "Error en la solicitud; no se pudo acceder al servidor"});
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
});

app.post("/users", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let response = await conn.query(
            `INSERT INTO users(nombre, telefono, empresa, email, contraseña)
            VALUE(?,?,?,?,?)`, 
            [
                req.body.nombre,
                req.body.telefono,
                req.body.empresa,
                req.body.email,
                req.body.password
            ]
        );
        res.json({id: parseInt(response.insertId), ...req.body});
    } catch(err) {
        res.status(500).json({message: "Error en la solicitud; no se pudo acceder al servidor"});
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
});

app.get("/boletas", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(
            `SELECT * FROM boletas`
        );
        res.json(rows);
    } catch(err) {
        res.status(500).json({message: "Error en la solicitud; no se pudo acceder al servidor"});
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
});

app.get("/boletas/:id", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(
            `SELECT * FROM boletas WHERE id=?`,
            [req.params.id]
        );
        res.json(rows[0]);
    } catch(err) {
        res.status(500).json({message: "Error en la solicitud; no se pudo acceder al servidor"});
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
});

app.post("/boletas", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let response = await conn.query(
            `INSERT INTO boletas(nombre, telefono, email, empresa, cantidad, medida, datos)
            VALUE(?,?,?,?,?,?,?)`, 
            [
                req.body.nombre,
                req.body.telefono,
                req.body.email,
                req.body.empresa,
                req.body.cantidad,
                req.body.tamaño,
                req.body.datos
            ]
        );
        res.json({id: parseInt(response.insertId), ...req.body});
    } catch(err) {
        res.status(500).json({message: "Error en la solicitud; no se pudo acceder al servidor"});
        console.log(err);
    } finally {
        if(conn) conn.release();
    }
});


// TRABAJOS

app.get("/trabajos", (req, res) => {
    res.json(trabajos);
});

app.get("/trabajos/:index", (req, res) => {
    res.json(trabajos[req.params.index]);
});

app.post("/trabajos", (req, res) => {
    trabajos.push(req.body);
    res.json(req.body);
    console.log(req.body);
});

/* -------------------------- PUERTO -------------------------- */

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});
