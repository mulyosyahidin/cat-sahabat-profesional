import { Head, Link } from '@inertiajs/react';
import {Header} from "@/Components/Salient/Header";
import {Hero} from "@/Components/Salient/Hero";

export default function Welcome({ auth }) {
    return (
        <>
            <Header />

            <main>
                <Hero />
            </main>
        </>
    )
}
