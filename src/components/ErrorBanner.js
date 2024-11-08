import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function ErrorBanner({ data }) {
    return (
        <div className="text-center my-5">
            <h1>{data.title}</h1>
            <p>{data.content}</p>
            <Link to={data.destination}>
                <Button variant="primary">{data.buttonLabel}</Button>
            </Link>
        </div>
    );
}
