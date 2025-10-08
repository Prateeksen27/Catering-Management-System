import p1 from "../assets/1.jpg";
import p2 from "../assets/2.jpg";
import p3 from "../assets/3.jpg";
import p4 from "../assets/4.jpg";
import p5 from "../assets/5.jpg";
import p6 from "../assets/6.jpg";
import p7 from "../assets/7.jpg";
import p8 from "../assets/8.jpg";
import p9 from "../assets/9.jpg";

const GallaryComponent = () => {
  const images = [p1, p2, p3, p4, p5, p6, p7, p8, p9];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {images.map((img, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={img}
              alt={`Food ${index + 1}`}
              className="w-full h-64 object-cover transition-transform duration-200 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallaryComponent;
