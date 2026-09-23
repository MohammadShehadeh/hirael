import { About } from './about';
import { CaseStudies } from './case-studies';
import { Footer } from './footer';
import { Hero } from './hero';

const AgencyLanding = () => {
  return (
    <div className="bg-white text-gray-900 antialiased [font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,'Noto_Sans',sans-serif,'Apple_Color_Emoji','Segoe_UI_Emoji','Segoe_UI_Symbol','Noto_Color_Emoji']">
      <Hero />
      <About />
      <CaseStudies />
      <Footer />
    </div>
  );
};

export default AgencyLanding;
