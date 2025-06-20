import React, { useState, useEffect } from 'react';
import Nav from './NavBar.js';
import Footer from './Footer.js'


const images = [
  '/images/DSC_1.JPG',
  '/images/DSC_2.JPG',
  '/images/DSC_3.JPG',
  '/images/DSC_4.JPG',
  '/images/DSC_5.JPG',
  '/images/DSC_6.JPG',
  '/images/DSC_7.JPG',
  '/images/DSC_8.JPG',
  '/images/DSC_9.JPG',
  '/images/DSC_10.JPG',
  '/images/DSC_11.JPG',

  
];

const RandomGridComponent = () => {
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    setShuffledImages(images); // No need to shuffle for this specific layout
  }, []);

  return (
    <div className='bg-black'>
      <Nav />
      <div className=" flex flex-wrap justify-center gap-6 p-4">
        {/* Image 1 */}
        <div
  className="relative bg-gray-100 rounded-2xl shadow-lg overflow-hidden group"
  style={{ width: '450px', height: '500px', marginTop: '190px', borderRadius: '40px' }}
>
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${images[2]})` }}
  />
  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
    <h2 className="text-3xl font-semibold text-white mb-2">
    {/* CREAM */}
    </h2>
    <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
    </p>
    <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* LINE */}
    </p>
  </div>
</div>


        {/* Image 2 */}
        <div
          className="relative bg-gray-100 rounded-3xl shadow-lg overflow-hidden group"
          style={{ width: '450px', height: '500px',borderRadius: '40px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[0]})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
            {/* CREAM */}
            </h2>
            <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
            </p>
            <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* LINE */}
            </p>
          </div>
        </div>

        {/* Image 3 */}
        <div
          className="relative bg-gray-100 rounded-2xl shadow-lg overflow-hidden group"
          style={{ width: '450px', height: '500px', marginTop: '100px',borderRadius: '40px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[1]})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
            {/* CREAM */}
            </h2>
            <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
            </p>
            <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* LINE */}
            </p>
          </div>
        </div>


       
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {/* Image 4 */}
        <div
          className="relative bg-gray-100 rounded-2xl shadow-lg overflow-hidden group"
          style={{ width: '450px', height: '500px', marginTop: '-6px',borderRadius: '40px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${shuffledImages[5]})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
            {/* CREAM */}
            </h2>
            <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
            </p>
            <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* LINE */}
            </p>
          </div>
        </div>

        {/* Image 5 */}
        <div
          className="relative bg-gray-100 rounded-3xl shadow-lg overflow-hidden group"
          style={{ width: '450px', height: '500px', marginTop: '-200px',borderRadius: '40px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${shuffledImages[3]})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
            {/* CREAM */}
            </h2>
            <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
            </p>
            <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* LINE */}
            </p>
          </div>
        </div>

        {/* Image 6 */}
        <div
          className="relative bg-gray-100 rounded-2xl shadow-lg overflow-hidden group"
          style={{ width: '450px', height: '500px', marginTop: '-100px',borderRadius: '40px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${shuffledImages[4]})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
            {/* CREAM */}
            </h2>
            <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
            </p>
            <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* LINE */}
            </p>
          </div>
        </div>


       
      </div>
      <div className="flex flex-wrap justify-center gap-6 p-4">
        {/* Image 7 */}
        <div
  className="relative bg-gray-100 shadow-lg overflow-hidden group"
  style={{ 
    width: '450px', 
    height: '305px', 
    marginTop: '-6px', 
    borderTopRightRadius: '35px',
    borderTopLeftRadius: '35px',
    overflow: 'hidden' // Ensure the content stays within the rounded corners
  }}
>
  <div 
    style={{ 
      width: '100%', 
      height: '100%', 
      backgroundImage: `url(${shuffledImages[5]})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }} 
  />

  <div 
    style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: '100%', 
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), black)' 
    }} 
  />

  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
    <h2 className="text-3xl font-semibold text-white mb-2">
    {/* CREAM */}
    </h2>
    <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
    </p>
    <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* LINE */}
    </p>
  </div>
</div>


        {/* Image 8 */}
        <div
  className="relative bg-gray-100 shadow-lg overflow-hidden group"
  style={{ 
    width: '450px', 
    height: '500px', 
    marginTop: '-200px', 
    borderTopRightRadius: '35px',
    borderTopLeftRadius: '35px',
    overflow: 'hidden' // Ensure the content stays within the rounded corners
  }}
>
  <div 
    style={{ 
      width: '100%', 
      height: '100%', 
      backgroundImage: `url(${shuffledImages[6]})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }} 
  />

  <div 
    style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: '100%', 
      background: 'linear-gradient(to bottom,transparent, black)' 
    }} 
  />

  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
    <h2 className="text-3xl font-semibold text-white mb-2">
    {/* CREAM */}
    </h2>
    <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
    </p>
    <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* LINE */}
    </p>
  </div>
</div>


        {/* Image 9 */}
        <div
  className="relative bg-gray-100 shadow-lg overflow-hidden group"
  style={{ 
        width: '450px', 
        height: '400px', 
        marginTop: '-100px', 
        borderTopRightRadius: '35px',
        borderTopLeftRadius: '35px',
        overflow: 'hidden' // Ensure the content stays within the rounded corners
      }}
>
  <div 
    style={{ 
      width: '100%', 
      height: '100%', 
      backgroundImage: `url(${shuffledImages[7]})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }} 
  />

  <div 
    style={{ 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: '100%', 
      background: 'linear-gradient(to bottom,transparent, black)' 
    }} 
  />

  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
    <h2 className="text-3xl font-semibold text-white mb-2">
    {/* CREAM */}
    </h2>
    <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
    </p>
    <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* LINE */}
    </p>
  </div>
</div>
       
      </div>
      <h1 className='text-white text-center text-6xl my-20'>Winners</h1>
      <div className='flex flex-row'>
  <div className='flex flex-col'>  
     <div
  className="relative bg-gray-100 rounded-2xl mt-20 mx-20 shadow-lg overflow-hidden group"
  style={{ width: '800px', height: '500px', borderRadius: '40px' }}
>
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${shuffledImages[8]})` }}
  />
  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
    <h2 className="text-3xl font-semibold text-white mb-2">
    {/* CREAM */}
    </h2>
    <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
    </p>
    <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* LINE */}
    </p>
  </div>
  
  </div>
  <div
  className="relative bg-gray-100 rounded-2xl  ml-20 mt-10 mb-10 shadow-lg overflow-hidden group"
  style={{ width: '800px', height: '500px', borderRadius: '40px' }}
>
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${shuffledImages[10]})` }}
  />
  <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
    <h2 className="text-3xl font-semibold text-white mb-2">
    {/* CREAM */}
    </h2>
    <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
    </p>
    <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {/* LINE */}
    </p>
  </div>
  
  </div></div>
  <div
          className="relative bg-gray-100 rounded-2xl shadow-lg overflow-hidden group"
          style={{ width: '514px', height: '1020px', marginTop: '100px',borderRadius: '40px' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${shuffledImages[9]})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-500 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
            {/* CREAM */}
            </h2>
            <p className="text-lg text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* [PRO] SMART OBJECT LAYERS PHOTOSHOP */}
            </p>
            <p className="text-md text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {/* LINE */}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default RandomGridComponent;
