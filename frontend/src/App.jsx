import './styles/App.css'
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Products from "./pages/Products/Products.jsx";
import Product from "./pages/Product/Product.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Login from "./pages/Login/Login.jsx";
import Admin from "./pages/Admin/Admin/Admin.jsx";
import AddProduct from "./pages/Admin/AddProduct/AddProduct.jsx";
import ManageProducts from "./pages/Admin/ManageProducts/ManageProducts.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import ContactUs from "./pages/FooterLinks/Help/ContactUs/ContactUs.jsx";
import StartAReturn from "./pages/FooterLinks/Help/StartAReturn/StartAReturn.jsx";
import TrackYourOrder from "./pages/FooterLinks/Help/TrackYourOrder/TrackYourOrder.jsx";
import BecomeAMember from "./pages/FooterLinks/Help/BecomeAMember/BecomeAMember.jsx";
import SizeGuide from "./pages/FooterLinks/Help/SizeGuide/SizeGuide.jsx";
import FAQ from "./pages/FooterLinks/Help/FAQ/FAQ.jsx";
import FindAStore from "./pages/FooterLinks/Shop/FindAStore/FindAStore.jsx";
import GiftCards from "./pages/FooterLinks/Shop/GiftCards/GiftCards.jsx";
import ShippingInformation from "./pages/FooterLinks/Shop/ShippingInformation/ShippingInformation.jsx";
import SaleExclusions from "./pages/FooterLinks/Shop/SaleExclusions/SaleExclusions.jsx";
import MedicalPlanInformation from "./pages/FooterLinks/AboutUs/MedicalPlanInformation/MedicalPlanInformation.jsx";
import IdeaSubmission from "./pages/FooterLinks/ForYou/IdeaSubmission/IdeaSubmission.jsx";
import AffiliateProgram from "./pages/FooterLinks/ForYou/AffiliateProgram/AffiliateProgram.jsx";
import AccessibilityStatement from "./pages/FooterLinks/ForYou/AccessibilityStatement/AccessibilityStatement.jsx";
import CounterfeitProducts from "./pages/FooterLinks/ForYou/CounterfeitProducts/CounterfeitProducts.jsx";
import SpecialDiscounts from "./pages/FooterLinks/ForYou/SpecialDiscounts/SpecialDiscounts.jsx";
import Account from "./pages/Account/Account.jsx";
import AccountRoute from "./components/ProtectedRoutes/AccountRoute.jsx";
import AdminRoute from "./components/ProtectedRoutes/AdminRoute.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import GlobalLoading from "./components/LoadingOverlay/GlobalLoading.jsx";
import InfoPage from "./pages/Info/InfoPage.jsx";
import { INFO_PAGES } from "./pages/Info/infoPages.jsx";

function App() {

    return (<>
        <ScrollToTop/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/product/:id" element={<Product/>}/>
            <Route path="/admin" element={<AdminRoute>
                <Admin/>
            </AdminRoute>}/>
            <Route path="/add-product" element={<AdminRoute>
                <AddProduct/>
            </AdminRoute>}/>
            <Route path="/manage-products" element={<AdminRoute>
                <ManageProducts/>
            </AdminRoute>}/>
            <Route path="/edit-product/:id" element={<AdminRoute>
                <AddProduct key="edit"/>
            </AdminRoute>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/help" element={<ContactUs/>}/>
            <Route path="/returns" element={<StartAReturn/>}/>
            <Route path="/order-status" element={<TrackYourOrder/>}/>
            <Route path="/size-guide" element={<SizeGuide/>}/>
            <Route path="/membership" element={<BecomeAMember/>}/>
            <Route path="/faqs" element={<FAQ/>}/>
            <Route path="/stores" element={<FindAStore/>}/>
            <Route path="/giftcards" element={<GiftCards/>}/>
            <Route path="/shipping" element={<ShippingInformation/>}/>
            <Route path="/sale-exclusions" element={<SaleExclusions/>}/>
            <Route path="/medical-plan-information" element={<MedicalPlanInformation/>}/>
            <Route path="/idea-submission" element={<IdeaSubmission/>}/>
            <Route path="/affiliate" element={<AffiliateProgram/>}/>
            <Route path="/accessibility-statement" element={<AccessibilityStatement/>}/>
            <Route path="/counterfeit" element={<CounterfeitProducts/>}/>
            <Route path="/special-discounts" element={<SpecialDiscounts/>}/>
            <Route path="/account" element={<AccountRoute>
                <Account/>
            </AccountRoute>}/>

            {INFO_PAGES.map(page => (
                <Route key={page.slug} path={`/${page.slug}`} element={<InfoPage slug={page.slug}/>}/>
            ))}

            <Route path="*" element={<NotFound/>}/>

        </Routes>
        <GlobalLoading/>
    </>)
}

export default App