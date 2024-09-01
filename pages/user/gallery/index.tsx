import React from 'react'
import dynamic from 'next/dynamic'
function index() {
  const Navbar=dynamic(()=>import('../../components/Navbar'),{ssr:false})
  return (
   <>
   <Navbar/>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:mt-36 lg:ml-52 w-[80%]">
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg" alt=""/>
        </div>
    </div>
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg" alt=""/>
        </div>
    </div>
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg" alt=""/>
        </div>
    </div>
    <div className="grid gap-4">
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg" alt=""/>
        </div>
        <div>
            <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg" alt=""/>
        </div>
    </div>
</div>

   
   </>
  )
}

export default index