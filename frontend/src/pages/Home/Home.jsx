import './Home.css'
import MainHeader from "../../components/MainHeader/MainHeader.jsx";
import TopHeader from "../../components/TopHeader/TopHeader.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { homeProducts } from "../../../public/data/homeProducts.js";

// Video
import heroVideo from '../../assets/videos/new-balance-video.mp4';

// Images
import womenPhoto from '../../assets/images/main-page/women.png';
import menPhoto from '../../assets/images/main-page/men.png';
import kidsPhoto from '../../assets/images/main-page/kids.png';
import product9060Photo from '../../assets/images/main-page/NB10165_HCB_SideBySide_Desktop_U9060GRY_Image_1.jpg';
import abzorb1890Photo from '../../assets/images/main-page/NB10165_SideBySide_Amine_1890_Mobile_1x1-1.jpg';


function Home() {
    const heroRef = useRef(null);
    const navigate = useNavigate();


    function handleShopNowBtn() {
        navigate("/products");
    }

    return (
        <>
            <TopHeader />
            <section ref={heroRef}
                     className="hero"
            >
                <MainHeader theme={"dark"} containerRef={heroRef}/>
                <div className="hero-content">
                    <h1>The 933</h1>

                    <p>Worn by Andrew Reynolds.</p>

                    <button onClick={handleShopNowBtn}>Shop now</button>
                </div>


                <video autoPlay muted loop id="video-background">
                    <source src={heroVideo} type="video/mp4"/>
                </video>
            </section>


            <main>
                <section className="categories">
                    <a href="#" className="category-card">
                        <img src={womenPhoto} alt="Women"/>
                        <div className="overlay"></div>
                        <h2>Women</h2>
                    </a>

                    <a href="#" className="category-card">
                        <img src={menPhoto} alt="Men"/>
                        <div className="overlay"></div>
                        <h2>Men</h2>
                    </a>

                    <a href="#" className="category-card">
                        <img src={kidsPhoto} alt="Kids"/>
                        <div className="overlay"></div>
                        <h2>Kids</h2>
                    </a>
                </section>

                <section className="grey-days">
                    <div className="grey-days-content">
                        <h2>Grey Days 2026</h2>
                        <p>
                            Grey Days is an annual celebration of everything that New Balance represents. This
                            month-long event
                            brings together our family of ambassadors and athletes for a range of special-edition
                            products, events,
                            and stories that highlight the unique and timeless qualities of the color grey.
                        </p>
                        <button>The Grey Shop</button>
                    </div>
                </section>


                <section className="product-grid">
                    {homeProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            page="home"
                        />
                    ))}
                </section>

                <section className="featured-products">
                    <div className="featured-card">
                        <img src={product9060Photo} alt="The 9060"/>

                        <div className="featured-info">
                            <h2>The 9060</h2>
                            <p>Modern expressionism.</p>
                            <button onClick={handleShopNowBtn}>Shop now</button>
                        </div>
                    </div>

                    <div className="featured-card">
                        <img src={abzorb1890Photo} alt="ABZORB 1890"/>

                        <div className="featured-info">
                            <h2>ABZORB 1890</h2>
                            <p>Worn by Aminé.</p>
                            <button onClick={handleShopNowBtn}>Shop now</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}

export default Home
