import { LegalPage } from "@/components/site/LegalPage";

const Privacy = () => (
  <LegalPage
    eyebrow="Legal"
    title={<>Privacy <span className="bg-leaf px-3 text-leaf-foreground">Policy</span></>}
    intro="What data we collect, why we collect it, and how we keep it safe — written for humans, not lawyers."
    updated="April 2025"
    sections={[
      {
        h: "What we collect",
        p: <p>Your name, phone, email, delivery addresses, payment details (tokenised — we never store full card numbers), order history, device info and approximate location while using the app.</p>,
      },
      {
        h: "Why we collect it",
        p: <p>To deliver your orders, route riders, process payments, prevent fraud, recommend vendors you'll love, and improve the app. That's it.</p>,
      },
      {
        h: "Who we share with",
        p: <>
          <p>Your name, address and phone are shared with the vendor and rider for the specific order they're handling. Payment info is shared securely with our processors (Paystack, Flutterwave).</p>
          <p>We never sell your data. Period.</p>
        </>,
      },
      {
        h: "Cookies & tracking",
        p: <p>Our website uses essential cookies for login and basic analytics (page views, popular pages). You can disable non-essential cookies in your browser settings.</p>,
      },
      {
        h: "Data security",
        p: <p>All data is encrypted in transit (TLS 1.3) and at rest. We follow NDPR (Nigeria Data Protection Regulation) standards and conduct annual security audits.</p>,
      },
      {
        h: "Your rights",
        p: <p>You can request a copy of your data, ask us to delete it, or correct anything inaccurate. Email privacy@gobuyme.shop and we'll respond within 30 days.</p>,
      },
      {
        h: "Data retention",
        p: <p>Order history is kept for 7 years for tax compliance. If you delete your account, your personal details are anonymised within 30 days.</p>,
      },
      {
        h: "Children",
        p: <p>GoBuyMe is not intended for users under 18. We do not knowingly collect data from minors.</p>,
      },
      {
        h: "Changes",
        p: <p>We'll notify you in-app and by email if this policy changes materially. Continued use after the change date means you accept the new policy.</p>,
      },
      {
        h: "Contact our DPO",
        p: <p>Data Protection Officer: privacy@gobuyme.shop · GoBuyMe Technologies Ltd, 12 Admiralty Way, Lekki Phase 1, Lagos.</p>,
      },
    ]}
  />
);

export default Privacy;
