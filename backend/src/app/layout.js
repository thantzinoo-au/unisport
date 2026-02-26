export const metadata = {
  title: "UniSport API",
  description: "UniSport Campus Sports Facility Booking API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
