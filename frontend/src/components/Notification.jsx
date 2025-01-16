const Notification = ({ message, messageType }) => {

    if (message === null) {
        return null
    }
    if (messageType === "success") {
        return (
            <div className="success">
                {message}
            </div>
        )
    } if (messageType === "error") {
        return (
            <div className="error">
                {message}
            </div>
        )
    } else {
        return (
            <div className="default">
                {message}
            </div>
        )
    }
    
}

export default Notification