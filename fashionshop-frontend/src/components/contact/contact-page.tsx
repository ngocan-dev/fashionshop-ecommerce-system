import { AppointmentCta } from './appointment-cta';
import { ConnectLinks } from './connect-links';
import { ContactDetails } from './contact-details';
import { ContactForm } from './contact-form';
import { ContactHero } from './contact-hero';
import { GoogleMapSection } from './google-map-section';
import { StudioAddress } from './studio-address';

export function ContactPageContent() {
  return (
    <section className="bg-zinc-100 py-10 md:py-12 lg:py-16">
      <div className="mx-auto w-full max-w-[1480px] px-4 md:px-8 lg:px-12">
        <ContactHero />

        <div className="mt-10 lg:mt-14">
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            <div className="py-8 md:py-10">
              <ContactForm />
            </div>

            <div className="py-8 md:py-10">
              <ContactDetails />
            </div>

            <div className="py-8 md:py-10">
              <StudioAddress />
            </div>

            <div className="py-8 md:py-10">
              <ConnectLinks />
            </div>

            <div className="py-8 md:py-10">
              <AppointmentCta />
            </div>
          </div>
        </div>

        <GoogleMapSection />
      </div>
    </section>
  );
}
