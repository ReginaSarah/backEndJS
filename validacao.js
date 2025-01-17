import Joi from "joi";

export const modeloPessoa = Joi.object({
    id: Joi.number().required(),
    nome: Joi.string().required(),
    idade: Joi.number().min(18),
    cpf: Joi.string().min(11).required(),
}).min(1);

export const modeloPessoaSalvamento = Joi.object({
    nome: Joi.string().required(),
    idade: Joi.number().min(18),
    cpf: Joi.string().min(11).required(),
}).min(2);
