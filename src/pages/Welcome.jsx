import '../css/welcome/Welcome.css'
import SlideShow from '../components/slideshow/SlideShow';


const Welcome = () => {
  return (
    <>
      <div className='dark:bg-primary-darkmode -m-4'>

        <header></header>
        <main>
          <section>
            <SlideShow />
          </section>

          <section className="blog-type">
            <div className="container">
              <div className="food-blog">
                <div className="row">
                  <div className="col-6">
                    <div className="item-pic">
                      <div className="row">
                        <div className="col-4 pic-01">
                          <img src="/images/food/food-1.jpg" alt="Food 1" />
                        </div>
                        <div className="col-4 pic-02">
                          <img src="/images/food/food-2.jpg" alt="Food 2" />
                          <img src="/images/food/food-3.jpg" alt="Food 3" />
                        </div>
                        <div className="col-4 pic-03">
                          <img src="/images/food/food-4.jpg" alt="Food 4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 center-item">
                    <div className="item-text">
                      <div className="title">
                        <h3>Search for an idea</h3>
                        <p>
                          What do you want to try next? Think of something you're
                          into —like "Healthy Foods" —and see what you find.
                        </p>
                      </div>
                      <a href="#" className="explore">
                        Explore
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="decor-blog">
            <div className="container">
              <div className="row">
                <div className="col-6 center-item">
                  <div className="item-text">
                    <div className="title">
                      <h3>Save idea you like</h3>
                      <p>
                        Collect your favorites so you can get back to them later.
                      </p>
                    </div>
                    <a href="#" className="explore">
                      Explore
                    </a>
                  </div>
                </div>
                <div className="col-6">
                  <div className="image-grid">
                    <div className="image-card">
                      <img src="/images/decor/decor-01.png" alt="Future Room" />
                      <div className="text-overlay">Future room style</div>
                    </div>
                    <div className="image-card">
                      <img src="/images/decor/decor-02.png" alt="Cozy Room" />
                      <div className="text-overlay">Our kitchen upgrade</div>
                    </div>
                    <div className="image-card">
                      <img
                        src="/images/decor/decor-03.png"
                        alt="Modern Living Room"
                      />
                      <div className="text-overlay">My second living room</div>
                    </div>
                    <div className="image-card">
                      <img
                        src="/images/decor/decor-04.png"
                        alt="Kitchen Design"
                      />
                      <div className="text-overlay">people dream place</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="fashion-blog">
            <div className="container">
              <div className="row">
                <div className="col-6">
                  <div className="pic-fashion">
                    <div className="card">
                      <img src="/images/fashion/fashion-01.png" alt="Fashion 1" />
                    </div>
                    <div className="img-pop-up">
                      <img src="/images/fashion/fashion-02.png" alt="Fashion 2" />
                    </div>
                  </div>
                </div>
                <div className="col-6 center-item">
                  <div className="item-text">
                    <div className="title">
                      <h3>See it, make it, try it, do it</h3>
                      <p>Trust the Process and make it true.</p>
                    </div>
                    <a href="#" className="explore">
                      Explore
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div >
            <section id="about" className="about-area dark:bg-primary-darkmode">
              <div className="container">
                <div className="about-wiboard ">
                  <h3>
                    About <span> Wiboard</span>
                  </h3>
                  <hr />
                  <p>
                    Wiboad is a visual search platform that makes finding the
                    perfect images effortless. Whether you're looking for
                    inspiration, ideas, or specific pictures, Wiboad helps you
                    discover and save what you love with ease. With a simple and
                    intuitive experience, searching for the right image has never
                    been easier.
                  </p>
                </div>
                <div className="mission">
                  <div className="row">
                    <div className="col-6 title ">
                      <h3>
                        <span> Wiboard</span>-Mission
                      </h3>
                      <p>
                        Our vision is to become a leading online platform for
                        exploring and discovering content easily. We aim to create a
                        user-friendly website that allows seamless searching, making
                        information more accessible and enjoyable for everyone.
                      </p>
                    </div>
                    <div className="col-6 ">
                      <img src="/images/mission.jpg" alt="Wiboard Mission" />
                    </div>
                  </div>
                </div>
                <div className="mission  dark:bg-primary-darkmode">
                  <div className="row">
                    <div className="col-6">
                      <img src="/images/vision.jpg" alt="Wiboard Vision" />
                    </div>
                    <div className="col-6 title">
                      <h3>
                        <span> Wiboard</span>-Vision
                      </h3>
                      <p>
                        Our vision is to become a leading online platform for
                        exploring and discovering content easily. We aim to create a
                        user-friendly website that allows seamless searching, making
                        information more accessible and enjoyable for everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <footer className='text-center pb-5'>
          <p> © 2025 Wiboad by ISTAD. All rights reserved. </p>
        </footer>
      </div>
    </>
  );
};

export default Welcome;
