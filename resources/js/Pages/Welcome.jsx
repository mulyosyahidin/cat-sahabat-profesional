import { Head, Link } from '@inertiajs/react';
import {Header} from "@/Components/Salient/Header";
import {Hero} from "@/Components/Salient/LandingPage/Hero";
import Keunggulan from "@/Components/Salient/LandingPage/Keunggulan.jsx";
import PaketBelajar from "@/Components/Salient/LandingPage/PaketBelajar.jsx";
import Testimonial from "@/Components/Salient/LandingPage/Testimonial.jsx";
import Footer from "@/Components/Salient/LandingPage/Footer.jsx";

export default function Welcome({ auth }) {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <Keunggulan />
                <PaketBelajar />
                <Testimonial />
            </main>

            <Footer />
        </>
    )
}
