import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
  return(
    <div>
      <h2>{props.course}</h2>
    </div>
  )
}

const Course = (props) => {
  return(
    <div>
      <p>
      {props.parts.map(function(content){
         return (
         <li 
            key={content.id}>{content.name} {content.exercises}
         </li>)
      })}
      </p>
      
    </div>
  )
}

const Total = (props) => {
  return(
    <div>
      <p><strong>Number of exercises {props.total}</strong></p>
    </div>
  )
}

const App = () => {

  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ];

  const sum = (items, prop) => {
    return items.reduce((a, b) => {
      return a + b[prop];
    }, 0);
  }

  return (
    <div>
      <h1>Webdevelopment curriculum</h1>
      {courses.map(course => {
        return(
          <Fragment key={course.id}>
            <Header course={course.name} />
            <Course parts={course.parts} />
            <Total total={sum(course.parts, 'exercises')} />
          </Fragment>
          )
        })}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
