import React from 'react'

const BlogForm = ({onSubmit, handleTitle, handleAuthor, handleUrl, title, author, url}) => {
    return(
    <div>
        <h2>Create a new blog</h2>

        <form onSubmit={onSubmit}>
          <div>
            Title: <input
            value={title}
            onChange={handleTitle}
            />
          </div>
          <div>
            Author: <input
            value={author}
            onChange={handleAuthor}
            />
          </div>
          <div>
            URL: <input
            value={url}
            onChange={handleUrl}
            />
          </div>
          <button type="submit">Create blog</button>
        </form>
    </div>
    )
}

export default BlogForm