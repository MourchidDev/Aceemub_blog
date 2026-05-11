import { tr } from "zod/v4/locales";
import createArticle from "./articleService.js";
import getArticles from "./articleService.js";
import getArticleById from "./articleService.js";
import getArticlesByCategory from "./articleService.js";
import getAllArticles from "./articleService.js";
import getArticlesByAuthor from "./articleService.js";
import updateArticle from "./articleService.js";
import deleteArticle from "./articleService.js";
import publishArticle  from "./articleService.js";
import archiveArticle  from "./articleService.js";
const createArticleController = async (req, res, next) => {
    try {
        const user = req.user ?? {id: "1d257d43-47ec-4b9e-8f47-62681347fa65"};
        const article = await createArticle(req.body, user);
        res.status(201).json(article);
    } catch (error) {
        next (error);
    }
}

const getArticlesController = async (req, res, next) => {
    try {
        const articles = await getArticles();
        res.json(articles);
    } catch (error) {
        next(error);
    }
}
const getArticleByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await getArticleById(id);
        res.json(article);
    } catch (error) {
        next(error);
    }
}

const getArticlesByCategoryController = async (req, res, next) => {
    try{
        const { categoryId } = req.params;
        const articles = await getArticlesByCategory(categoryId);
        res.json(articles);
    }catch(error){
        next(error);
    }
}

const getAllArticlesController = async (req, res, next ) => {
    try {
        const articles = await getAllArticles();
        res.json(articles);
    } catch (error) {
        next(error);
    }
}

const getArticlesByAuthorController = async(req, res, next) =>{
    try{
        const {authorId} = req.params;
        const articles = await getArticlesByAuthor(authorId);
        res.json(articles);
    }
    catch(error){
        next(error);
    }
}

const updateArticleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await updateArticle(id, req.body);
        res.json(article);
    } catch (error) {
        next(error);
    }
}

const deleteArticleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await deleteArticle(id);
        res.json(article);
    } catch (error) {
        next(error);
    }
}

const publishArticleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await publishArticle(id);
        res.json(article);
    } catch (error) {
        next(error);
    }
}

const archiveArticleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await archiveArticle(id);
        res.json(article);
    } catch (error) {
        next(error);
    }
}

export default {
    getArticlesController,
    getArticleByIdController,
    getArticlesByCategoryController,
    getAllArticlesController,
    getArticlesByAuthorController,
    updateArticleController,
    deleteArticleController,
    publishArticleController,
    archiveArticleController,
    createArticleController
};