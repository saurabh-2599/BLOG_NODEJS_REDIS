exports.hashForBlogs = () => {
    return `Blogs`
}

exports.hashForUserBlog = (userId) => {
    return `${userId}->myBlogs`
}

exports.hashForBlogDetails = (blogId) => {
    return `${blogId}->Blogs`
}

exports.hashForCommentOnBlog = (blogId) => {
    return `${blogId}->Comments`
}

exports.hashForVotesOnBlog = (blogId) => {
    return `${blogId}->Votes`
}

exports.hashForCommentReplies = (commentId) => {
    return `${commentId}->Replies`
}