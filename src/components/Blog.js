import React from 'react'

const Blog = ({blog}) => (
  <div>
    {blog.title} <i>by</i> {blog.author}
  </div>  
)

export default Blog