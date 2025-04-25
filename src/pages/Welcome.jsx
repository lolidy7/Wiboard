import SlideShow from '../components/slideshow/SlideShow';

const Welcome = () => {
  return (
    <div className="welcome dark:bg-[#1a1a1a] -m-4">
      <header></header>
      <main className="font-roboto bg-white dark:bg-[#1a1a1a] text-black dark:text-white relative min-h-screen">
        <section>
          <SlideShow />
        </section>

        <section className="blog-type py-16">
          <div className="container max-w-[1200px] mx-auto px-5">
            <div className="food-blog">
              <div className="row flex gap-5 items-center justify-center">
                <div className="col-6 flex-1 max-w-[50%]">
                  <div className="item-pic px-10">
                    <div className="row flex flex-wrap gap-2.5">
                      <div className="col-4 flex-1 max-w-[33.33%] pic-01">
                        <img
                          src="/images/food/food-1.jpg"
                          alt="Food 1"
                          className="w-full h-[200px] rounded-2xl object-cover"
                        />
                      </div>
                      <div className="col-4 flex-1 max-w-[33.33%] pic-02 flex flex-col gap-2.5">
                        <img
                          src="/images/food/food-2.jpg"
                          alt="Food 2"
                          className="w-full h-[200px] rounded-2xl object-cover"
                        />
                        <img
                          src="/images/food/food-3.jpg"
                          alt="Food 3"
                          className="w-full h-[200px] rounded-2xl object-cover"
                        />
                      </div>
                      <div className="col-4 flex-1 max-w-[33.33%] pic-03">
                        <img
                          src="/images/food/food-4.jpg"
                          alt="Food 4"
                          className="w-full h-[200px] rounded-2xl object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6 flex-1 max-w-[50%] flex justify-center">
                  <div className="item-text text-left px-10">
                    <div className="title">
                      <h3 className="text-[2.5rem] text-white mb-5">Search for an idea</h3>
                      <p className="text-[1.25rem] text-white/90 mb-8">
                        What do you want to try next? Think of something you're into — like "Healthy Foods" — and see what you find.
                      </p>
                    </div>
                    <a
                      href="#"
                      className="explore inline-block px-5 py-2.5 text-base rounded-[20px] text-[#48d52b] bg-white transition-all duration-300 hover:bg-[#3fc324] hover:text-white"
                    >
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="decor-blog bg-[#7c3aed] py-16">
          <div className="container max-w-[1200px] mx-auto px-5">
            <div className="row flex gap-5 items-center justify-center">
              <div className="col-6 flex-1 max-w-[50%] flex justify-center">
                <div className="item-text text-left px-10">
                  <div className="title">
                    <h3 className="text-[2.5rem] text-white mb-5">Save ideas you like</h3>
                    <p className="text-[1.25rem] text-white/90 mb-8">
                      Collect your favorites so you can get back to them later.
                    </p>
                  </div>
                  <a
                    href="#"
                    className="explore inline-block px-5 py-2.5 text-base rounded-[20px] text-[#7c3aed] bg-white transition-all duration-300 hover:bg-[#a25aff] hover:text-white"
                  >
                    Explore
                  </a>
                </div>
              </div>
              <div className="col-6 flex-1 max-w-[50%]">
                <div className="image-grid grid grid-cols-2 gap-4 p-5">
                  <div className="relative rounded-[10px] overflow-hidden transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/decor/decor-01.png"
                      alt="Future Room"
                      className="w-full h-[200px] object-cover rounded-[10px]"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-2.5 py-1.5 rounded-[5px] text-[1.25rem] text-center w-full">
                      Future room style
                    </div>
                  </div>
                  <div className="relative rounded-[10px] overflow-hidden transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/decor/decor-02.png"
                      alt="Cozy Room"
                      className="w-full h-[200px] object-cover rounded-[10px]"
                    />
                    <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-2.5 py-1.5 rounded-[5px] text-[1.25rem] text-center w-full">
                      Our kitchen upgrade
                    </div>
                  </div>
                  <div className="relative rounded-[10px] overflow-hidden transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/decor/decor-03.png"
                      alt="Modern Living Room"
                      className="w-full h-[200px] object-cover rounded-[10px]"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-2.5 py-1.5 rounded-[5px] text-[1.25rem] text-center w-full">
                      My second living room
                    </div>
                  </div>
                  <div className="relative rounded-[10px] overflow-hidden transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/decor/decor-04.png"
                      alt="Kitchen Design"
                      className="w-full h-[200px] object-cover rounded-[10px]"
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 px-2.5 py-1.5 rounded-[5px] text-[1.25rem] text-center w-full">
                      People dream place
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="fashion-blog bg-[#2f5e8b] py-16">
          <div className="container max-w-[1200px] mx-auto px-5">
            <div className="row flex gap-5 items-center justify-center">
              <div className="col-6 flex-1 max-w-[50%]">
                <div className="pic-fashion relative px-5">
                  <div className="card">
                    <img
                      src="/images/image 62.png"
                      alt="Fashion 1"
                      className="w-full h-[400px] object-cover rounded-2xl"
                    />
                  </div>
                  <div className="img-pop-up absolute bottom-10 left-10 w-[200px]">
                    <img
                      src="/images/image 6.png"
                      alt="Fashion 2"
                      className="w-full rounded-2xl object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="col-6 flex-1 max-w-[50%] flex justify-center">
                <div className="item-text text-left px-10">
                  <div className="title">
                    <h3 className="text-[2.5rem] text-white mb-5">See it, make it, try it, do it</h3>
                    <p className="text-[1.25rem] text-white/90 mb-8">Trust the process and make it true.</p>
                  </div>
                  <a
                    href="#"
                    className="explore inline-block px-5 py-2.5 text-base rounded-[20px] text-[#2f5e8b] bg-white transition-all duration-300 hover:bg-[#2f5e8b] hover:text-white"
                  >
                    Explore
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about-area py-16 bg-white dark:bg-[#1a1a1a]">
          <div className="container max-w-[1200px] mx-auto px-5 dark:text-primary">
            <div className="about-wiboard text-center py-10 px-5">
              <h3 className="text-[2.5rem] text-whte dark:text-white mb-5">
                About <span className="text-[#33c733]">Wiboard</span>
              </h3>
              <hr className="my-5 border-t border-black/10" />
              <p className="text-[1.25rem] text-black/70 dark:text-primary leading-relaxed">
                Wiboard is a visual search platform that makes finding the perfect images effortless. Whether you're looking for inspiration, ideas, or specific pictures, Wiboard helps you discover and save what you love with ease. With a simple and intuitive experience, searching for the right image has never been easier.
              </p>
            </div>
            <div className="mission py-10 dark:text-primary">
              <div className="row flex gap-5 items-center justify-center">
                <div className="col-6 flex-1 max-w-[50%] title text-left">
                  <h3 className="text-2xl mb-5">
                    <span className="text-[#33c733]">Wiboard</span> Mission
                  </h3>
                  <p className="text-[1.25rem] leading-relaxed text-left">
                    Our mission is to become a leading online platform for exploring and discovering content easily. We aim to create a user-friendly website that allows seamless searching, making information more accessible and enjoyable for everyone.
                  </p>
                </div>
                <div className="col-6 flex-1 max-w-[50%]">
                  <img
                    src="/images/mission.jpg"
                    alt="Wiboard Mission"
                    className="w-full max-w-[400px] rounded-2xl object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="mission py-10 dark:text-primary">
              <div className="row flex gap-5 items-center justify-center">
                <div className="col-6 flex-1 max-w-[50%]">
                  <img
                    src="/images/vision.jpg"
                    alt="Wiboard Vision"
                    className="w-full max-w-[400px] rounded-2xl object-cover"
                  />
                </div>
                <div className="col-6 flex-1 max-w-[50%] title text-left">
                  <h3 className="text-2xl mb-5">
                    <span className="text-[#33c733]">Wiboard</span> Vision
                  </h3>
                  <p className="text-[1.25rem] leading-relaxed text-left">
                    Our vision is to become a leading online platform for exploring and discovering content easily. We aim to create a user-friendly website that allows seamless searching, making information more accessible and enjoyable for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center pb-5">
        <p className='dark:text-primary'>© 2025 Wiboard by ISTAD. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;