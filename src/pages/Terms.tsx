import { LegalPage } from "@/components/site/LegalPage";

const Terms = () => (
  <LegalPage
    eyebrow="Legal"
    title={<>Terms of <span className="bg-primary px-3 text-primary-foreground">Service</span></>}
    intro="The plain-English rules for using the GoBuyMe app, website and services in Nigeria."
    updated="April 2025"
    sections={[
      {
        h: "Who we are",
        p: <p>GoBuyMe Technologies Limited (RC: 1234567) is a Nigerian company offering on-demand delivery of food, groceries, pharmacy items and errand services through our mobile app and website.</p>,
      },
      {
        h: "Your account",
        p: <p>You must be at least 18 years old to create an account. You are responsible for your login details, and any activity from your account. Notify us immediately if you suspect unauthorised access.</p>,
      },
      {
        h: "Orders & payments",
        p: <>
          <p>Prices shown in the app include VAT. Payment is taken at order placement via card, transfer, or wallet.</p>
          <p>Once a vendor accepts your order, cancellations may incur a fee covering rider dispatch and food preparation.</p>
        </>,
      },
      {
        h: "Delivery",
        p: <p>Estimated delivery times are best-effort and depend on traffic, weather and vendor preparation. We are not liable for delays caused by circumstances beyond our control.</p>,
      },
      {
        h: "Refunds",
        p: <p>If your order arrives damaged, incorrect or never arrives, contact support within 24 hours for a full refund or re-delivery. Refunds settle to your original payment method within 5 business days.</p>,
      },
      {
        h: "Vendor & rider conduct",
        p: <p>Vendors and riders are independent contractors. We vet, train and rate them, but they are responsible for the quality of food, accuracy of items and safe delivery.</p>,
      },
      {
        h: "Prohibited use",
        p: <p>You may not use GoBuyMe to order or transport illegal substances, weapons, hazardous materials, or anything restricted by Nigerian law.</p>,
      },
      {
        h: "Liability",
        p: <p>To the extent permitted by law, GoBuyMe's total liability for any claim is limited to the value of the order in question. We are not liable for indirect or consequential losses.</p>,
      },
      {
        h: "Changes",
        p: <p>We may update these terms. Material changes will be notified in-app and by email at least 14 days before they take effect.</p>,
      },
      {
        h: "Contact",
        p: <p>Questions about these terms? Email legal@gobuyme.shop.</p>,
      },
    ]}
  />
);

export default Terms;
