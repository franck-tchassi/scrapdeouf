import React from "react";

const PresentationYoutube = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-8">
                    Découvrez LocalAdd en 2 minutes
                </h2>
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border-8 border-orange-100 mx-auto">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Remplace par l'URL de ta vidéo
                        title="Présentation LocalAdd"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default PresentationYoutube;