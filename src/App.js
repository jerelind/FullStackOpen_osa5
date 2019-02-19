import React from 'react'
import blogService from './services/blogs'
import Blog from './components/Blog'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      newTitle: '',
      newAuthor: '',
      newUrl: '',
      user: null,
      username: '',
      password: '',
      error: null
    }
  }

  componentWillMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({user})
      blogService.setToken(user.token)
    }
  }
  
  handleLoginFieldChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  login = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({username: '', password: '', user})
    } catch(exception) {
      this.setState({
        error: 'Käyttäjätunnus tai salasana on virheellinen'
      })
      setTimeout(() => {
        this.setState({error: null})
      }, 5000)
    }
  }

  logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogUser')
    this.setState({
      user: null
    })
  }

  addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: this.state.newTitle,
      author: this.state.newAuthor,
      url: this.state.newUrl
    }

    blogService
      .create(blogObject)
      .then(newBlog => {
        this.setState({
          blogs: this.state.blogs.concat(newBlog),
          newTitle: '',
          newAuthor: '',
          newUrl: '',
          error: `A blog ${blogObject.title} by ${blogObject.author} added!` 
        })
        setTimeout(() => {
          this.setState({error: null})
        }, 5000)
      })
  }

  handleTitleChange = (event) => {
    this.setState({newTitle: event.target.value})
  }

  handleAuthorChange = (event) => {
    this.setState({newAuthor: event.target.value})
  }

  handleUrlChange = (event) => {
    this.setState({newUrl: event.target.value})
  }

  render() {

    const loginForm = () => (
      <Togglable buttonLabel="Login here">
        <LoginForm
          visible={this.state.visible}
          username={this.state.username}
          password={this.state.password}
          handleChange={this.handleLoginFieldChange}
          handleSubmit={this.login}
        />
      </Togglable>
    )

    const createBlogForm = () => (
      <Togglable buttonLabel="Add Blog">
        <BlogForm
          onSubmit={this.addBlog}
          handleTitle={this.handleTitleChange}
          handleAuthor={this.handleAuthorChange}
          handleUrl={this.handleUrlChange}
          title={this.state.blogs.title}
          author={this.state.blogs.author}
          url={this.state.blogs.url}
        />
      </Togglable>
    )

    return (
      <div>
        <h1>Blog App</h1>

        <Notification message={this.state.error}/>

        {this.state.user === null ?
          loginForm() :
          <div>
            <p>Logged in as {this.state.user.username} <button onClick={this.logout}>Logout</button></p>
            {this.state.blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
            <br/>
            {createBlogForm()}
          </div>
        }
      </div>
    );
  }
}

export default App
