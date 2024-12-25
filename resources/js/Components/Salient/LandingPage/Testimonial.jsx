import {Container} from "@/Components/Salient/Container.jsx";

export default function Testimonial() {
   return (
       <section
           id="testimonial"
           className="relative overflow-hidden pb-28 pt-20 sm:py-32"
       >
           <Container className="relative">
               <div className="max-w-2xl md:mx-auto text-center xl:max-w-none">
                   <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl md:text-5xl">
                       Apa Kata Sobat Karir?
                   </h2>
               </div>

               <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                   <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                       <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                           <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                               <blockquote className="text-gray-900">
                                   <p>
                                       Sangat enjoy dan senang belajar di bimbel Sahabat Karir tidak membuat bosan
                                       karena tentornya semua menghidupkan suasana kelas
                                   </p>
                               </blockquote>
                               <figcaption className="mt-6 flex items-center gap-x-4">
                                   <img alt="" src="/assets/images/t-1.png"
                                        className="h-16 w-16 rounded-full bg-gray-50"/>
                                   <div>
                                       <div className="font-semibold text-gray-900">Febby Putri</div>
                                   </div>
                               </figcaption>
                           </figure>
                       </div>

                       <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                           <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                               <blockquote className="text-gray-900">
                                   <p>
                                       Belajar di bimbel Sahabat Karir sangat membantu memahami materi dengan mudah. Metodenya kreatif dan tentornya sabar dalam menjelaskan
                                   </p>
                               </blockquote>
                               <figcaption className="mt-6 flex items-center gap-x-4">
                                   <img alt="" src="/assets/images/t-2.png"
                                        className="h-16 w-16 rounded-full bg-gray-50"/>
                                   <div>
                                       <div className="font-semibold text-gray-900">Nia Ramadhani</div>
                                   </div>
                               </figcaption>
                           </figure>
                       </div>

                       <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                           <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                               <blockquote className="text-gray-900">
                                   <p>
                                       Saya merasa lebih percaya diri setelah belajar di sini. Pendekatan personal dari tentornya membuat suasana belajar lebih menyenangkan dan fokus!
                                   </p>
                               </blockquote>
                               <figcaption className="mt-6 flex items-center gap-x-4">
                                   <img alt="" src="/assets/images/t-3.png"
                                        className="h-16 w-16 rounded-full bg-gray-50"/>
                                   <div>
                                       <div className="font-semibold text-gray-900">Rio Ferdinan</div>
                                   </div>
                               </figcaption>
                           </figure>
                       </div>
                   </div>
               </div>
           </Container>
       </section>
   )
}
