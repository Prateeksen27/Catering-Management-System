import CateringPromo from "../components/CateringPromo";
import GetInTouch from "../components/GetInTouch";
import QueryForm from "../components/QueryForm";
import CoverImage from "../components/CoverImage";

const ContactUsPage = () => {
  return (
    <div>
      {/* Other Contact Us content */}
      <CoverImage/>
      <CateringPromo />
      <QueryForm/>
      <GetInTouch/>
    </div>
  );
};

export default ContactUsPage;
