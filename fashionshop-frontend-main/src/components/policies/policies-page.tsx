import Image from 'next/image';
import { AssistanceCta } from './assistance-cta';
import { ConciergeCard } from './concierge-card';
import { DeliveryEstimateCard } from './delivery-estimate-card';
import { policyAnchors } from './policy-data';
import { PoliciesSidebar } from './policies-sidebar';
import { PolicySection } from './policy-section';

export function PoliciesPageContent() {
  return (
    <section className="bg-zinc-100">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <header className="mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-400">Information & Guidelines</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-zinc-900 md:text-7xl lg:text-8xl">
            Legal Framework &
            <br />
            Service Protocols.
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
          <PoliciesSidebar anchors={policyAnchors} />

          <main className="space-y-16 md:space-y-20">
            <PolicySection id="shipping-policy" title="01 / Shipping Logistics">
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-10">
                <div className="space-y-6">
                  <p>
                    All pieces in the 18.STUDIO collection are prepared and dispatched from our central distribution
                    hub in Vietnam. We collaborate with specialized logistics partners to preserve material integrity
                    and finishing precision throughout transit.
                  </p>
                  <p>
                    Complimentary express shipping is available for orders above $500 USD. Orders below this threshold
                    are routed through a calibrated flat-rate tier based on region and final parcel dimensions.
                  </p>
                </div>
                <div className="space-y-4">
                  <DeliveryEstimateCard />
                  <ConciergeCard />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-zinc-200">
                <div className="relative aspect-[16/10]">
                  <Image src="/images/policies-shipping.jpg" alt="Shipping and logistics" fill className="object-cover" />
                </div>
              </div>
            </PolicySection>

            <PolicySection id="return-refund" title="02 / Returns & Refunds">
              <article className="space-y-7 rounded-xl border border-zinc-200 bg-zinc-100 p-6 md:p-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-700">The 14-Day Window</h3>
                  <p className="mt-3">
                    Returns are accepted within 14 days of delivery. To qualify, garments must remain unworn,
                    unaltered, and returned with all original labels and packaging.
                  </p>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-700">Exchanges</h3>
                  <p className="mt-3">
                    Direct automated exchanges are currently unavailable. The fastest route is to return the current
                    piece and place a new order once your return has been approved.
                  </p>
                </div>
              </article>
            </PolicySection>

            <PolicySection id="privacy-policy" title="03 / Privacy Commitment">
              <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-7 md:p-9">
                <p>
                  Your information is handled with the same level of care as our garments. We only collect what is
                  required to process orders, optimize your experience, and provide tailored service.
                </p>
                <ul className="mt-7 flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-[0.12em] text-zinc-700">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-zinc-900" />
                    End-to-End Encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-zinc-900" />
                    Transparent Cookie Policy
                  </li>
                </ul>
              </article>
            </PolicySection>

            <PolicySection id="terms-conditions" title="04 / Terms & Conditions">
              <article className="space-y-6 rounded-xl border border-zinc-200 bg-zinc-100 p-6 md:p-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-700">Intellectual Property</h3>
                  <p className="mt-3">
                    All content on this site, including visuals, typography, product copy, and brand assets, is the
                    intellectual property of 18.STUDIO and protected under applicable copyright law.
                  </p>
                </div>
                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-700">Limitation of Liability</h3>
                  <p className="mt-3">
                    18.STUDIO is not liable for indirect or consequential damages arising from use of this site,
                    including interruptions, inaccuracies, or delays outside our operational control.
                  </p>
                </div>
              </article>
            </PolicySection>

            <AssistanceCta />
          </main>
        </div>
      </div>
    </section>
  );
}
