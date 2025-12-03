import React from 'react'
import AdminDashboard from "../assets/AdminDashboard.png";

const About = () => {
  return (
    <>
    <section className="pb-8 dark:bg-dark lg:pb-16"    style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 1), rgba(197, 234, 249, 1))" }}>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex justify-start">
          <div className="w-full">
            <div className="mb-[60px] max-w-[500px] xl:mb-[70px]">
              <span className="mb-2 block text-lg font-semibold text-primary">
                About Our App
              </span>
              <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px]">
                All You Need to Know About The App
              </h2>
            </div>
            <div className="-mx-4 flex flex-wrap">
              {[{
                title: "Security Maintenance",
                description: "The little rotter bevvy I gormless mush golly gosh cras.",
                bgColor: "bg-[#4BA0FF]",
                icon: "M25.6484 10.8826V9.13259C25.6484 4.75759 22.3672 1.09353..."
              }, {
                title: "Backup Database",
                description: "The little rotter bevvy I gormless mush golly gosh cras.",
                bgColor: "bg-[#FBD06F]",
                icon: "M29.0391 21.1094V14.3828C29.0391 14.3281 29.0391 14.2734 29.0391..."
              }, 

{
                title: "Security Maintenance",
                description: "The little rotter bevvy I gormless mush golly gosh cras.",
                bgColor: "bg-[#4BA0FF]",
                icon: "M25.6484 10.8826V9.13259C25.6484 4.75759 22.3672 1.09353..."
              }, {
                title: "Backup Database",
                description: "The little rotter bevvy I gormless mush golly gosh cras.",
                bgColor: "bg-[#FBD06F]",
                icon: "M29.0391 21.1094V14.3828C29.0391 14.3281 29.0391 14.2734 29.0391..."
              },
              
              {
                title: "Security Maintenance",
                description: "The little rotter bevvy I gormless mush golly gosh cras.",
                bgColor: "bg-[#4BA0FF]",
                icon: "M25.6484 10.8826V9.13259C25.6484 4.75759 22.3672 1.09353..."
              }, {
                title: "Backup Database",
                description: "The little rotter bevvy I gormless mush golly gosh cras.",
                bgColor: "bg-[#FBD06F]",
                icon: "M29.0391 21.1094V14.3828C29.0391 14.3281 29.0391 14.2734 29.0391..."
              }              
            
            
            ].map((feature, index) => (
                <div key={index} className="w-full sm:w-1/3">
                  <div className="mb-10">
                    <div className={`mb-6 flex h-[75px] w-[75px] items-center justify-center rounded-[20px] text-white ${feature.bgColor}`}>
                      <svg width="35" height="35" viewBox="0 0 35 35" className="fill-current">
                        <path d={feature.icon}></path>
                      </svg>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-dark dark:text-white 2xl:text-[22px]">
                      {feature.title}
                    </h3>
                    <p className="text-base leading-relaxed text-body-color dark:text-dark-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>


            
          </div>
        </div>
        <div className="flex justify-start" >
          <div className="w-full">
            <div class="w-full">
                <div class="flex justify-center">
                              <img
                                className="inline w-full max-w-md lg:max-w-lg"
                                src={AdminDashboard}
                                alt="Smartphone Mockup"
                              />
                </div>
            </div>
            
          </div>
        </div>


      </div>
    </section>
    
    </>
  )
}

export default About