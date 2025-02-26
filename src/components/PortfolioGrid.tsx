import { useState, useMemo, useEffect, useRef } from 'react'; 
import { Dialog } from '@headlessui/react'; 
import { X, Star, ShoppingCart, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'; 
import type { PortfolioItem, PortfolioCategory } from '../lib/portfolio.types'; 
import { useStore } from '../lib/store'; 
import { toast } from 'react-hot-toast'; 
import ConsultationButton from './ConsultationButton';

interface PortfolioGridProps { 
  items: PortfolioItem[]; 
  categories: PortfolioCategory[]; 
  onSwitchToProducts: () => void; 
} 
 
export function PortfolioGrid({ items, categories, onSwitchToProducts }: PortfolioGridProps) { 
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null); 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [isScrolled, setIsScrolled] = useState(false); 
  const [showFloatingSwitch, setShowFloatingSwitch] = useState(false); 
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); 
  const [imagesLoading, setImagesLoading] = useState(false); 
  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({}); 
  const { addToCart } = useStore(); 
 
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category_id === selectedCategory) 
    : items; 
 
  // Sort categories by display_order 
  const sortedCategories = [...categories].sort((a, b) => a.display_order - b.display_order); 
   
  // Handle scroll for floating switch 
  useEffect(() => { 
    const handleScroll = () => { 
      const portfolioSection = document.getElementById('portfolio-section'); 
      const orderSection = document.getElementById('order-section'); 
       
      if (portfolioSection && orderSection) { 
        const portfolioTop = portfolioSection.getBoundingClientRect().top; 
        const portfolioBottom = portfolioSection.getBoundingClientRect().bottom; 
        const orderTop = orderSection.getBoundingClientRect().top; 
         
        // Show floating switch when portfolio is in view but not at the top 
        // and hide it when order section comes into view 
        setIsScrolled(window.scrollY > 100); 
         
        // Show floating switch when: 
        // 1. We've scrolled past the top of the portfolio section 
        // 2. We haven't reached the bottom of the portfolio section yet 
        // 3. The order section is not yet visible 
        const shouldShowFloating =  
          portfolioTop < 0 &&  
          portfolioBottom > window.innerHeight * 0.5 &&  
          orderTop > window.innerHeight; 
           
        setShowFloatingSwitch(shouldShowFloating); 
      } 
    }; 
 
    window.addEventListener('scroll', handleScroll); 
    return () => window.removeEventListener('scroll', handleScroll); 
  }, []); 
 
  // Preload images 
  const preloadImages = (imageUrls: string[]) => { 
    if (imageUrls.length === 0) return; 
     
    // Show loading indicator 
    setImagesLoading(true); 
     
    // Track the number of loaded images 
    let loadedCount = 0; 
    const totalImages = imageUrls.length; 
    const newLoadedImages = { ...loadedImages }; 
     
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log("Loading images timeout reached");
      setImagesLoading(false);
    }, 10000); // 10 seconds timeout
     
    imageUrls.forEach(url => { 
      // Skip video URLs for preloading
      if (isVideo(url)) {
        loadedCount++;
        newLoadedImages[url] = true;
        
        // Check if all media are loaded
        if (loadedCount === totalImages) {
          clearTimeout(loadingTimeout);
          setImagesLoading(false);
          setLoadedImages(newLoadedImages);
        }
        return;
      }
      
      // If the image is already loaded, don't load it again 
      if (loadedImages[url]) { 
        loadedCount++; 
        // Check if all images are loaded 
        if (loadedCount === totalImages) { 
          clearTimeout(loadingTimeout);
          setImagesLoading(false); 
        } 
        return; 
      } 
       
      const img = new Image(); 
       
      img.onload = () => { 
        loadedCount++; 
        newLoadedImages[url] = true; 
         
        // When all images are loaded, update the state 
        if (loadedCount === totalImages) { 
          clearTimeout(loadingTimeout);
          setImagesLoading(false); 
          setLoadedImages(newLoadedImages); 
        } 
      }; 
       
      img.onerror = () => { 
        console.error(`Failed to load image: ${url}`);
        loadedCount++; 
        newLoadedImages[url] = false; // Mark as failed to load
        // Even if the image is not loaded, we still consider it processed 
        if (loadedCount === totalImages) { 
          clearTimeout(loadingTimeout);
          setImagesLoading(false); 
          setLoadedImages(newLoadedImages);
        } 
      }; 
       
      img.src = url; 
    }); 
    
    // Return cleanup function
    return () => clearTimeout(loadingTimeout);
  }; 
 
  // Preload images for the current category 
  useEffect(() => { 
    const allImages = filteredItems.flatMap(item => item.images); 
    preloadImages(allImages); 
  }, [filteredItems]); 
 
  // Reset the current image index when a new item is selected 
  useEffect(() => { 
    setCurrentImageIndex(0); 
  }, [selectedItem]); 
 
  const touchStartX = useRef<number | null>(null); 
  const touchEndX = useRef<number | null>(null); 
  const touchThreshold = 50; // Minimum distance for swipe in pixels 
  const [swipeAnimation, setSwipeAnimation] = useState<'left' | 'right' | null>(null); 
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null); 
 
  // Handler for changing images with animation 
  const changeImage = (direction: 'next' | 'prev') => { 
    if (!selectedItem) return; 
     
    // Set the direction for animation 
    setSlideDirection(direction); 
     
    // Change the index with a small delay for animation 
    setTimeout(() => { 
      if (direction === 'next') { 
        setCurrentImageIndex(prev =>  
          prev === selectedItem.images.length - 1 ? 0 : prev + 1 
        ); 
      } else { 
        setCurrentImageIndex(prev =>  
          prev === 0 ? selectedItem.images.length - 1 : prev - 1 
        ); 
      } 
       
      // Reset the animation direction after the transition is complete 
      setTimeout(() => { 
        setSlideDirection(null); 
      }, 300); 
    }, 150); 
  }; 
 
  // Directly switch to a specific index with animation 
  const jumpToImage = (index: number) => { 
    if (!selectedItem) return; 
     
    // Determine the direction for the correct animation 
    const currentIndex = currentImageIndex; 
    const totalImages = selectedItem.images.length; 
     
    // Calculate the shortest direction 
    let direction: 'next' | 'prev'; 
     
    if (index > currentIndex) { 
      // Check which path is shorter: forward or through the beginning of the list 
      const forwardDistance = index - currentIndex; 
      const backwardDistance = currentIndex + (totalImages - index); 
      direction = forwardDistance <= backwardDistance ? 'next' : 'prev'; 
    } else { 
      // Check which path is shorter: backward or through the end of the list 
      const backwardDistance = currentIndex - index; 
      const forwardDistance = index + (totalImages - currentIndex); 
      direction = backwardDistance <= forwardDistance ? 'prev' : 'next'; 
    } 
     
    // Set the direction for animation 
    setSlideDirection(direction); 
     
    // Change the index with a small delay for animation 
    setTimeout(() => { 
      setCurrentImageIndex(index); 
       
      // Reset the animation direction after the transition is complete 
      setTimeout(() => { 
        setSlideDirection(null); 
      }, 300); 
    }, 150); 
  }; 
 
  // Swipe handlers 
  const handleTouchStart = (e: React.TouchEvent) => { 
    touchStartX.current = e.touches[0].clientX; 
  }; 
 
  const handleTouchMove = (e: React.TouchEvent) => { 
    touchEndX.current = e.touches[0].clientX; 
     
    // Add visual feedback when swiping 
    if (touchStartX.current && touchEndX.current) { 
      const distance = touchEndX.current - touchStartX.current; 
      if (Math.abs(distance) > 20) { // Small threshold to start animation 
        setSwipeAnimation(distance > 0 ? 'right' : 'left'); 
      } 
    } 
  }; 
 
  const handleTouchEnd = () => { 
    if (!touchStartX.current || !touchEndX.current || !selectedItem) return; 
     
    const distance = touchEndX.current - touchStartX.current; 
     
    // If the swipe was long enough 
    if (Math.abs(distance) > touchThreshold) { 
      if (distance > 0) { 
        // Swipe to the right - previous image 
        changeImage('prev'); 
      } else { 
        // Swipe to the left - next image 
        changeImage('next'); 
      } 
    } 
     
    // Reset positions and animation 
    touchStartX.current = null; 
    touchEndX.current = null; 
    setSwipeAnimation(null); 
  }; 
 
  // Convert PortfolioItem to Product for adding to cart 
  const convertPortfolioItemToProduct = (item: PortfolioItem) => { 
    return { 
      id: item.id, 
      name: item.name, 
      description: item.description, 
      composition: item.composition, 
      price: item.price, 
      image_url: item.images[0], 
      additional_images: item.images.slice(1), 
      category_id: item.category_id, 
      tags: item.tags, 
      weight_kg: item.weight_kg, 
      is_custom_order: false, 
      created_at: item.created_at, 
      updated_at: item.updated_at 
    }; 
  }; 
 
  // Function to add an item to the cart 
  const handleAddToCart = (item: PortfolioItem) => { 
    const product = convertPortfolioItemToProduct(item); 
    addToCart(product); 
    toast.success(`${item.name} added to cart!`, { 
      style: { 
        borderRadius: '10px', 
        background: '#333', 
        color: '#fff', 
      }, 
      iconTheme: { 
        primary: '#D23369', 
        secondary: '#FFFAEE', 
      }, 
    }); 
  }; 
 
  // Determine if a URL is a video 
  const isVideo = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.mov', '.webm', '.ogg'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return ( 
    <div className="bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 relative min-h-screen animate-fadeIn"> 
      {/* Background with Depth */} 
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.15),transparent_70%)]" /> 
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(251,146,60,0.1),transparent_70%)]" /> 
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.5)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.5)_100%)]" /> 
       
      {/* Floating Switch Button (Mobile Only) */} 
      {showFloatingSwitch && ( 
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={onSwitchToProducts}
            className="px-4 py-3 bg-gradient-to-r from-[#82D616] to-[#16A34A] text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 border border-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Cake Constructor</span>
          </button>
        </div>
      )} 
       
      {/* Content */} 
      <div className="relative"> 
        {/* Catalog Controls */} 
        <div id="portfolio-section" className={`sticky top-[64px] z-30 bg-white/95 backdrop-blur-sm border-b shadow-sm transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}> 
          <div className="container mx-auto px-4"> 
            {/* Mode Switch */} 
            <div className="flex justify-between items-center mb-4"> 
              <h2 className="text-xl font-semibold text-gray-800">Our Portfolio</h2> 
            </div> 
 
            {/* Category Filter - Dropdown on Mobile */} 
            <div className="relative"> 
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} 
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all w-full md:w-auto md:hidden" 
                > 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /> 
                  </svg> 
                  <span className="flex-1 text-left font-medium">{selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Categories'}</span> 
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-500 transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /> 
                  </svg> 
                </button>
                
                {/* Added catalog switch button to category bar */}
                <button 
                  onClick={onSwitchToProducts} 
                  className="ml-4 px-4 py-2.5 bg-gradient-to-r from-[#82D616] to-[#16A34A] text-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 border border-green-500" 
                > 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Cake Constructor</span>
                </button>
              </div>
               
              {/* Mobile Dropdown Menu */} 
              {isFilterMenuOpen && ( 
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-10 py-2 border border-gray-200 md:hidden"> 
                  <button 
                    onClick={() => { 
                      setSelectedCategory(null); 
                      setIsFilterMenuOpen(false); 
                    }} 
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors
                      ${!selectedCategory ? 'text-violet-700 font-medium border-l-4 border-violet-400' : 'text-gray-700 border-l-4 border-transparent'}`} 
                  > 
                    All Categories 
                  </button> 
                  {sortedCategories.map((category) => ( 
                    <button 
                      key={category.id} 
                      onClick={() => { 
                        setSelectedCategory(category.id); 
                        setIsFilterMenuOpen(false); 
                      }} 
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors
                        ${selectedCategory === category.id ? 'text-violet-700 font-medium border-l-4 border-violet-400' : 'text-gray-700 border-l-4 border-transparent'}`} 
                    > 
                      {category.name} 
                    </button> 
                  ))} 
                </div> 
              )} 
               
              {/* Desktop Category Pills */} 
              <div className="hidden md:flex flex-wrap gap-2 mt-4"> 
                <button 
                  onClick={() => setSelectedCategory(null)} 
                  className={`px-4 py-2 rounded-md transition-all duration-300 border ${
                    !selectedCategory
                      ? 'bg-violet-100 text-violet-700 font-medium border-violet-300 shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                > 
                  All Categories 
                </button> 
                {sortedCategories.map((category) => ( 
                  <button 
                    key={category.id} 
                    onClick={() => setSelectedCategory(category.id)} 
                    className={`px-4 py-2 rounded-md transition-all duration-300 border ${
                      selectedCategory === category.id
                        ? 'bg-violet-100 text-violet-700 font-medium border-violet-300 shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  > 
                    {category.name} 
                  </button> 
                ))} 
              </div> 
            </div> 
          </div> 
        </div> 
 
        {/* Portfolio Grid */}
        <div className="container mx-auto px-4 py-8"> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"> 
            {filteredItems.map((item) => ( 
              <div  
                key={item.id}  
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                onClick={() => setSelectedItem(item)} 
              > 
                <div className="relative pb-[100%]"> 
                  <img  
                    src={item.images[0]}  
                    alt={item.name}  
                    className="absolute inset-0 w-full h-full object-cover" 
                  /> 
                </div> 
                 
                {/* Image overlay with price */} 
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4"> 
                  <div className="flex flex-col h-[80px] justify-between"> 
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1 text-shadow line-clamp-2">{item.name}</h3> 
                    <div className="flex justify-between items-center"> 
                      <p className="text-sm text-white/90">&euro;{item.price.toFixed(2)}</p> 
                      <div className="flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2 gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"> 
                        <Maximize2 className="w-3 h-3 text-[#D23369]" /> 
                        <span className="text-xs font-medium text-[#D23369]">View</span> 
                      </div> 
                    </div> 
                  </div> 
                </div> 
              </div> 
            ))} 
          </div> 
          {/* Consultation Button */}
          <div className="mt-12">
            <ConsultationButton onAddToCart={(product) => addToCart(product)} />
          </div>
          {/* Bottom Switch Button */} 
          <div className="mt-12 flex justify-center"> 
            <button 
              onClick={() => { 
                onSwitchToProducts(); 
                // Scroll to the top of the catalog section 
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }); 
              }} 
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2" 
            > 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> 
              </svg> 
              Design Your Cake 
            </button> 
          </div> 
        </div> 
      </div> 
 
      {/* Modal */} 
      {selectedItem && ( 
        <div className="fixed inset-0 z-50 overflow-y-auto"> 
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"> 
            <div className="fixed inset-0 transition-opacity" aria-hidden="true"> 
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div> 
            </div> 
 
            {/* Modal Content */} 
            <div  
              className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-[90vh] overflow-y-auto" 
              role="dialog"  
              aria-modal="true"  
              aria-labelledby="modal-headline" 
            > 
              <button  
                onClick={() => setSelectedItem(null)}  
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-all duration-300" 
              > 
                <X className="w-5 h-5 text-gray-700" /> 
              </button> 
 
              {/* Mobile Layout - Stack vertically */} 
              <div className="flex flex-col md:hidden"> 
                {/* Image Section - Smaller for mobile */} 
                <div className="relative"> 
                  <div className="aspect-[4/3] overflow-hidden"> 
                    {selectedItem && (
                      isVideo(selectedItem.images[currentImageIndex]) ? (
                        <div className="bg-white h-full w-full flex items-center justify-center">
                          <video 
                            src={selectedItem.images[currentImageIndex]} 
                            className="max-w-full max-h-full" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            controls
                            onTouchStart={handleTouchStart} 
                            onTouchMove={handleTouchMove} 
                            onTouchEnd={handleTouchEnd}
                          />
                        </div>
                      ) : (
                        <img  
                          src={selectedItem.images[currentImageIndex]}  
                          alt={selectedItem.name}  
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            swipeAnimation === 'left' ? 'translate-x-[-5%]' :  
                            swipeAnimation === 'right' ? 'translate-x-[5%]' : '' 
                          } ${
                            slideDirection === 'next' ? 'animate-slideLeft' :  
                            slideDirection === 'prev' ? 'animate-slideRight' : '' 
                          }`} 
                          onTouchStart={handleTouchStart} 
                          onTouchMove={handleTouchMove} 
                          onTouchEnd={handleTouchEnd} 
                        />
                      )
                    )}
                  </div>
                   
                  {/* Navigation arrows for mobile version */} 
                  {selectedItem.images.length > 1 && ( 
                    <> 
                      <button  
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          changeImage('prev'); 
                        }} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors" 
                        aria-label="Previous image" 
                      > 
                        <ChevronLeft className="w-4 h-4 text-gray-800" /> 
                      </button> 
                      <button  
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          changeImage('next'); 
                        }} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors" 
                        aria-label="Next image" 
                      > 
                        <ChevronRight className="w-4 h-4 text-gray-800" /> 
                      </button> 
                    </> 
                  )} 
                   
                  {/* Image indicators for multiple images */} 
                  {selectedItem.images.length > 1 && ( 
                    <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center"> 
                      {/* Image index */} 
                      <div className="mb-1.5 bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs shadow-sm"> 
                        {currentImageIndex + 1} / {selectedItem.images.length} 
                      </div> 
                       
                      {/* Image indicators */} 
                      <div className="flex justify-center gap-1.5"> 
                        {selectedItem.images.map((_, index) => ( 
                          <button  
                            key={index} 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              jumpToImage(index); 
                            }} 
                            className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-200 ${ 
                              index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70' 
                            }`} 
                            aria-label={`Image ${index + 1}`} 
                          /> 
                        ))} 
                      </div> 
                    </div> 
                  )} 
                   
                  {/* Image overlay with price */} 
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg py-2 px-4 shadow-lg"> 
                    <p className="text-2xl font-semibold text-[#D23369]"> 
                      &euro;{selectedItem.price.toFixed(2)} 
                    </p> 
                  </div> 
                </div> 
 
                {/* Content Section - Scrollable on mobile */} 
                <div className="p-4 flex flex-col"> 
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedItem.name}</h3> 
                   
                  {/* Tags */} 
                  <div className="flex flex-wrap gap-1.5 mb-3"> 
                    {selectedItem.tags?.map((tag) => ( 
                      <span  
                        key={tag}  
                        className="inline-block px-2 py-0.5 text-xs bg-violet-100 text-violet-800 rounded-full font-medium" 
                      > 
                        #{tag} 
                      </span> 
                    ))} 
                  </div> 
                   
                  <p className="text-gray-600 mb-3 text-sm">{selectedItem.description}</p> 
                   
                  <div className="space-y-2 mb-3"> 
                    <div> 
                      <h4 className="font-medium text-gray-800 mb-0.5 text-sm">Composition:</h4> 
                      <p className="text-gray-600 whitespace-pre-line text-xs">{selectedItem.composition}</p> 
                    </div> 
                     
                    <div className="flex justify-between"> 
                      <div> 
                        <h4 className="font-medium text-gray-800 mb-0.5 text-sm">Weight:</h4> 
                        <p className="text-gray-600 text-xs">{selectedItem.weight_kg} kg</p> 
                      </div> 
                      <div> 
                        <h4 className="font-medium text-gray-800 mb-0.5 text-sm">Serves:</h4> 
                        <p className="text-gray-600 text-xs">{selectedItem.order_details?.serving_size || 'N/A'} people</p> 
                      </div> 
                    </div> 
                  </div> 
                   
                  {/* Customer Review - Compact for mobile */} 
                  {selectedItem.customer_review && ( 
                    <div className="mb-3"> 
                      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg p-2 border border-violet-100"> 
                        <div className="flex items-center mb-1"> 
                          <div className="flex"> 
                            {[...Array(5)].map((_, i) => ( 
                              <Star  
                                key={i}  
                                className={`w-3 h-3 ${i < (selectedItem.customer_review?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}  
                              /> 
                            ))} 
                          </div> 
                          <span className="ml-1 text-xs text-gray-600"> 
                            by {selectedItem.customer_review?.customer_name || 'Anonymous'} 
                          </span> 
                        </div> 
                        <p className="text-xs italic text-gray-600">"{selectedItem.customer_review?.text || 'No review text available'}"</p> 
                      </div> 
                    </div> 
                  )} 
                   
                  {/* Call to Action - Always visible */} 
                  <div className="mt-1"> 
                    <button  
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleAddToCart(selectedItem); 
                      }} 
                      className="bg-[#D23369] hover:bg-[#A32651] text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2" 
                    > 
                      <ShoppingCart className="w-4 h-4" /> 
                      <span className="text-sm">Order Similar Cake</span> 
                    </button> 
                  </div> 
                </div> 
              </div> 
 
              {/* Desktop Layout - Side by side */} 
              <div className="hidden md:flex md:flex-row"> 
                {/* Image Section */} 
                <div className="md:w-1/2 relative"> 
                  <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl">
                    {selectedItem && (
                      isVideo(selectedItem.images[currentImageIndex]) ? (
                        <div className="bg-white h-full w-full flex items-center justify-center">
                          <video 
                            src={selectedItem.images[currentImageIndex]} 
                            className="max-w-full max-h-full" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            controls
                            onTouchStart={handleTouchStart} 
                            onTouchMove={handleTouchMove} 
                            onTouchEnd={handleTouchEnd}
                          />
                        </div>
                      ) : (
                        <img  
                          src={selectedItem.images[currentImageIndex]}  
                          alt={selectedItem.name}  
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            swipeAnimation === 'left' ? 'translate-x-[-5%]' :  
                            swipeAnimation === 'right' ? 'translate-x-[5%]' : '' 
                          } ${
                            slideDirection === 'next' ? 'animate-slideLeft' :  
                            slideDirection === 'prev' ? 'animate-slideRight' : '' 
                          }`} 
                          onTouchStart={handleTouchStart} 
                          onTouchMove={handleTouchMove} 
                          onTouchEnd={handleTouchEnd} 
                        />
                      )
                    )}
                  </div>
                   
                  {/* Navigation arrows */} 
                  {selectedItem.images.length > 1 && ( 
                    <> 
                      <button  
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          changeImage('prev'); 
                        }} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors" 
                        aria-label="Previous image" 
                      > 
                        <ChevronLeft className="w-5 h-5 text-gray-800" /> 
                      </button> 
                      <button  
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          changeImage('next'); 
                        }} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors" 
                        aria-label="Next image" 
                      > 
                        <ChevronRight className="w-5 h-5 text-gray-800" /> 
                      </button> 
                    </> 
                  )} 
                   
                  {/* Image indicators for multiple images */} 
                  {selectedItem.images.length > 1 && ( 
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5"> 
                      {selectedItem.images.map((_, index) => ( 
                        <button  
                          key={index} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            jumpToImage(index); 
                          }} 
                          className={`w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-200 ${ 
                            index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70' 
                          }`} 
                          aria-label={`Image ${index + 1}`} 
                        /> 
                      ))} 
                    </div> 
                  )} 
                </div> 
 
                {/* Content Section */} 
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col"> 
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.name}</h3> 
                   
                  {/* Tags */} 
                  <div className="flex flex-wrap gap-2 mb-5"> 
                    {selectedItem.tags?.map((tag) => ( 
                      <span  
                        key={tag}  
                        className="inline-block px-3 py-1.5 text-sm bg-violet-100 text-violet-800 rounded-full font-medium" 
                      > 
                        #{tag} 
                      </span> 
                    ))} 
                  </div> 
                   
                  <p className="text-gray-600 mb-6">{selectedItem.description}</p> 
                   
                  <div className="space-y-4 mb-6"> 
                    <div> 
                      <h4 className="font-medium text-gray-800 mb-1">Composition:</h4> 
                      <p className="text-gray-600 whitespace-pre-line">{selectedItem.composition}</p> 
                    </div> 
                     
                    <div className="flex justify-between"> 
                      <div> 
                        <h4 className="font-medium text-gray-800 mb-1">Weight:</h4> 
                        <p className="text-gray-600">{selectedItem.weight_kg} kg</p> 
                      </div> 
                      <div> 
                        <h4 className="font-medium text-gray-800 mb-1">Serves:</h4> 
                        <p className="text-gray-600">{selectedItem.order_details?.serving_size || 'N/A'} people</p> 
                      </div> 
                    </div> 
                  </div> 
                   
                  {/* Customer Review */} 
                  {selectedItem.customer_review && ( 
                    <div className="mt-auto"> 
                      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-100"> 
                        <div className="flex items-center mb-2"> 
                          <div className="flex"> 
                            {[...Array(5)].map((_, i) => ( 
                              <Star  
                                key={i}  
                                className={`w-4 h-4 ${i < (selectedItem.customer_review?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}  
                              /> 
                            ))} 
                          </div> 
                          <span className="ml-2 text-sm text-gray-600"> 
                            by {selectedItem.customer_review?.customer_name || 'Anonymous'} 
                          </span> 
                        </div> 
                        <p className="text-sm italic text-gray-600">"{selectedItem.customer_review?.text || 'No review text available'}"</p> 
                      </div> 
                    </div> 
                  )} 
                   
                  {/* Call to Action */} 
                  <div className="mt-6"> 
                    <button  
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleAddToCart(selectedItem); 
                      }} 
                      className="bg-[#D23369] hover:bg-[#A32651] text-white px-6 py-3 rounded-md transition-colors flex items-center space-x-2" 
                    > 
                      <ShoppingCart className="w-5 h-5" /> 
                      <span>Order Similar Cake</span> 
                    </button> 
                  </div> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
      )}
      {/* Loading indicator for images */} 
      {imagesLoading && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"> 
          <div className="flex flex-col items-center space-y-2"> 
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500 border-opacity-50"></div> 
            <p className="text-sm text-gray-600">Loading images...</p> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}
