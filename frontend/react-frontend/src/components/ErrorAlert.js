import Alert from 'react-bootstrap/Alert'


const Alerts = ({AlertToggle, AlertText}) => {

    if(AlertToggle == false){
        return null
    }
    return(
        <Alert variant={AlertText.style}>
        {AlertText.message}
        </Alert>
    )
}

export default Alerts