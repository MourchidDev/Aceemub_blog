import createArticle from "./articleService.js";

const createArticleController = async (req, res, next) => {
    try {
        const user = req.user ?? {id: "1d257d43-47ec-4b9e-8f47-62681347fa65"};
        const article = await createArticle(req.body, user);
        res.status(201).json(article);
    } catch (error) {
        next (error);
    }
}

export default createArticleController;