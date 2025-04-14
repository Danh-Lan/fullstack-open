const Notification = ({ message, type }) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    margin: 10
  };

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    margin: 10
  };

  if (message === null) {
    return null;
  }

  if (type !== 'success' && type !== 'error') {
    console.error('Invalid notification type. Please check the code and use "success" or "error".');
    return null;
  }

  const notificationStyle = type === 'success' ? successStyle : errorStyle;

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
}

export default Notification;