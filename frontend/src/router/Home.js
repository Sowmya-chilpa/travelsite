import Accordion from "../components/Accordion";
import AEMCarousel from "../components/AEMCarousel";
import Banner from "../components/Banner";
import Destinations from "../components/Destinations";
import HeroBanner from "../components/HeroBanner";


function Home() {
    return (
        <>

            <AEMCarousel />
            <HeroBanner />
            <Banner />
            <Destinations />
            <Accordion />

        </>

    )

}
export default Home;