const Header = ({ name }) => <h1>{name}</h1>

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <p key={part.id}>
        {part.name} {part.exercises}
      </p>
    ))}
  </div>
)

const Total = ({ total }) => <p><b>total of {total} exercises</b></p>

const Course = ({ courses }) => {
  const calculateTotalExercises = (course) => course.parts.reduce((sum, part) => {
    return sum + part.exercises
  }, 0);
  
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <div key={course.id}>
          <Header name={course.name} />
          <Content parts={course.parts} />
          <Total total={calculateTotalExercises(course)} />
        </div>
      ))}
    </div>
  )
};

export default Course;