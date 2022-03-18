const express = require('express')
const app = express()  
const mysql = require('mysql');
const cors = require('cors'); 
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

//configuracion de base de datos

const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'default_local',
    database: 'POS',
    port: 3306
}); 
module.exports = bd;

//rutas
app.get("/api/getProducts", async (req, result) => {
    const dbCall = () => {
        try {
            bd.query("SELECT * FROM productos", (error, data) => {
                if (error)
                    throw error;
                result.json(data);
            });
        } catch (e) {
            console.log(e);
        }
    }
    await dbCall(); 
});  

app.get("/api/getStock", async (req, result) => {
    const dbCall = () => {
        try {
            bd.query("SELECT p.id, p.`codigo`, p.`nombre` AS producto, p.`descripcion`, p.`costo`, p.`retail`, p.`mayoreo`, p.`categoria`, " +
            "IF(e.cant_entradas IS NULL, 0, e.cant_entradas) - IF(s.cant_salidas IS NULL, 0, s.cant_salidas) AS Existencias " +
            "FROM productos AS p " +
            "LEFT JOIN(SELECT idProducto, SUM(cantidad) AS cant_entradas FROM entradas GROUP BY idProducto) AS e ON e.idProducto = p.id " +
            "LEFT JOIN(SELECT idProducto, SUM(cantidad) AS cant_salidas FROM salidas GROUP BY idProducto) AS s ON s.idProducto = p.id " +
            "WHERE p.estado = 1", (error, data) => {
                if (error)
                    throw error;
                result.json(data);
            });
        } catch (e) {
            console.log(e);
        }
    }
    await dbCall(); 
}); 

app.get("/api/getClients", async (req, result) => {
    const dbCall = () => {
        try {
            bd.query("SELECT * FROM clientes", (error, data) => {
                if (error)
                    throw error;
                result.json(data);
            });
        } catch (e) {
            console.log(e);
        }
    }
    await dbCall(); 
}); 

app.get("/api/getProveedores", async (req, result) => {
    const dbCall = () => {
        try {
            bd.query("SELECT * FROM proveedores", (error, data) => {
                if (error)
                    throw error;
                result.json(data);
            });
        } catch (e) {
            console.log(e);
        }
    }
    await dbCall(); 
}); 
 
app.listen(9000); 