
import prisma from "../../config/prisma.js";
import articleSchema from "../../validators/articleValidator.js";

const createArticle = async (data, user) => {
    const validationData = articleSchema.parse(data)

    const article = await prisma.article.create({
        data:{
            title: validationData.title,
            content: validationData.content,
            slug: validationData.slug,
            author:{
                connect:{
                    id: user.id
                }
            },
            category: {
                connect:{
                    id: validationData.categoryId
                }
            },
            coverImage: validationData?.coverImage,
            status: validationData.status
        }
    })
    return article;
}

const getArticles = async () => {
    const articles = await prisma.article.findMany({
        where:{status: "PUBLISHED"},
        include:{
            author:true,
            category:true
        }
    });
    return articles;
}

const getArticleById = async (id) => {
    const article = await prisma.article.findUnique({
        where:{id},
        include:{
            author:true,
            category:true
        }
    });
    return article;
}

const getArticlesByCategory = async (categoryId) => {
    const articles = await prisma.article.findMany({
        where:{
            categoryId,
            status: "PUBLISHED"
        },
        include:{
            author:true,
            category:true
        }
    });
    return articles;
}

const getAllArticles = async () => {
    return await prisma.article.findMany({
        include: { author: true, category: true }
    });
};

const getArticlesByAuthor = async (authorId) => {
    return await prisma.article.findMany({
        where: { authorId, status: "PUBLISHED" },
        include: { author: true, category: true }
    });
};

const updateArticle = async(id, data) => {
    const validationData = articleSchema.parse(data)
    const article = await prisma.article.update({
        where:{id},
        data: validationData
    })
    return article;
}

const deleteArticle = async(id) => {
    const article = await prisma.article.delete({
        where:{id}
    })
    return article;
}
const publishArticle = async (id) => {
    return await prisma.article.update({
        where: { id },
        data: { status: "PUBLISHED" }
    });
}
const archiveArticle = async (id) => {
    return await prisma.article.update({
        where: { id },
        data: { status: "ARCHIVED" }
    });
};

export {
    createArticle,
    getArticles, 
    getArticleById, 
    getArticlesByCategory, 
    getArticlesByAuthor, 
    updateArticle, 
    deleteArticle, 
    publishArticle, 
    archiveArticle, 
    getAllArticles
};
// export default createArticle;