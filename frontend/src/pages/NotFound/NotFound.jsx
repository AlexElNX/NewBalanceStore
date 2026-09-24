import styles from './NotFound.module.css';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className={styles.notFoundWrapper}>
            <div className={styles.content}>
                <span className={styles.errorCode}>404</span>
                <h1 className={styles.title}>Page not found</h1>
                <p className={styles.description}>
                    Sorry, we couldn’t find the page you’re looking for. It might have been moved or removed.
                </p>
                <div className={styles.actions}>
                    <Link to="/" className={styles.homeBtn}>
                        Back to Home
                    </Link>
                    <Link to="/cart" className={styles.cartBtn}>
                        View Cart
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;