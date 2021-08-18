import { Spinner } from "react-bootstrap";



const LoadingSpinner = () => {
    return (
        <div className="text-center mt-3">
                <Spinner animation="border" role="status" variant="light">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
        </div>
    );
}

export default LoadingSpinner;