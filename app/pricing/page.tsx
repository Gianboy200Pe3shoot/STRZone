export default function PricingPage() {
  return (
    <main style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>STR Zone Pricing</h1>

      <p>
        Get instant access to permit steps, compliance checklists, rule change
        alerts, and city-by-city STR legality insights.
      </p>

      {/* BASIC - MONTHLY */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 10,
          marginTop: 30,
        }}
      >
        <h2>$9.99 / month — Compliance Guide</h2>
        <p>Includes everything you need to stay legal and avoid fines.</p>

        <a
          href="https://buy.stripe.com/9B68wI22R1Ab3yxb4w5os01"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            background: "black",
            color: "white",
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          Get Basic
        </a>
      </div>

      {/* PRO - MONTHLY */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <h2>$19.99 / month — Pro Access</h2>
        <p>
          Everything in Basic — plus rule-change alerts, saved cities, permit
          walkthroughs, and priority support.
        </p>

        <a
          href="https://buy.stripe.com/8x2eV65f32Efb0Z3C45os02"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            background: "black",
            color: "white",
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          Go Pro
        </a>
      </div>
    </main>
  );
}
