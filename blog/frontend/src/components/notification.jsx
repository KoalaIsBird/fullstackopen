const Notification = ({ message, color }) => {
    if (message === null) {
        return null
    }

    const style = {
        backgroundColor: 'lightGrey',
        color: color,
        border: '3px solid',
        borderRadius: '5px',
        padding: '10px'
    }

    return (
        <div style={style}>
            <p>{message}</p>
        </div>
    )
}

export default Notification