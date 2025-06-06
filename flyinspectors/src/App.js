import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { HelmetProvider } from 'react-helmet-async';
import Footer from "./components/Common/Footer/Footer";
import Header from "./components/Common/Header/Header";
import Main from "./Pages/Main/Main";
import SubmitClaim from "./Pages/SubmitClaim/SubmitClaim";
import FlightDelay from "./Pages/FlightDelay/FlightDelay";
import FlightCancellation from "./Pages/FlightCancellation/FlightCancellation";
import OverBooked from "./Pages/OverBookedFlight/OverBooked";
import MissedConnection from "./Pages/MissedConnection/MissedConnection";
import LostLuggage from "./Pages/LostLuggage/LostLuggage";
import AdminPanel from "./Pages/AdminPanel/AdminPanel";
import AboutUs from "./Pages/About Us/AboutUs";
import BlogPage from "./Pages/Blog page/BlogPage";
import FaqPage from "./Pages/FAQ page/FaqPage";
import ContactUs from "./Pages/Contact Us/ContactUs";
import BlogPageMore from "./Pages/BlogPageMore/BlogPageMore";
import ScrollToTop from "./ScrollToTop"; // Import the ScrollToTop component
import "./i18n/i18n";
import TermsAndConditions from "./Pages/TermsAndConditions/TermsAndConditions";
import BlogPageMoreAirports from "./Pages/BlogPageMore Airports/BlogPageMore";
import BlogPageMorePets from "./Pages/BlogPageMore Pets/BlogPageMorePets";
import BlogPageMorePilots from "./Pages/BlogPageMore Pilots/BlogPageMorePilots";
import SignaturePage from "./Pages/Signature/Signature";

function App() {

  return (
    <HelmetProvider>
      <ScrollToTop /> {/* Add ScrollToTop */}
      <Header />
      <Routes>
        <Route path={"/"} element={<Main />} />
        <Route path={"/signature"} element={<SignaturePage />} />
        <Route path={"/submit-claim"} element={<SubmitClaim />} />
        <Route path={"/your-rights/flight-delay"} element={<FlightDelay />} />
        <Route
          path={"/your-rights/flight-cancellation"}
          element={<FlightCancellation />}
        />
        <Route
          path={"/your-rights/overbooked-flight"}
          element={<OverBooked />}
        />
        <Route
          path={"/your-rights/missed-connection"}
          element={<MissedConnection />}
        />
        <Route path={"/your-rights/lost-luggage"} element={<LostLuggage />} />
        <Route path={"/about-us"} element={<AboutUs />} />
        <Route path={"/about-us/blog"} element={<BlogPage />} />
        <Route path={"/about-us/faq"} element={<FaqPage />} />
        <Route path={"/about-us/blog-page-more"} element={<BlogPageMore />} />
        <Route
          path={"/about-us/blog-page-more-airports"}
          element={<BlogPageMoreAirports />}
        />
        <Route path={"/about-us/blog-page-more-pets"} element={<BlogPageMorePets/>} />
        <Route path={"/about-us/blog-page-more-pilots"} element={<BlogPageMorePilots/>} />
        <Route path={"/contact-us"} element={<ContactUs />} />
        <Route
          path={"/terms-and-conditions"}
          element={<TermsAndConditions />}
        />

        <Route path={"/adminpanel/*"} element={<AdminPanel />} />
        <Route path={"/*"} element={<Main />} />
      </Routes>
      <Footer />
    </HelmetProvider>
  );
}

export default App;