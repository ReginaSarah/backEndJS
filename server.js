import express, { response } from "express";


import cors from "cors";

import routerUsuarios from "./routes/usuario.js"
import routerUsuariosPrivate from "./routes/usuarioPrivate.js"

import auth from "./middlewares/auth.js";

const app = express(); // configurando um servidor

app.use(express.json());

// evitar erro de CORS
app.use(cors());

app.use("/", routerUsuarios);
app.use("/", auth, routerUsuariosPrivate);

app.listen(3000, () => console.log("Servidor rodando com sucesso!"));


