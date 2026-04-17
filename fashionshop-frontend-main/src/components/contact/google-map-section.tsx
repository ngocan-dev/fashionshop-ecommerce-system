export function GoogleMapSection() {
  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 md:mt-14">
      <div className="relative w-full overflow-hidden pb-[56.25%]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125383.23050220472!2d106.69590908161899!3d10.870411504591623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a415a9d221%3A0x550c2b41569376f9!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBRdeG7kWMgVOG6vyAtIMSQ4bqhaSBo4buNYyBRdeG7kWMgZ2lhIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1775575478011!5m2!1svi!2s"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute left-0 top-0 h-full w-full"
        />
      </div>
    </section>
  );
}
