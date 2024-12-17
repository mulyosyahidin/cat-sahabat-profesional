import { Head, usePage } from "@inertiajs/react";

export default function BknLayout({ header, title = 'SIMULASI CAT', children, ...props }) {
    const user = usePage().props.auth.user;

    return (
        <>
            <Head title={title} />

            <div {...props}>
                <div className="flex flex-wrap w-full bg-[#E3DEFE] h-[130px] border-b-2 border-[#BDC2FD]">
                    <div
                        className="w-full sm:w-1/2 p-8"
                        style={{
                            backgroundImage: "url(/assets/bkn/images/bg-head.png)",
                            backgroundPosition: "right",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="flex gap-2">
                            <img src="/assets/images/logo-baris.png" alt="Logo" className="w-80"/>
                        </div>
                    </div>

                    <div
                        className="w-full sm:w-1/2"
                        style={{
                            backgroundImage: "url(/assets/bkn/images/top-bg.jpg)",
                            backgroundPosition: "left",
                            backgroundRepeat: "repeat",
                        }}
                    >
                    </div>
                </div>

                <div className="w-full p-5">{children}</div>

                {/*<div className="fixed bottom-0 w-full text-center bg-[#BDC2FD] py-2 hidden lg:block">*/}
                {/*    <h5 className="text-dark-50">CAT SAHABAT KARIR</h5>*/}
                {/*</div>*/}
            </div>
        </>
    );
}
