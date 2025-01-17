import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// middleware - requisição, resposta, e uma confirmação de continuação
const auth = (request, response, next) => {

    const token = request.headers.authorization || request.body.token || request.query.token;

    if(!token) {
        return response.status(401).json({ message: "Acesso negado" });
    }
    
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        request.usuarioId = decoded.id;
        request.usuarioCpf = decoded.cpf;
        next();
    }
    catch(e){
        return response.status(401).json({ message: "Token inválido" });
    }
    
}

export default auth;