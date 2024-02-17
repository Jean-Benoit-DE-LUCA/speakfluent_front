import Main from "./main";
import Head from "../../components/Head/page";



// ROOT COMPONENT //

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <Head />
      <body>
        <Main>
          {children}
        </Main>
      </body>
    </html>
  )
}
