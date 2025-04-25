import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaEnvelope, FaGithub } from 'react-icons/fa';

const About = () => {
  const team = [
    {
      name: 'San Kanytha',
      role: 'Team Leader',
      image: '/images/kanytha.jpg',
      linkedin: 'https://linkedin.com/in/team1',
      email: 'mailto:kanytha@example.com',
      github: 'https://github.com/Kanytha'
    },
    {
      name: 'Hok Singparady',
      role: 'Sub Leader',
      image: '/images/rady.jpg',
      linkedin: 'https://linkedin.com/in/team2',
      email: 'mailto:rady@example.com',
      github: 'https://github.com/lolidy7'
    },
    {
      name: 'Rath Saroeun',
      role: 'Front-End',
      image: '/images/saroeun.jpg',
      linkedin: 'https://linkedin.com/in/team3',
      email: 'mailto:saroeun@example.com',
      github: 'https://github.com/Saroeun21'
    },
    {
      name: 'Tith Cholna',
      role: 'Front-End',
      image: '/images/cholna.jpg',
      linkedin: 'https://linkedin.com/in/team4',
      email: 'mailto:cholna@example.com',
      github: 'https://github.com/ativity11212'
    },
    {
      name: 'Aok Sothatt',
      role: 'Front-End',
      image: '/images/sothat.jpg',
      linkedin: 'https://linkedin.com/in/team5',
      email: 'mailto:sothatt@example.com',
      github: 'https://github.com/aoksothatt'
    },
    {
      name: 'Hean Liza',
      role: 'Front-End',
      image: '/images/liza.jpg',
      linkedin: 'https://linkedin.com/in/team6',
      email: 'mailto:liza@example.com',
      github: 'https://github.com/Heanliza33'
    },
    {
      name: 'Chhay Soklivin',
      role: 'Front-End',
      image: '/images/livin.jpg',
      linkedin: 'https://linkedin.com/in/team7',
      email: 'mailto:grace@example.com',
      github: 'https://github.com/Livin-ddd'
    },
    {
      name: 'Kov Layhork',
      role: 'Front-End',
      image: '/images/harry.jpg',
      linkedin: 'https://linkedin.com/in/team8',
      email: 'mailto:harry@example.com',
      github: 'https://github.com/team8'
    },
  ];

  const mentors = [
    {
      name: 'Mom Reaksmey',
      role: 'Mentor',
      image: '/images/mentor1.jpg',
      linkedin: 'https://linkedin.com/in/mentor1',
      email: 'mailto:mentor1@example.com',
      github: 'https://github.com/mentor1'
    },
    {
      name: 'Ing Davann',
      role: 'Mentor',
      image: '/images/mentor2.jpg',
      email: 'mailto:mentor2@example.com',
      github: 'https://github.com/ingdavann'
    },
  ];

  const useOnScreen = (options) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = React.useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        options
      );
      if (ref.current) observer.observe(ref.current);
      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    }, [options]);

    return [ref, isIntersecting];
  };

  return (
    <div className=" -m-4 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-6 py-12 font-roboto">
      <div className="max-w-7xl mx-auto space-y-16">
        <section className="md:flex md:justify-between md:items-start gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4 text-start">What is Wiboad?</h2>
            <p className="text-start text-xl">
              Our mission is to collaborate, innovate, and inspire. As the creators of WiBoard — a visual inspiration platform similar to Pinterest — we aim to build a space where users can save, share, and discover creative ideas. We combine design, technology, and teamwork to turn imagination into reality.
            </p>
          </div>
        </section>
        

        {/* Stylish Divider Between Sections */}
        <div className="flex justify-center items-center my-12">
          <div className="w-1/5 h-1 bg-gradient-to-r from-green-400 via-white dark:via-gray-800 to-green-400"></div>
          <span className="mx-4 text-xl font-semibold text-green-500">Our Vision</span>
          <div className="w-1/5 h-1 bg-gradient-to-r from-green-400 via-white dark:via-gray-800 to-green-400"></div>
        </div>

        <section className="md:flex md:justify-end md:items-start">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4 text-end">Why We Built WiBoard?</h2>
            <p className="text-end text-xl">
              WiBoard was born from our desire to create a community-driven platform where creativity and organization intersect. Whether it's saving project inspirations, organizing tasks visually, or exploring innovative ideas, WiBoard empowers users to curate their digital vision boards in a clean, collaborative environment.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-green-500 text-3xl font-semibold mb-6 text-center">Our Mentors</h2>
          <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {mentors.map((mentor, i) => {
              const [ref, isVisible] = useOnScreen({ threshold: 1 });

              return (
                <div
                  ref={ref}
                  key={i}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col items-center w-full max-w-sm mx-auto opacity-0 transform ${isVisible ? 'opacity-100 translate-y-0' : 'translate-y-10'} transition-all duration-700`}
                >
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-50 h-60 object-cover rounded-full border-4 border-green-400 shadow-md"
                  />
                  <h3 className="mt-4 font-bold text-2xl text-center">{mentor.name}</h3>
                  <p className="p-1 text-xl text-gray-500 dark:text-gray-300 text-center">{mentor.role}</p>
                  <div className="flex gap-6 mt-3 text-3xl text-gray-600 dark:text-gray-300">
                    <a href={mentor.email} className="hover:text-red-600">
                      <FaEnvelope />
                    </a>
                    <a href={mentor.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 dark:hover:text-white">
                      <FaGithub />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className=" text-green-500 text-3xl font-semibold mb-6 text-center">Our Team</h2>
          <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member, i) => {
              const [ref, isVisible] = useOnScreen({ threshold: 1 });
              

              return (
                <div
                  ref={ref}
                  key={i}
                  className={`bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg flex flex-col items-center w-full max-w-md mx-auto opacity-0 transform ${isVisible ? 'opacity-100 translate-y-0' : 'translate-y-10'} transition-all duration-700`}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-58 object-cover rounded-full border-4 border-green-400 shadow-md"
                  />
                  <h3 className="mt-6 font-bold text-2xl text-center">{member.name}</h3>
                  <p className=" p-1 text-xl text-gray-500 dark:text-gray-300 text-center">{member.role}</p>
                  <div className="flex gap-6 mt-4 text-3xl text-gray-600 dark:text-gray-300">
                    <a href={member.email} className="hover:text-green-500">
                      <FaEnvelope />
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 dark:hover:text-white">
                      <FaGithub />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div>
          <sectio>
            <h2 className="text-2xl font-bold mb-6 text-start">Orginazed by ISTAD</h2>
            <img className='w-30 ml-10' src="/images/istad.png" alt="istad" />
          </sectio>
          <section>
            <div className="flex flex-col items-end">
              <h2 className="text-2xl font-bold mb-2">Sponsorship by WIBOAD</h2>
              <img className="w-40 mr-15" src="/images/logo.png" alt="WISBOAD" />
            </div>
          </section>
        </div>

        <hr className='text-gray-400' />
        <footer className='text-center text-lg'>
          <p>© 2025 Wiboad by ISTAD. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default About;