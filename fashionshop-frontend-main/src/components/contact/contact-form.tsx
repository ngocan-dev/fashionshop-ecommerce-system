import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const subjects = ['Order Inquiry', 'Product Availability', 'Private Appointment', 'Press & Editorial', 'Other'];

export function ContactForm() {
  return (
    <section className="flex justify-center">
      <div className="mx-auto w-[90%] border border-zinc-300 bg-zinc-50 p-6 md:w-[70%] md:p-8 lg:w-[50%]">
        <h2 className="text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">Get in Touch</h2>

        <form className="mt-8 space-y-5" action="#" method="post">
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Name</span>
            <Input name="name" placeholder="Enter your full name" aria-label="Name" className="rounded-none border-zinc-200 bg-transparent focus:border-zinc-700 focus:ring-zinc-200" />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Email</span>
            <Input type="email" name="email" placeholder="hello@example.com" aria-label="Email" className="rounded-none border-zinc-200 bg-transparent focus:border-zinc-700 focus:ring-zinc-200" />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Subject</span>
            <div className="relative">
              <select
                name="subject"
                aria-label="Subject"
                className="h-11 w-full appearance-none rounded-none border border-zinc-200 bg-transparent px-3 text-base text-zinc-700 outline-none transition focus:border-zinc-700 focus:ring-2 focus:ring-zinc-200"
                defaultValue="Order Inquiry"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">⌄</span>
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Message</span>
            <Textarea name="message" placeholder="Write your message here..." aria-label="Message" className="min-h-40 rounded-none border-zinc-200 bg-transparent focus:border-zinc-700 focus:ring-zinc-200" />
          </label>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-md border border-zinc-900 bg-zinc-900 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
