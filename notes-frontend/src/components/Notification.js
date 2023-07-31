import './Notification.css'

const Notification = ({ errorMessage }) => {
  const showError = errorMessage === null ? 'hide' : 'visible' 

  return (
    <div className={showError}>
      <p>{errorMessage}</p>
    </div>
  )
}

export default Notification
