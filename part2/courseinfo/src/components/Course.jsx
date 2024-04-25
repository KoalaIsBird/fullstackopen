const Header = ({ course }) => {
    return (
        <h1>{course.name}</h1>
    )
}


const Part = ({ name, exercises }) => {
    return (
        <p>{name} {exercises}</p>
    )
}


const Content = ({ course }) => (
    <div>
        {course.parts.map(part =>
            <Part
                key={part.id}
                name={part.name}
                exercises={part.exercises}
            />)}
    </div>
)


const Total = ({ course }) => (
    <p><b>
        Number of exercises {course.parts.reduce(
            (acc, part) => acc + part.exercises,
            0)}
    </b></p>
)


const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}


export default Course