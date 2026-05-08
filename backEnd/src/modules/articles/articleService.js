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

export default createArticle;