"use client"
import React from "react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(null);

    const faqs = [
        {
            question: "What services do you offer?",
            answer: "I offer comprehensive web development, IT services, and network administration solutions. This includes custom website design, full-stack development, and IT infrastructure management.",
        },
        {
            question: "How long does a typical project take?",
            answer: "Project timelines vary depending on complexity. A simple website typically takes 2-4 weeks, while more complex applications can take 6-12 weeks. I'll provide a detailed timeline during our initial consultation.",
        },
        {
            question: "Do you provide ongoing support and maintenance?",
            answer: "Yes, I offer ongoing support and maintenance packages to ensure your website or application continues to run smoothly. This includes updates, security patches, and performance optimization.",
        },
        {
            question: "What technologies do you work with?",
            answer: "I work with modern web technologies including React, Next.js, TypeScript, Node.js, and various database systems. I also have expertise in network administration and IT infrastructure management.",
        },
        {
            question: "How do you handle project pricing?",
            answer: "Pricing is based on project scope, complexity, and timeline. I provide detailed quotes after understanding your specific requirements. Fixed-price and hourly rates are both available depending on the project type.",
        },
        {
            question: "Can you help with existing website updates?",
            answer: "Absolutely! I can help update, maintain, or improve existing websites. Whether you need a simple content update or a complete redesign, I can work with your current setup.",
        },
    ];
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <div className="max-w-[200vw] mx-auto flex flex-col md:flex-row items-start justify-center gap-32 px-2 md:px-0 my-40">
                <img
                    className="max-w-xl w-full rounded-xl h-auto"
                    src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
                    alt=""
                />
                <div className="flex flex-col gap-4">
                    <p className="text-orange-500 text-sm font-medium">FAQ's</p>
                    <h1 className="text-3xl font-semibold">Looking for answer?</h1>
                    <p className="text-sm text-slate-500 mt-2 pb-4">
                        
                    </p>
                    {faqs.map((faq, index) => (
                        <div className="border-b border-slate-200 py-4 cursor-pointer" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium">
                                    {faq.question}
                                </h3>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}>
                                    <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#1D293D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className={`text-sm text-slate-500 transition-all duration-500 ease-in-out max-w-md ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};