import express, { response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();
const prisma = new PrismaClient();



router.get("/listarUsuarios", async (request, response) => {
    try {
        let usuarios = [];        
    
        if(request.query){
            usuarios = await prisma.usuario.findMany({
                where: {
                    nome: request.query.nome,
                    email: request.query.email,
                },
                omit: { senha: true }
            })
        } else {
            usuarios = await prisma.usuario.findMany({ omit: { senha: true } });
        }

        if(usuarios == null){
            response.status(404).send("Lista de usuários vazia.")
            return;
        }

        response.status(200).json(usuarios);
    }
    catch (e) {
        response.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
    }
    
});

router.get('/buscarPorId/:id', async (request, response) => {
    const usuario = await prisma.usuario.findUnique( {
        where: {
            id: request.params.id,
        }
    });
    if(!usuario){
        response.status(404).send("Não foi possível encontrar a usuario especificada.")
        return;
    }
    response.status(200).send(usuario);
});

router.get('/buscarPorCpf/:cpf', async (request, response) => {
    const usuario = await prisma.usuario.findUnique( {
        where: {
            cpf: request.params.cpf,
        }
    });
    if(!usuario){
        response.status(404).send("Não foi possível encontrar a usuario especificada.")
        return;
    }
    response.status(200).send(usuario);
});

router.put("/editar", async (request, response) => {
    const body = request.body;
    const usuario = await prisma.usuario.findUnique( {
        where: {
            id: request.body.id,
        }
    });
    if(!usuario){
        response.status(404).send("Não foi possível encontrar a usuario especificada.")
        return;
    }
    const usuarioCadastrado = await prisma.usuario.update({
        where: {
            id: request.body.id,
        },
        data: {
            email: body.email,
            cpf: body.cpf,
            nome: body.nome,
            senha: usuario.senha,
        }
    });
    response.status(200).send(usuarioCadastrado);
});

router.delete("/excluirPorId/:id", async (request, response) => {
    await prisma.usuario.delete( {
        where: {
            id: request.params.id,
        }
    });
    response.status(200).json({message: "Usuário excluído com sucesso."});
});

router.delete("/excluirPorCpf/:cpf", async (request, response) => {
    await prisma.usuario.delete( {
        where: {
            cpf: request.params.cpf,
        }
    });
    response.status(200).json({message: "Usuário excluído com sucesso."});
});


export default router;