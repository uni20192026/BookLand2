// app/layout.js
import "./globals.css";
import Provider from "../components/SessionProvider";
import classes from "./layout.module.css";
import Sidebar from "../components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="container">
            <header>
              <nav>
                <ul className={classes.user}>
                  <li className={classes.username}>username</li>
                </ul>
              </nav>
            </header>
            <aside className="sidebar">
              <Sidebar />
            </aside>
            <main>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
