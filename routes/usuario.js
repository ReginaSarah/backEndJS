import express, { response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();
const prisma = new PrismaClient();

const salt = await bcrypt.genSalt(10);

// Cadastro de usuário

router.post("/cadastro", async (request, response) => {
    try {
        // Dados do cadastro
        const usuario = request.body;

        if(!usuario.nome || !usuario.email || !usuario.cpf || !usuario.senha){
            return response.status(400).json({message: "Dados incompletos."});
        }
        
        // Criação de senha encriptada
        const hashSenha = await bcrypt.hash(usuario.senha, salt);

        // Salva no banco
        const usuarioCadastrado = await prisma.usuario.create({
            data: {
                email: usuario.email,
                cpf: usuario.cpf,
                nome: usuario.nome,
                senha: hashSenha,
            }
        });

        response.status(201).json(usuarioCadastrado);
    }
    catch (e) {
        response.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." })
    }

});

router.post("/login", async (request, response) => {

    try {
        // Dados do login
        const info = request.body;

        // Acha o usuário com o email que vem do request
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: info.email
            }
        });

        if (!usuario) {
            return response.status(404).json({ message: "Usuário não encontrado." });
        }
        
        // Confere se a senha é a mesma
        const isMatch = await bcrypt.compare(info.senha, usuario.senha);

        if(!isMatch){            
            return response.status(400).json({ message: "Senha inválida." });
        }

        //Gerar token
        const token = jwt.sign({ id: usuario.id, cpf: usuario.cpf, abacate: 123 }, JWT_SECRET, { expiresIn: "1d"})

        response.status(200).json(token);

    }
    catch (e) {
        response.status(500).json({ message: "Erro no servidor. Tente novamente mais tarde." });
    }


});

export default router;